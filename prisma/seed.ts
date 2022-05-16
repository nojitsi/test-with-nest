import { PrismaClient } from '@prisma/client'
import { loadFixtures } from '../fixtures/loader'

const prisma = new PrismaClient()

async function main() {
  await prisma.$connect()

  if (['local', 'test'].includes(process.env.NODE_ENV)) {
    await loadFixtures('./fixtures')

    //need this because of no suuport for DateTimeInYaml
    await prisma.order.update({
      where: {
        id: 1,
      },
      data: {
        startedAt: new Date('1980-10-10 23:23:11'),
        finishedAt: new Date('1980-10-10 23:24:11'),
      },
    })
    await prisma.order.update({
      where: {
        id: 2,
      },
      data: {
        startedAt: new Date('1980-10-11 23:23:11'),
        finishedAt: new Date('1980-10-11 23:24:11'),
      },
    })
    await prisma.order.update({
      where: {
        id: 3,
      },
      data: {
        startedAt: new Date('1980-10-12 23:23:11'),
        finishedAt: new Date('1980-10-12 23:25:11'),
      },
    })
    await prisma.order.update({
      where: {
        id: 4,
      },
      data: {
        startedAt: new Date('1980-10-10 23:23:11'),
        finishedAt: new Date('1980-10-10 23:26:11'),
      },
    })
    await prisma.order.update({
      where: {
        id: 5,
      },
      data: {
        startedAt: new Date('1980-10-11 23:23:11'),
        finishedAt: new Date('1980-10-11 23:26:11'),
      },
    })
    await prisma.order.update({
      where: {
        id: 6,
      },
      data: {
        startedAt: new Date('1980-10-12 23:23:11'),
        finishedAt: new Date('1980-10-12 23:25:11'),
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
