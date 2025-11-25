const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    Email:String,
    Password:String,
    Date:Date,
    Time:String
})

const User = mongoose.model('User',userSchema)

module.exports = User