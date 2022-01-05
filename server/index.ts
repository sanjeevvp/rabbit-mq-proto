import { createNote, return200, sendNote } from "./controllers"

import bodyParser from "body-parser"
import express from "express"
import mongoose from "mongoose"
import { setupRabbit } from "./rabbit"

const dotenv = require("dotenv")
dotenv.config()

const app = express()
app.use(bodyParser.json())
app.get("/", [return200])
app.post("/", [createNote])
app.put("/:id", [sendNote])

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("Connected to MongoDB")
  app.listen(3000, () => {
    console.log("Server is running on port 3000")
    setupRabbit().then(() => {
      console.log("RabbitMQ is running")
    })
  })
})
