import { createRoute, z } from '@hono/zod-openapi'
import { getCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import AController from '~/api/interfaces/controller.abstract'
import { jwtGuard } from '~/middleware'
import {
  AuthUserSchema,
  type GitHubEmail,
  type GitHubNormalizedUser,
  type GitHubTokenData,
  type GitHubUser,
  normalizeGitHubUser,
  SignInUserPayloadSchema,
  SignUpUserPayloadSchema,
} from '~/models/auth'
import { prisma } from '~/prisma'
import { AuthService } from '~/services'
import { jwtEncode } from '~/utils/jwt'

class AuthController extends AController {
  private service = new AuthService()

  constructor() {
    super('/auth')

    this.auth()
    this.signUp()
    this.signIn()
    this.sendVerificationCode()
    this.oauthGithub()
    this.oauthGithubCallback()
  }

  // Base Auth

  private auth = () => {
    const route = createRoute({
      method: 'get',
      path: `${this.path}/me`,
      tags: ['auth'],
      request: {
        headers: z.object({ authorization: z.string() }),
      },
      security: [{ bearerAuth: ['authorization'] }],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: AuthUserSchema,
            },
          },
          description: 'Auth user',
        },
      },
    })

    this.router.use(route.path, jwtGuard)
    this.router.openapi(
      route,
      async (c) => {
        const user = c.get('user')
        const token = c.get('jwt')

        const data = {
          user,
          token,
        }

        return c.json(AuthUserSchema.parse(data), 200)
      },
    )
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
              schema: AuthUserSchema,
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

        return c.json(AuthUserSchema.parse(data), 200)
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
              schema: AuthUserSchema,
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

        return c.json(AuthUserSchema.parse(data), 200)
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

  // OAuth
  // -> GitHub

  private oauthGithub = () => {
    const route = createRoute({
      method: 'get',
      path: `${this.path}/github`,
      tags: ['auth'],
      responses: {
        302: {
          description: 'Redirect to GitHub OAuth',
          headers: {
            Location: {
              schema: { type: 'string' },
              description: 'GitHub OAuth URL',
            },
          },
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const state = Bun.randomUUIDv7()
        const url = new URL('https://github.com/login/oauth/authorize')

        url.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID!)
        url.searchParams.set('redirect_uri', process.env.GITHUB_CALLBACK!)
        url.searchParams.set('state', state)
        url.searchParams.set('scope', 'user:email')

        c.header('Set-Cookie', `oauth_state=${state}; HttpOnly; Path=/; SameSite=Lax`)

        return c.redirect(url.toString())
      },
    )
  }

  private oauthGithubCallback = () => {
    const route = createRoute({
      method: 'get',
      path: `${this.path}/github/callback`,
      tags: ['auth'],
      request: {
        query: z.object({
          code: z.string(),
          state: z.string(),
        }),
      },
      responses: {
        302: {
          description: 'OAuth callback handler',
          headers: z.object({
            Location: z.string().describe('Frontend redirect URL'),
          }),
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const { code, state } = c.req.valid('query')
        const savedState = getCookie(c, 'oauth_state')

        if (!state || state !== savedState) {
          throw new HTTPException(401, { message: 'Invalid state' })
        }

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            state,
          }),
        })

        if (!tokenResponse.ok) {
          throw new HTTPException(401, { message: 'GitHub OAuth token exchange failed' })
        }

        const tokenData = await tokenResponse.json() as GitHubTokenData
        const accessToken = tokenData.access_token

        const [userResponse, emailsResponse] = await Promise.all([
          fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          }),
          fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          }),
        ])

        if (!userResponse.ok) {
          throw new HTTPException(401, { message: 'Failed to fetch GitHub user data' })
        }

        const user = await userResponse.json() as GitHubUser
        const emails = await emailsResponse.json() as GitHubEmail[]

        const normalizedUser: GitHubNormalizedUser = normalizeGitHubUser(user, emails)

        if (!normalizedUser.email) {
          throw new HTTPException(400, { message: 'Verified email required' })
        }

        const upsertedUser = await prisma.user.upsert({
          where: {
            githubId: normalizedUser.id,
          },
          create: {
            githubId: normalizedUser.id,
            email: normalizedUser.email,
            name: normalizedUser.name,
            password: '',
            UserPermission: {
              create: [{ permission: 'AiGenerate' }],
            },
          },
          update: {
            name: normalizedUser.name,
            updatedAt: new Date(),
          },
          include: {
            UserPermission: true,
          },
        })

        const token = await jwtEncode({ id: upsertedUser.id })

        setCookie(c, 'oauth_state', '', {
          expires: new Date(0),
          path: '/',
        })

        return c.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
      },
    )
  }

  // -> Google
  // TODO
}

export { AuthController }
