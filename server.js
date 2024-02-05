const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors")
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const users = require("./models/user.models");
const secret = require("./config/secrets.js");

const { initialiseDBConnection } = require("./db/database.connect.js");
const {authVerify} = require("./middlewares/auth-verify.middleware.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));// express middleware to read headers and body.

const JWT_SECRET = secret.jwtSecret;

initialiseDBConnection();

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });
  

app.get("/", async (req, res) => {
  res.send("Hello Express!");
});

app.post("/login", async(req, res) => {
  const { username, password } = req.body;

  try{
    const user = await users.findOne({username});
    
    if(user && user.password === password){
      const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "24hrs"});
      console.log("Login Successful");
      res.status(200).json({message: "Login Successfull", token, user});
    }else{
      console.log("Invalid Credentials");
      res.status(401).json({message: "Invalid Credentials!"});
    }
  }catch(error){
    console.error("Error encountered while Login", error);
    res.status(500).json({message: "Internal server error!"})
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, dateOfBirth, username, password } = req.body;
  console.log(req.body);
  
  try {
    const userExist = await users.findOne({ username });

    if (userExist) {
      res.status(400).json({ message: "username already taken" });
    }

    const newUser = new users({ name, email, dateOfBirth, username, password });
    await newUser.save();

    console.log("Successfully Signed-up", newUser);
    res.status(201).json({ message: "Signed-up successfully", newUser });
  } catch (error) {
    console.error("Error signing up", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// app.get("/user-details", authVerify, (req, res) => {
//   res.send("details fetched");
// })

app.listen(port || 3000, () => {
  console.log(`Server running on port ${port}`);
});
