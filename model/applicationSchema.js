const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    jobId:{
        type :"String",
        required:true
    },
    title:{
        type:"String",
        required:true
    },
    creatorName:{
        type:"String",
        required:true
    },
    jobDescription:{
        type:"String",
        required:true
    },
    userName:{
        type:"String",
        required:true
    },
    name:{
        type:"String",
        required:true
    },
    email:{
        type:"String",
        required:true
    },
    applicationStatus:{
        type:"String",
        default:"Applied"
    }
});


const Application = mongoose.model('Application',applicationSchema);

module.exports = Application;