import { Request, Response } from "express"

import { Note } from "./models/note.model"
import { sendMessageToRabbit } from "./rabbit"

export async function return200(req: Request, res: Response) {
  res.sendStatus(200)
}

export async function createNote(req: Request, res: Response) {
  const { title, content } = req.body

  const note = await Note.create({ title, content })

  res.jsonp(note)
}

export async function sendNote(req: Request, res: Response) {
  const { id } = req.params

  const note = await Note.findById(id)

  if (!note) {
    return res.sendStatus(404)
  }

  // Send message to RabbitMQ
  for (let i = 0; i < 10; i++) {
    note.sent++
    await note.save()
    await sendMessageToRabbit(note._id.toString())
  }
  return res.sendStatus(200)
}
