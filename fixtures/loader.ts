import * as path from 'path'
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from '@getbigger-io/prisma-fixtures-cli'
import { PrismaClient } from '@prisma/client'

export const loadFixtures = async (pathToFixtures: string) => {
  let connection

  try {
    connection = new PrismaClient()
    await connection.$connect()

    const loader = new Loader()
    loader.load(path.resolve(pathToFixtures))

    const resolver = new Resolver()
    const fixtures = resolver.resolve(loader.fixtureConfigs)
    const builder = new Builder(connection, new Parser())

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture)
      // use the entity if you need it
    }
  } catch (err) {
    throw err
  } finally {
    if (connection) {
      await connection.$disconnect()
    }
  }
}
