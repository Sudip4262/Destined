const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    taskname:String,
    taskdesc:String,
    time:Date,
    completed:Boolean,
})

const TaskDateSchema = new mongoose.Schema({
    taskdate:String,
    tasks:[TaskSchema]
})

const userTaskSchema = new mongoose.Schema({
    email: String,
    dates:[TaskDateSchema]
})

const UserTask = mongoose.model("UserTask",userTaskSchema)
 
module.exports = UserTask