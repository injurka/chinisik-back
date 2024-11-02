import { z } from '@hono/zod-openapi'
import { Permission } from './user'

const UserSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const PermissionSchema = z.array(z.nativeEnum(Permission)).optional()

const SignUpUserPayloadSchema = z.object({
  email: z.string().email(),
  email_verification_code: z.string(),
  password: z.string().min(8).max(20),
})

const SignInUserPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
})

export {
  PermissionSchema,
  SignInUserPayloadSchema,
  SignUpUserPayloadSchema,
  UserSchema,
}
