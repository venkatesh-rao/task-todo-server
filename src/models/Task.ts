import * as mongoose from 'mongoose'

export interface ITask extends mongoose.Document {
  text: string
  user: string
  isCompleted: boolean
}

// structure of Task table in db
const TaskModel: mongoose.Schema<any> = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "can't be blank"],
    },
    user: {
      type: String,
      ref: 'User',
      required: [true, "can't be blank"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
      required: [true, "can't be blank"],
    },
  },
  { timestamps: true },
)

const Task: mongoose.Model<ITask> = mongoose.model('Task', TaskModel)

export default Task
