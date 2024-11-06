import { prisma } from '~/prisma'

class HieroglyphKeyService {
  //* Create

  //* Read
  getKeys = async () => {
    return prisma.hieroglyphKey.findMany()
  }

  //* Update

  //* Delete
}

export { HieroglyphKeyService }
