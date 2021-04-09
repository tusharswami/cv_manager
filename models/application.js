const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema(
    {
        //Schema Goes Here
        name : {
            type : String,
            required: true
        },
        email : {
            type : String,
            required: true,
            unique : true,
            default : "Not Set"
        },
        mobile : {
            type: Number,
            required: true
        },
        coverLetter : {
            type : String,
            required : true
        },
        documentUrl : {
            type: String,
            required : true
        },
        likeWorking : {
            type : Boolean,
            required : true
        },
        termsAccepted : {
            type : Boolean,
            required : true,
        },
        status : {
            type : String,
            required : true,
            default : "Application Submitted"
        },
        isEmailVerified : {
            type : Boolean,
            required : true,
            default : false
        },
        isMobileVerified : {
            type : Boolean,
            required : true,
            default : false
        },
        secretCode : {
            type : String,
            required: true,
            default : 354453
        },
        comments : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('application', applicationSchema)