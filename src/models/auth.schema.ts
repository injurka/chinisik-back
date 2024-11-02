import { z } from '@hono/zod-openapi'

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
  SignInUserPayloadSchema,
  SignUpUserPayloadSchema,
}
