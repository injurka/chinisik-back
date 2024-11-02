import type { $Enums, Prisma } from '@prisma/client'
import type { SignInUserPayload, SignUpUserPayload } from '~/models/user'
import { prisma } from '~/prisma'
import type { IUpdatePayload, IWherePayload } from '~/types/prisma-helpers'
import { sendVerificationCode } from '~/utils/email'

class UserService {
  //* Auth
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

  //* Create

  //* Read
  getAll = async () => {
    return prisma.user.findMany()
  }

  getAllByWhere = async <T>(payload: IWherePayload<T, Prisma.UserWhereInput>) => {
    return prisma.user.findMany({ ...payload.query, where: payload.where })
  }

  getByWhere = async <T>(payload: IWherePayload<T, Prisma.UserWhereInput>) => {
    return prisma.user.findFirstOrThrow({ ...payload.query, where: payload.where })
  }

  getPermissionsByUserId = async (userId: number): Promise<$Enums.Permission[]> => {
    const permissions = await prisma.userPermission.findMany({
      where: {
        userId,
      },
      select: {
        permission: true,
      },
    })

    return permissions.map(permission => permission.permission)
  }

  //* Update
  update = async <T>(
    payload: IUpdatePayload<T, Prisma.UserWhereUniqueInput, Prisma.UserUpdateInput>,
  ) => {
    return prisma.user.update({
      ...payload.query,
      where: payload.where,
      data: payload.data,
    })
  }
  //* Delete
}

export default UserService
