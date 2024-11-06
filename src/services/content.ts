import { prisma } from '~/prisma'

class CmsService {
  //* Create

  //* Read
  getContent = async (sysname: string) => {
    const data = await prisma.cms.findFirstOrThrow({
      where: {
        sysname,
      },
    })

    return data.value
  }

  //* Update

  //* Delete
}

export { CmsService }
