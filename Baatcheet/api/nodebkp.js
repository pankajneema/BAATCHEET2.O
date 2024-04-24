// Hi , this is node server for baatcheet backend 

//  init require modules 

const express  = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;


const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

mongoose.connect(
    "mongodb+srv://pankaj200321:UIUHoXhfnK94f45x@cluster1.ghvgdoa.mongodb.net/",
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(() => {
    console.log("Mongo Db connected suceesfully");
}).catch((err) => {
    console.log("Error in connecting MongoDB :",+ err);
});


const User = require("./modoles/user");
const Message = require("./modoles/message");

// function to create token 
const createToken = (userId) => {
   const payload = {
    userId :userId,
   };
   const token  = jwt.sign(payload,"oi#$%PIuFGVTY%^$%*$#$",{expiresIn:"24h"});

   return token;
}
// New User Register Endpoint

app.post("/register",(req,res)=> {
     const {name ,email,password,image}  =req.body;
    //  register new user object
    const newUser = new User({name,email,password,image});
    newUser.save().then(() => {
        res.status(200).json({Message:"User Registered Succesfully"})
        console.log("New User Registered Succesfully ..");
    }).catch((err) => {
        res.status(500).json({Message:"Server Error"})
        console.log("Erorn in New User Registration : "+ err);

    })
})

//  User Login Endpoint

app.post("/login",(req,res)=> {
     const {email,password}  =req.body;

     if (!email){
        return res.status(404).json({Message:"Email is required"});
     }


     if (!password){
        return res.status(404).json({Message:"Password is required"})
     }

     User.findOne({email}).then((user) => {
        if(!user){
            console("User not Found" + user);
            return res.status(404).json({Message:"User not Found"});
        }
        if (user.password !== password){
            console.log("Password Mismatch");
            return res.status(404).json({Message:"Incorrect Password"});
        }

        const token =  createToken(user._id);
        return res.status(200).json({token});

     }).catch((error) => {
        console.log("LogedIn Error == ", error);
        res.status(500).json({message:"Internal Server Error"});
     })


});


app.listen(port, () => {
    console.log("Node server running on port: " + port);
}).on('error', (err) => {
    console.log("Error in starting server: " + err);
});


