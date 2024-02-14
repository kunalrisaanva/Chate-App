const mongoose = require("mongoose");

async function dbConnection (url){
    try {
       const dbConnection = await mongoose.connect(url,{
        dbName:"Chate_App"
       });
        console.log(`db connected !! ${dbConnection.connection.host} `);
        
    } catch (error) {
        console.log("ERROR",error.message);
        process.exit(1);
    }
}

module.exports = dbConnection 