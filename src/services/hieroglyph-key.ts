import { prisma } from '~/prisma'

class HieroglyphKeyService {
  //* Create

  //* Read
  getKeys = async () => {
    return prisma.hieroglyphKey.findMany()
  }

  getDescription = async () => {
    return prisma.content.findFirst({
      where: {
        sysname: 'keys',
      },
    })
  }

  //* Update

  //* Delete
}

export { HieroglyphKeyService }
