import type { Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import { UserService } from '~/services'

async function jwtGuard(c: Context, next: Next) {
  const authHeader = c.req.header('x-authorizaition') ?? c.req.header('Authorizaition')

  if (!authHeader) {
    return c.json({ message: 'Authorization header missing' }, 401)
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return c.json({ message: 'Token missing' }, 401)
  }

  try {
    const secret = process.env.JWT_SECRET!
    const decoded = await verify(token, secret) as { userId: number }

    const userService = new UserService()

    const user = await userService.getUserByUserId(decoded.userId)
    const userPermissions = await userService.getPermissionsByUserId(user.id)

    c.set('jwt', token)
    c.set('user', user)
    c.set('permissions', userPermissions)

    await next()
  }
  catch {
    return c.json({ message: 'Invalid token' }, 401)
  }
}

export { jwtGuard }
