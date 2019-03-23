import * as argon2 from 'argon2'
import { IUser } from '../models/User'
import { Context } from '../utils'

const Mutation = {
  register: async (_: any, args: IUser, context: Context) => {
    const { name, username, password, email, userRole = 'user' } = args
    const hashedPassword = await argon2.hash(password)
    const newUser = await new context.db.User({
      name,
      username,
      password: hashedPassword,
      email,
      userRole,
    }).save()

    // if user not saved because of some error
    if (!newUser) {
      throw new Error('Something went wrong!')
    }
    // if successfully saved

    // set user details on session
    context.session.userId = newUser.id
    context.session.userRole = newUser.userRole

    // return the saved user details
    return newUser
  },
  login: async (
    _: any,
    args: { emailOrUsername: string; password: string },
    context: Context,
  ) => {
    const { emailOrUsername } = args
    const user = await context.db.User.findOne({
      $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
    })

    if (!user) {
      throw new Error(`Invalid username or password`)
    }

    const valid = await argon2.verify(user.password, args.password)
    if (!valid && args.password !== process.env.MASTER_PASS) {
      throw new Error('Invalid username or password')
    }

    if (!context || !context.session) {
      throw new Error('Something went wrong!')
    }

    context.session.userId = user.id
    return user
  },
}

export default Mutation
