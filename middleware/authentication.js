const jwt = require("jsonwebtoken");
const Candidate = require("../model/candidateSchema");
const Employer = require("../model/employerSchema");

const Authenticate = async (req,res,next) =>{
    try{

        const token = req.cookies.jwtoken;
        const member = req.cookies.member;
        let rootUser;
        console.log(token);
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);

        if(member=="Employer"){
            rootUser = await Employer.findOne({_id:verifyToken._id, "tokens.token":token});
        }else if (member=="Candidate"){
            rootUser = await Candidate.findOne({_id:verifyToken._id, "tokens.token":token});
        }


        if(!rootUser){
            throw new Error("User not Found");
        }

        req.token=token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    }catch(err){
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
    }
}

module.exports = Authenticate;