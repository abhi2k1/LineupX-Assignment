const express = require('express');
const router = express.Router();

require('../db/conn.js');
const authentication = require('../middleware/authentication');
const Job = require('../model/jobSchema');
const Application = require("../model/applicationSchema");

//recievedJobs
router.get("/recievedJobs",authentication,async (req,res)=>{
    if(req.rootUser.role=='Candidate'){
        try{
            const result = await Job.find({archive:false});
            res.status(202).send(result);
        }catch(err){
            console.log(err);
        }

    }else{
        return res.status(404).json({message:"You don't have permission"});
    }
});

//accepting the Jobs
router.post("/acceptJobs",authentication,async (req,res)=>{

    if(req.rootUser.role=="Candidate"){

        const {jobId,title,creatorName,jobDescription} = req.body;
        const {userName,name,email}=req.rootUser;

        try{
            const applicationStatus = 'Accept';
            const application = Application({jobId,title,creatorName,jobDescription,userName,name,email,applicationStatus});

            await application.save();

            return res.status(202).json({message:"Job accepted Successfully"});

        }catch(err){
            console.log(err);
        }

    }else{
        return res.status(404).json({message:"You don't have permission"});
    }
    
});

//accepted jobs
router.get('/acceptedJobs',authentication,async (req,res)=>{
    if(req.rootUser.role=="Candidate"){

        try{
            const result = await Application.find({applicationStatus:'Accept'});
            return res.send(result);
        }catch(err){
            console.log(err);
        }

    }else{
        return res.status(404).json({message:"You don't have permission"});
    }
});

//rejecting the jobs
router.post("/rejectJobs",authentication,async (req,res)=>{

    if(req.rootUser.role=="Candidate"){

        const {jobId,title,creatorName,jobDescription} = req.body;
        const {userName,name,email}=req.rootUser;

        try{
            const applicationStatus = 'Reject';
            const application = Application({jobId,title,creatorName,jobDescription,userName,name,email,applicationStatus});

            await application.save();

            return res.send(202).json({message:"Job Rejected Successfully"});

        }catch(err){
            console.log(err);
        }

    }else{
        return res.status(404).json({message:"You don't have permission"});
    }
    
});

//reject the jobs
router.get('/rejectedJobs',authentication,async (req,res)=>{
    if(req.rootUser.role=="Candidate"){

        try{
            const result = await Application.find({applicationStatus:'Reject'});
            return res.send(result);
        }catch(err){
            console.log(err);
        }

    }else{
        return res.status(404).json({message:"You don't have permission"});
    }
});

module.exports = router;