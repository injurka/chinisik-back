import type { SignInUserPayload, SignUpUserPayload } from '~/models/auth'
import { prisma } from '~/prisma'
import { sendVerificationCode } from '~/utils/email'

class AuthService {
  signUp = async (payload: SignUpUserPayload) => {
    const storedCode = await prisma.emailVerificationCode.findFirst({
      where: { email: payload.email },
    })

    if (!storedCode || storedCode.code !== payload.email_verification_code) {
      throw new Error('Invalid verification code')
    }

    const hashedPassword = await Bun.password.hash(payload.password)

    return prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
      },
    })
  }

  signIn = async (payload: SignInUserPayload) => {
    const user = await prisma.user.findFirstOrThrow({ where: { email: payload.email } })

    const isPasswordValid = await Bun.password.verify(payload.password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    return user
  }

  createVerificationCode = async (email: string) => {
    const code = Math.random().toString(36).substring(2, 8)

    await prisma.emailVerificationCode.create({
      data: {
        email,
        code,
      },
    })

    await sendVerificationCode(email, code)
  }
}

export { AuthService }
