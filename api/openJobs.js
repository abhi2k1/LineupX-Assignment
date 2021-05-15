const express = require('express');
const router = express.Router();

require('../db/conn.js');
const authentication = require('../middleware/authentication');
const Job = require('../model/jobSchema');


//create jobs
router.post("/createJobs",authentication,async (req,res)=>{
    const role=req.rootUser.role;
    if(role=="Employer"){

        const { jobId, title, ctc,description } = req.body;

        if (!jobId || !title || !description) {
            return res.status(422).json({ error: "Plz filled the details" });
          }
          try {
            const jobExist = await Job.findOne({ jobId });
            if (jobExist) {
              return res
                .status(422)
                .json({ error: "Already Job with this id registered" });
            }
            const creatorName = req.rootUser.name;
            let job;
            if (!ctc) {
              job = new Job({ jobId, title, creatorName,description });
            } else {
              job = new Job({ jobId, title, ctc, creatorName,description });
            }
      
            await job.save();
      
            return res.status(201).json({ message: "Job registered successfully" });
          } catch (e) {
            console.log("error");
            console.log(e);
          }
    

    }else{
        return res.status(404).json({message:"You don't have permission"});
    }
});

//open jobs
router.get("/openJobs",authentication,async (req,res)=>{
    if(req.rootUser=="Employer"){

        try{
            const creatorName = req.rootUser.name;
    
            const result = await Job.find({creatorName});
    
            return res.send(result);
        }catch(err){
            console.log(err);
        }
    }else{
        return res.status(404).json({message:"You don't have permission"});
    }
    
});


module.exports = router;