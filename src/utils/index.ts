export interface Session extends Express.Session {
  userId?: string
  userRole?: string
}

export interface Request extends Express.Request {
  user?: any
}

export interface Context {
  session: Session
  req: Request
  res: Express.Response
  db: any
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any,
) => any

export interface ResolverMap {
  [key: string]: Resolver | { [key: string]: Resolver }
}
