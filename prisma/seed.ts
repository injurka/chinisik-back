import config from '~/utils/env-config.ts';
import { Log, Logger, LogType } from '~/utils/logger.ts';
import { PrismaClient } from "../generated/client/deno/edge.ts";
import { mockHieroglyphKeys } from './data/keys.ts'
import { mockDescriptionHieroglyphKeys } from './data/content.ts'

const seeds = [
  { name: 'hieroglyphKey', data: [...mockHieroglyphKeys] },
  { name: 'content', data: [mockDescriptionHieroglyphKeys] },
]

const prisma = new PrismaClient();

const logger = new Logger()

async function run() {
  const seedsStatus: Log[] = []

  logger.info('✨ Run seeds')

  for (const seed of seeds) {
    try {
      for (const create of seed.data) {
        // @ts-ignore
        await prisma[seed.name].upsert({
          where: {},
          update: {},
          create,
        })
      }
      seedsStatus.push({ type: LogType.Success, message: seed.name })
    } catch (e) {
      seedsStatus.push({ type: LogType.Error, message: `${seed.name} | ${e}` })
    }
  }

  logger.info('✨ All seeds finished')

  seedsStatus.forEach(({ type, message }) => logger[type](message))

  await prisma.$disconnect()
}

run().catch((e) => {
  logger.error('❌ Seed', e)
  Deno.exit(1)
})

// import config from '~/utils/env-config.ts';
// import { Log, Logger, LogType } from '~/utils/logger.ts';
// import { Prisma, PrismaClient } from "~/prisma";

// interface SeedFile {
//   name: string
//   path: string
// }

// const seedFiles: SeedFile[] = [
//   { name: 'keys', path: 'sql/user.sql' },
// ]

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: config.dbUrl,
//     },
//   },
// });

// const logger = new Logger()

// async function run() {
//   const seedsStatus: Log[] = []

//   logger.info('✨ Run seeds')

//   for (const seedFile of seedFiles) {
//     try {
//       await prisma.$disconnect();

//       const sql: string = await Deno.readTextFile(seedFile.path);
//       const queries: string[] = sql.split(';')

//       for (const query of queries) {
//         logger.info(query)
//         // @ts-ignore
//         await Prisma.$executeRawUnsafe(query)
//       }
//       seedsStatus.push({ type: LogType.Success, message: seedFile.name })
//     } catch {
//       seedsStatus.push({ type: LogType.Error, message: seedFile.name })
//     }
//   }

//   logger.info('✨ All seeds finished')

//   seedsStatus.forEach(({ type, message }) => logger[type](message))

//   await prisma.$disconnect()
// }

// run().catch((e) => {
//   logger.error('❌ Seed', e)
//   Deno.exit(1)
// })

