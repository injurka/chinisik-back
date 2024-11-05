import { PrismaClient } from '@prisma/client'
import { type Log, Logger, LogType } from '~/utils/logger'

import { mockDescriptionHieroglyphKeys } from './data/content'
import { mockHieroglyphKeys } from './data/hieroglyph-key'
import { splitGlyphsAll } from './data/split-glyphs-all'
import { mockUser } from './data/user'
import { mockUserPermission } from './data/user-permission'

const seeds = [
  { name: 'user', data: [mockUser] },
  { name: 'hieroglyphKey', data: [mockHieroglyphKeys] },
  { name: 'content', data: [mockDescriptionHieroglyphKeys] },
  { name: 'userPermission', data: [mockUserPermission] },
  { name: 'splitGlyphsAll', data: [splitGlyphsAll] },
]

const prisma = new PrismaClient()

const logger = new Logger()

async function run() {
  const seedsStatus: Log[] = []

  logger.info('✨ Run seeds')

  for (const seed of seeds) {
    try {
      for (const rawData of seed.data) {
        const transformedData = [...await rawData()]
        for (const data of transformedData) {
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-ignore
          await prisma[seed.name].create({
            data,
          })
        }
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
