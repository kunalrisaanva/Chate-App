const mongoose = require("mongoose");

async function dbConnection (url){
   await mongoose.connect(url);
    console.log('db connected')
}

module.exports = dbConnection 