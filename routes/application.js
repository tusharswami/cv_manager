const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Application = require('../models/application');
const {errorHandler} = require('../helpers/dbErrorHandler');
const axios = require('axios');
const AWS = require('aws-sdk');
const multer = require('multer');
const { getApplication, addComment, getCommentByEmail, registerApplication } = require('../controllers/application');
let SMS_API;
if(process.env.USE_HEROKU == 'true'){
    SMS_API = process.env.SMS_SERVICE_HEROKU;
}else{
    SMS_API = process.env.SMS_SERVICE;
}
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY
})
// Test Multer
const storageAws = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const uploadAws = multer({storageAws}).single('popUrl')

// var upload = multer({storage : storage})
router.post('/pre-register', uploadAws, registerApplication)

// Get all Application Data depending upon Request Body for applying filters
router.post('/get', getApplication)

router.post('/comment/new', uploadAws, addComment)

router.get('/:email/comments/get', getCommentByEmail)

module.exports = router;