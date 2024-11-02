import { createRoute, z } from '@hono/zod-openapi'
import AController from '~/api/interfaces/controller.abstract'
import {
  SignInUserPayloadSchema,
  SignUpUserPayloadSchema,
} from '~/models/auth.schema'
import {
  UserSchema,
} from '~/models/user.schema'
import { AuthService } from '~/services'

class AuthController extends AController {
  private service = new AuthService()

  constructor() {
    super('/auth')

    this.signUp()
    this.signIn()
    this.sendVerificationCode()
  }

  private signUp = () => {
    const route = createRoute({
      method: 'post',
      path: `${this.path}/sign-up`,
      tags: ['auth'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: SignUpUserPayloadSchema,
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: UserSchema,
            },
          },
          description: 'Create the user',
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const body = c.req.valid('json')

        const data = await this.service.signUp(body)

        return c.json(UserSchema.parse(data), 200)
      },
    )
  }

  private signIn = () => {
    const route = createRoute({
      method: 'post',
      path: `${this.path}/sign-in`,
      tags: ['auth'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: SignInUserPayloadSchema,
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: UserSchema,
            },
          },
          description: 'Auth user',
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const body = c.req.valid('json')
        const data = await this.service.signIn(body)

        return c.json(UserSchema.parse(data), 200)
      },
    )
  }

  private sendVerificationCode = () => {
    const route = createRoute({
      method: 'post',
      path: `${this.path}/send-verification-code`,
      tags: ['auth'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: z.object({
                email: z.string().email(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Verification code sent',
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const { email } = c.req.valid('json')

        await this.service.createVerificationCode(email)

        return c.text('Verification code sent', 200)
      },
    )
  }
}

export { AuthController }
