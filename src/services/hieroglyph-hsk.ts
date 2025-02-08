import { HTTPException } from 'hono/http-exception'
import { prisma } from '~/prisma'

class HieroglyphHskService {
  //* Read
  getHieroglyphsByHsk = async (level: number) => {
    return prisma.hieroglyphHsk.findMany({ where: { level } })
  }

  getHieroglyphsByHskList = async (level: number, page: number, limit: number) => {
    try {
      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
        prisma.hieroglyphHsk.findMany({
          skip,
          take: limit,
          where: { level },
        }),
        prisma.hieroglyphHsk.count(),
      ])

      return { data, total }
    }
    catch {
      throw new HTTPException(400, { message: 'Failed to retrieve hsk list.' })
    }
  }
}

export { HieroglyphHskService }
