import { Context } from '../utils'

const Query = {
  isLoggedIn: async (_: any, __: any, context: Context) =>
    context !== null &&
    context.session !== null &&
    context.session.userId !== null,
  isAdminLoggedIn: async (_: any, __: any, context: Context) =>
    context !== null &&
    context.session !== null &&
    context.session.userRole === 'admin',
}

export default Query
