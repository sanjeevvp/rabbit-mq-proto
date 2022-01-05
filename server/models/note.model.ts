import { Schema, model } from "mongoose"

export interface INote extends Document {
  title: string
  content: string
  sent: number
  createdAt: Date
  updatedAt: Date
}

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    sent: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Note = model<INote>("Note", noteSchema)
