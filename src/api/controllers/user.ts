import { createRoute, z } from '@hono/zod-openapi'
import AController from '~/api/interfaces/controller.abstract'
import {
  PermissionSchema,
  SignInUserPayloadSchema,
  SignUpUserPayloadSchema,
  UserSchema,
} from '~/models/user.schema'
import UserService from '~/services/user'

class UserController extends AController {
  private service = new UserService()

  constructor() {
    super('/user')

    // Auth
    this.signUp()
    this.signIn()
    this.sendVerificationCode()

    // Base
    this.getById()
    this.getPermissionsByUserId()
  }

  private signUp = () => {
    const route = createRoute({
      method: 'post',
      path: `${this.path}/sign-up`,
      tags: ['user'],
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
      tags: ['user'],
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
      tags: ['user'],
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

  private getById = () => {
    const route = createRoute({
      method: 'get',
      path: `${this.path}/{id}`,
      tags: ['user'],
      request: {
        params: z.object({
          id: z
            .string()
            .openapi({
              param: {
                name: 'id',
                in: 'path',
              },
            }),
        }),
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: UserSchema,
            },
          },
          description: 'Retrieve the user by id',
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const { id } = c.req.valid('param')
        const data = await this.service.getByWhere({ where: { id: +id } })

        return c.json(UserSchema.parse(data), 200)
      },
    )
  }

  private getPermissionsByUserId = () => {
    const route = createRoute({
      method: 'get',
      path: `${this.path}/{id}/permisson`,
      tags: ['user'],
      request: {
        params: z.object({
          id: z
            .string()
            .openapi({
              param: {
                name: 'id',
                in: 'path',
              },
            }),
        }),
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: PermissionSchema,
            },
          },
          description: 'Retrieve permission for the user by id',
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const { id } = c.req.valid('param')
        const data = await this.service.getPermissionsByUserId(+id)

        return c.json(PermissionSchema.parse(data), 200)
      },
    )
  }
}

export default UserController
