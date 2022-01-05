import amqp, { Channel } from "amqplib/callback_api"

import { Note } from "../models/note.model"
import mongoose from "mongoose"

const dotenv = require("dotenv")
dotenv.config()

const queueUrl = process.env.RABBITMQ_URI

let channel: Channel
let queue = process.env.MQ_QUEUE

let count = 0
export async function setupRabbit() {
  amqp.connect(queueUrl, createChannel)
}

const createChannel = (err: any, conn: any) => {
  if (err) {
    return console.log(err)
  }
  conn.createChannel((error: any, ch: Channel) => {
    if (error) {
      return console.log(error)
    }
    channel = ch
    ch.assertQueue(queue, {
      durable: true,
    })
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue)
    channel.consume(queue, consumeMessage, {
      noAck: true,
    })
  })
}

async function consumeMessage(msg: any) {
  count++
  const note = await Note.findOne({ _id: msg.content.toString() })
  if (!note) {
    return
  }
  console.log(`Received message ${count} - ${note.title}`)
}

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("Connected to MongoDB")

  setupRabbit()
})
