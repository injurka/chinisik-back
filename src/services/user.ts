import type { $Enums, Prisma } from '@prisma/client'
import { prisma } from '~/prisma'
import type { IUpdatePayload, IWherePayload } from '~/types/prisma-helpers'

class UserService {
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

export { UserService }
