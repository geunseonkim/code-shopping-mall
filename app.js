const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const indexRouter = require("./routes/index")
require("dotenv").config()

const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD
// console.log("mongoURI", MONGODB_URI_PROD)

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json()) // req.body가 객체로 인식된다.
app.use("/api", indexRouter)

// const mongoURI = process.env.LOCAL_DB_ADDRESS
const mongoURI = MONGODB_URI_PROD

mongoose.connect(mongoURI).then(()=>(
    console.log("mongoose connected")
)).catch ((err) => {
    console.log("DB connection fail", err)
})

app.listen(process.env.PORT || 4000, () => {
    console.log("server on 4000")
})