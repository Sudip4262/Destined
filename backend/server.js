require('dotenv').config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const ConnectDB = require("./Connection/MongoDb")
const TaskDataRoute = require('./routes/TaskDataRoute')

const app = express()
app.use(cors())
app.use(bodyParser.json())
ConnectDB()



app.use('/TaskData',TaskDataRoute)



PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on ${PORT}`))