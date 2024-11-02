import { PrismaClient } from '@prisma/client'
import { type Log, Logger, LogType } from '~/utils/logger'

import { mockDescriptionHieroglyphKeys } from './data/content'
import { mockHieroglyphKeys } from './data/hieroglyph-key'
import { mockUser } from './data/user'
import { mockUserPermission } from './data/userPermission'

const seeds = [
  { name: 'hieroglyphKey', data: [...mockHieroglyphKeys] },
  { name: 'content', data: [mockDescriptionHieroglyphKeys] },
  { name: 'user', data: [...mockUser] },
  { name: 'userPermission', data: [...mockUserPermission] },
]

const prisma = new PrismaClient()

const logger = new Logger()

async function run() {
  const seedsStatus: Log[] = []

  logger.info('✨ Run seeds')

  for (const seed of seeds) {
    try {
      for (const data of seed.data) {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-ignore
        await prisma[seed.name].create({
          data,
        })
      }
      seedsStatus.push({ type: LogType.Success, message: seed.name })
    }
    catch (e) {
      seedsStatus.push({ type: LogType.Error, message: `${seed.name} | ${e}` })
    }
  }

  logger.info('✨ All seeds finished')

  seedsStatus.forEach(({ type, message }) => logger[type](message))

  await prisma.$disconnect()
}

run().catch((e) => {
  logger.error('❌ Seed', e)
  process.exit(1)
})
