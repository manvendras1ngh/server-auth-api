const mongoose = require("mongoose");
const secret = require("../config/secrets");

const mongoURI = secret.databaseURL;
const initialiseDBConnection = async() =>{
  try{
    const connection = await mongoose.connect(mongoURI);
    if(connection){
      console.log("Suceessfully connected to DB");
    };
  }catch(error){
    console.error("Error connecting to DB", error);
  }
};

module.exports = {initialiseDBConnection};