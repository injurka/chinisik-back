import type { User } from '~/models'
import { HTTPException } from 'hono/http-exception'
import { prisma } from '~/prisma'

class LinguisticAnalysisService {
  getList = async (page: number, limit: number, user?: User) => {
    try {
      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
        prisma.linguisticAnalysisAll.findMany({
          skip,
          take: limit,
          ...(user
            ? {
                where: {
                  userId: user.id,
                },
              }
            : {}
          ),
        }),
        prisma.linguisticAnalysisAll.count(),
      ])

      return { data, total }
    }
    catch {
      throw new HTTPException(400, { message: 'Failed to retrieve test list.' })
    }
  }
}

export { LinguisticAnalysisService }
