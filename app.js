const express = require('express');
const app = express();
const dotenv = require('dotenv');
var cookieParser = require('cookie-parser')

dotenv.config({path : './config.env'});

require("./db/conn");

app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT;

//api calling
app.use(require("./router/auth.js"));
app.use(require("./api/openJobs"));
app.use(require('./api/recievedJobs'));


app.listen(PORT,()=>{
    console.log(`server at ${PORT}`);
});