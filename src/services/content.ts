import { prisma } from '~/prisma'

class CmsService {
  //* Create

  //* Read

  getContent = async () => {
    return prisma.content.findFirst({
      where: {
        sysname: 'keys',
      },
    })
  }

  //* Update

  //* Delete
}

export { CmsService }
