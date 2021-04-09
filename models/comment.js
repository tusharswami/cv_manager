const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
        isAgent : {
            type : Boolean,
            // required : true
        },
        commentBy : {
            type : String,
            required : true
        },
        body : {
            type : String,
            required : true
        },
        hasAttachment : {
            type : Boolean,
            required : true,
            default : false
        },
        attachmentUrl : {
            type : String,
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Comment', commentSchema);