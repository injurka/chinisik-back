import config from '~/utils/env-config.ts';
import { Log, Logger, LogType } from '~/utils/logger.ts';
import { Prisma, PrismaClient } from "~/prisma";

interface SeedFile {
  name: string
  path: string
}

const seedFiles: SeedFile[] = [
  { name: 'keys', path: 'sql/user.sql' },
]

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.dbUrl,
    },
  },
});

const logger = new Logger()

async function run() {
  const seedsStatus: Log[] = []

  logger.info('✨ Run seeds')

  for (const seedFile of seedFiles) {
    try {
      await prisma.$disconnect();

      const sql: string = await Deno.readTextFile(seedFile.path);
      const queries: string[] = sql.split(';')

      for (const query of queries) {
        logger.info(query)
        // @ts-ignore
        await Prisma.$executeRawUnsafe(query)
      }
      seedsStatus.push({ type: LogType.Success, message: seedFile.name })
    } catch {
      seedsStatus.push({ type: LogType.Error, message: seedFile.name })
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
