const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

require('../db/conn');

const Candidate = require("../model/candidateSchema");
const Employer = require("../model/employerSchema");
const authentication = require("../middleware/authentication");

//sign up for candiadate
router.post("/signUpCandidate",async (req,res)=>{
    const {userName,password,name,email,phone} = req.body;

    if(!userName ||  !password || !name || !email || !phone){
        return res.status(422).json({error : "Plz filled the details"});
    }
    try{
        const candidateExist = await Candidate.findOne({userName});
        if(candidateExist){
            return res.status(422).json({message : "Already Candidate with this Username registered"});
        }
        const candidate = new Candidate({userName,password,name,email,phone});

        // generate salt to hash password
        const salt = await bcrypt.genSalt(12);
        // now we set user password to hashed password
        candidate.password = await bcrypt.hash(candidate.password, salt);

    
        await candidate.save();

        res.status(201).json({message : "Candidate registered successfully"});



    }catch(err){
        console.log(err);
        res.status(404).json({message : err});
        
    }
    
});


//sign up for Employer
router.post("/signUpEmployer",async (req,res)=>{
    const {userName,password,name,email,phone} = req.body;

    if(!userName ||  !password || !name || !email || !phone){
        return res.status(422).json({error : "Plz filled the details"});
    }
    try{
        const employerExist = await Employer.findOne({userName});
        if(employerExist){
            return res.status(422).json({message : "Already Employer with this Username registered"});
        }
        const employer = new Employer({userName,password,name,email,phone});

        // generate salt to hash password
        const salt = await bcrypt.genSalt(12);
        // now we set user password to hashed password
        employer.password = await bcrypt.hash(employer.password, salt);

    
        await employer.save();

        res.status(201).json({message : "Employer registered successfully"});



    }catch(err){
        console.log(err);
        res.status(404).json({message : err});
        
    }
    
});

//login for candidate user
router.post('/loginCandidate',async (req,res)=>{
    console.log("Inside Candidate");
    const {userName,password} = req.body;
    //console.log(userName,password);
    try{
        const candidateLogin = await Candidate.findOne({userName});
        if(candidateLogin){
            const validPassword = await bcrypt.compare(password, candidateLogin.password);
            if(validPassword){

                //tokenization
                token = await candidateLogin.generateAuthToken();
                console.log(token);

                res.cookie("jwtoken",token,{ 
                    expires:new Date(Date.now() + 3600 * 1000),
                    httpOnly:true
                });

                const member = "Candidate"

                res.cookie("member",member,{ 
                    expires:new Date(Date.now() + 3600 * 1000),
                    httpOnly:true
                });
                        
                return res.status(202).json({message : candidateLogin});
            }else{
                return res.status(402).json({message : "Invalid Credantials"});
            }
        }else{
            return res.status(402).json({message : "UserName does not exist"});
        }
    }catch(err){
        console.log(err);
    }
});

//login for employer
router.post('/loginEmployer',async (req,res)=>{
    console.log("Inside Employer");
    const {userName,password} = req.body;
    //console.log(userName,password);
    try{
        const employerLogin = await Employer.findOne({userName});
        if(employerLogin){
            const validPassword = await bcrypt.compare(password, employerLogin.password);
            if(validPassword){

                //tokenization
                token = await employerLogin.generateAuthToken();
                console.log(token);

                res.cookie("jwtoken",token,{ 
                    expires:new Date(Date.now() + 3600 * 1000),
                    httpOnly:true
                });

                const member = "Employer"

                res.cookie("member",member,{ 
                    expires:new Date(Date.now() + 3600 * 1000),
                    httpOnly:true
                });
                        
                return res.status(202).json({message : employerLogin});
            }else{
                return res.status(402).json({message : "Invalid Credantials"});
            }
        }else{
            return res.status(402).json({message : "UserName does not exist"});
        }
    }catch(err){
        console.log(err);
    }
});

//getting login user's data 
router.get("/userData",authentication,(req,res)=>{
    console.log("Hello user data!");
    res.send(req.rootUser);
});


module.exports = router;