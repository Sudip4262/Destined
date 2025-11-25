require('dotenv').config()
const mongoose = require('mongoose')

const ConnectDB = async () => {
    try{
        await mongoose.connect(process.env.MongoDB, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        } )
        console.log("MongoDB Connected")
    }
    catch(e){
        console.log(e)
    }
}

module.exports = ConnectDB;