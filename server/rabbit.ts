import amqp, { Channel } from "amqplib/callback_api"

const queueUrl = process.env.RABBITMQ_URI

let channel: Channel
let queue = process.env.MQ_QUEUE

export async function setupRabbit() {
  amqp.connect(queueUrl, (err, conn) => {
    if (err) {
      return console.log(err)
    }
    conn.createChannel((error, ch) => {
      if (error) {
        return console.log(error)
      }
      channel = ch
      ch.assertQueue(queue, {
        durable: true,
      })
    })
  })
}

export async function sendMessageToRabbit(message: string) {
  await channel.sendToQueue(queue, Buffer.from(message))
}
