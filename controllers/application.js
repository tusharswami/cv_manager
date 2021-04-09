exports.getApplication = async(req, res) => {
    let {
        email,
        status,
        mobile,
    } = req.body;
    let searchQueryObject = {};
    if(email){
        searchQueryObject = {
            ...searchQueryObject,
            email
        }
    }
    if(status){
        searchQueryObject = {
            ...searchQueryObject,
            status
        }
    }
    if(mobile){
        searchQueryObject = {
            ...searchQueryObject,
            mobile
        }
    }
    let ApplicationData = []
    if(!searchQueryObject){
        ApplicationData = await Application.find({}).populate('comments')
        console.log(ApplicationData)
    }else{
        console.log("else")
        console.log(searchQueryObject)
        ApplicationData = await Application.find(searchQueryObject).populate('comments')
    }
    res.json(ApplicationData)
}

exports.addComment = async (req, res, next) => {
    console.log(req.body);
    console.log(req.file)
    try {
        let {
            email,
            isAgent,
            commentBy,
            body
        } = req.body;
        let hasAttachment = false;
        let attachmentUrl = '';
    
        if(req.file){
            let myFile = req.file.originalname.split(".")
            const fileType = myFile[myFile.length - 1]
            if(fileType !== 'png' && fileType !== 'jpg' && fileType !== 'gif' && fileType !== 'jpeg' && fileType !== 'pdf' && fileType !== 'csv') {
                throw new Error(`${fileType} is not allowed for the Upload`)
            }
            console.log(fileType)
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${Date.now()}.${fileType}`,
                Body: req.file.buffer
            }
    
            s3.upload(params, async (error, data) => {
                if(error){
                    console.log(error)
                    return new Error(`${fileType} is not allowed for the Upload`)
                    return res.status(500).send(error)
                }
                let {Location} = data;
                (Location) ? hasAttachment = true : hasAttachment = false
                attachmentUrl = Location
                let commentRequestBody = {
                    isAgent : isAgent,
                    commentBy : commentBy.toString(),
                    body : body.toString(),
                    hasAttachment : hasAttachment,
                    attachmentUrl : attachmentUrl
                }
                try {
                    let applicationByEmail = await Application.findOne({email : email});
                    console.log(applicationByEmail)
                    if(!applicationByEmail) return res.status(404).json({err : `No Application found with${email}`});
                    let createdComment = await Comment.create(commentRequestBody);
                    console.log(createdComment)
                    applicationByEmail.comments.push(createdComment._id);
                    await Application.findOneAndUpdate({email}, applicationByEmail);
                    let updatedCommentById = await Application.findOne({email}).populate('comments').select('comments')
                    return res.status(200).json({
                        status : 200,
                        comments : updatedCommentById.address
                    })
                } catch (error) {
                    console.log(error.toString())
                    return res.status(500).json({
                        status : 500,
                        err : error.toString()
                    })
                }
            })
    
        }else{
            let commentRequestBody = {
                commentBy : commentBy.toString(),
                body : body.toString(),
                hasAttachment : hasAttachment,
                attachmentUrl : attachmentUrl
            }
            try {
                let applicationByEmail = await Application.findOne({email});
                console.log(applicationByEmail)
                if(!applicationByEmail) return res.status(404).json({err : `No Application found with ${email}`});
                let createdComment = await Comment.create(commentRequestBody);
                console.log(createdComment)
                applicationByEmail.comments.push(createdComment._id);
                let updatedCommentById = await Application.findOneAndUpdate({email}, applicationByEmail)
                return await res.status(200).json({
                    status : 200,
                    updatedCommentById
                })
            } catch (error) {
                return res.status(500).json({
                    status : 500,
                    err : error.toString()
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status : 500,
            err : `Something went wrong with the Server, Contact Admin \n Error Trace :${error}`
        })
    }
    
}

exports.getCommentByEmail = async (req, res) => {
    try {
        const {email} = req.params;
        if(!email || email === undefined){
            return res.status(400).status({
                status : 400,
                err : "Please Provide Valid Email"
            })
        }
        let commentsByEmail = await Application.findOne({email}).populate('comments').select('comments')
        return res.status(200).json({
            status : 200,
            comments : commentsByEmail.comments
        })
    } catch (error) {
        return res.status(500).status({
            status : 500,
            err : `Something Went Wrong, Check Error Trace ${error}`
        })
    }
}

exports.registerApplication = async (req, res, next) => {
    let popUrl = '';
    console.log(req.file)
    let email = req.body.email;
    let applicationByEmail = await Application.findOne({email});
    console.log(applicationByEmail)
    if(applicationByEmail) return res.status(404).json({err : `Already an Application found with ${email}`});
    try {
        if(req.file){
            console.log("Hello if");
            let myFile = req.file.originalname.split(".")
            console.log(myFile)
            const fileType = myFile[myFile.length - 1]
            if(fileType !== 'png' && fileType !== 'jpg' && fileType !== 'gif' && fileType !== 'jpeg' && fileType !== 'pdf' && fileType !== 'csv') {
                throw new Error(`${fileType} is not allowed for the Upload`)
            }
            console.log(fileType)
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${Date.now()}.${fileType}`,
                Body: req.file.buffer
            }
    
            s3.upload(params, async (error, data) => {
                if(error){
                    console.log(error)
                    return new Error(`${fileType} is not allowed for the Upload`)
                    return res.status(500).send(error)
                }
                let {Location} = data;
                console.log(Location)
                popUrl = Location

                let {
                    name,
                    email,
                    mobile,
                    coverLetter,
                    likeWorking,
                    termsAccepted
                } = req.body;
                console.log(req.file);
                console.log(req.body)
                console.log(popUrl)
                let requestBody = {
                    name: name.toString().trim(),
                    email : email.toString().trim(),
                    mobile : mobile.toString().trim(),
                    coverLetter : coverLetter.toString().trim(),
                    documentUrl : popUrl,
                    secretCode : Math.floor(100000 + Math.random() * 900000),
                    likeWorking : likeWorking,
                    termsAccepted : termsAccepted
                }
                console.log(requestBody)
                returnedApplicationData = await Application.create(requestBody);
                console.log(returnedApplicationData)
                let responseObject = {}
                res.status(200).json(returnedApplicationData);
            })
    
        }
        
        
    } catch (error) {
        console.log(error.toString())
        res.status(500).json({
            err : error.toString()
        })
    }
}