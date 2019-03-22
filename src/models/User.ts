import * as mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  name: string
  username: string
  password: string
  email: string
  userRole: string
  resetToken?: string
  resetTokenExpiry?: string
  profilePic?: string
  todos: string[]
}

// structure of USER table in db
const UserModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true,
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    userRole: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    todos: {
      type: [
        {
          type: String,
          ref: 'Todo',
        },
      ],
      required: [true, "can't be blank"],
    },
  },
  { timestamps: true },
)

const User: mongoose.Model<IUser> = mongoose.model('User', UserModel)

export default User
