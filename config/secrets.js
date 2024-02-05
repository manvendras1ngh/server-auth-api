require("dotenv").config();

const secret = {
    jwtSecret: process.env.JWT_SECRET,
    databaseURL: process.env.DATABASE_URL,
};

module.exports = secret;