const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const UserTask = require('../schema/TaskSchema');

router.post('/create', async(req, res) => {
    console.log("hi")
    const {TaskName, TaskDesc, time, Date, Email} = req.body;
    console.log(TaskName)
    console.log(TaskDesc)
    console.log(time)
    console.log(Date)

    try{
        const existingEmail= await UserTask.findOne({
            email:Email,
        })

        if(existingEmail){
            const existingDate = await UserTask.findOne(
                {email:Email, "dates.taskdate" : Date}
            )

            if(existingDate){
                await UserTask.updateOne(
                    {email:Email, "dates.taskdate":Date},
                    {
                        $push:{
                            "dates.$.tasks":{
                                taskname: TaskName,
                                taskdesc:TaskDesc,
                                time:time,
                                completed:false
                            }
                        }
                    }    
                )
                res.json(201, {message:"Data Posted on MongoDB"})
            } else{
                await UserTask.updateOne(
                    {email:Email},
                    {
                        $push:{
                            dates:{
                                    taskdate:Date,
                                    tasks:[
                                        {
                                            taskname:TaskName,
                                            taskdesc:TaskDesc,
                                            time:time,
                                            completed:false
                                        }
                                    ]
                                }
                        }
                    }    
                )
                res.json(201, {message:"Data Posted on MongoDB"})
            }
        } else{
            const newTask = new UserTask({
                email:Email,
                dates:[
                    {
                        taskdate:Date,
                        tasks:[
                            {
                                taskname:TaskName,
                                taskdesc:TaskDesc,
                                time:time,
                                completed:false
                            }
                        ]
                    }
                ]
            })
            newTask.save()
            res.json(201, {message:"Data Posted on MongoDB"})
        }
        
    }catch(error){
        console.log(error)
    }
})


router.get("/TaskPerDate", async(req, res)=>{
    try{
        const {email, date} = req.query
        // console.log(email, date)
        const userEmail = await UserTask.findOne({email:email}).lean()
        // console.log(userEmail)
    
        if(!userEmail){
            return res.status(404).json({message: "No data found for this email."});
        }
    
        const dateObject = userEmail.dates.find(d=>d.taskdate === date)
    
        if (!dateObject){
            return res.status(404).json({message:"No task for this date"})
        }
    
        res.json(dateObject);
    } catch(err){
        res.status(500).json({message:err})
    }

})



router.post("/updateTaskList", async(req, res)=>{
    const {NewTaskList, date, email} = req.body
    console.log(date)
    try{
        await UserTask.updateOne(
            {email:email, "dates.taskdate":date},
            {$set:{"dates.$.tasks":NewTaskList}}
        )
        res.status(200).json({message:"Updated TaskList"})

    } catch{
        res.status(400).json({message:"err"})
    }
})


router.post('/ChangeTaskStatus', async(req, res) => {
    const{taskStatus, email, date, Objectid} = req.body
    // console.log(taskStatus, email, date, Objectid)
    // console.log(new mongoose.mongo.ObjectId(Objectid))

    try{
        await UserTask.updateOne(
            {email:email},
            {$set:{"dates.$[d].tasks.$[t].completed":taskStatus}},
            {
                arrayFilters:[
                    {"d.taskdate": date},
                    {"t._id": new mongoose.mongo.ObjectId(Objectid)}
                ]
            }
        )
        return res.status(200).json({message:"Updated status"})
    } catch{
        res.status(400).json({message:"err"})
    }
})

router.post('/delete', async(req, res) => {
    // console.log("Delete things")
    const{date, ObjectId} = req.body
    // console.log(date, ObjectId)
    try{
        await UserTask.updateOne(
            {"dates.taskdate":date},
            {$pull:{"dates.$.tasks":{_id:new mongoose.mongo.ObjectId(ObjectId)}}}
        )
        return res.status(200).json({message:"Deleted Task"})
    } catch{
        res.status(400).json({message:"err"})
    }
})





module.exports = router