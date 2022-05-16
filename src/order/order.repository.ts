import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Order, Prisma } from '@prisma/client'
import { OrderNotFound } from './order.error'

const RECORDS_NOT_FOUND_CODE = 'P2025'
const OrderNotFoundException = new OrderNotFound('Order not found')

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({ data })
  }

  async update(
    where: Prisma.OrderWhereUniqueInput,
    data: Prisma.OrderUpdateInput,
  ): Promise<Order> {
    try {
      return await this.prisma.order.update({ where, data })
    } catch (exception) {
      this.handleRepositoryError(exception)
    }
  }

  async findOne(
    where: Prisma.OrderWhereUniqueInput,
    shouldThrowNotFoundError?: boolean,
  ): Promise<Order> {
    shouldThrowNotFoundError = shouldThrowNotFoundError || true
    const order = await this.prisma.order.findFirst({
      where,
    })

    if (!order && shouldThrowNotFoundError) {
      throw OrderNotFoundException
    }

    return order
  }

  find(where?: Prisma.OrderWhereInput): Promise<Order[]> {
    return this.prisma.order.findMany({ where })
  }

  count(where?: Prisma.OrderWhereInput): Promise<number> {
    return this.prisma.order.count({ where })
  }

  getOccurrences(
    field: Prisma.OrderScalarFieldEnum,
    where?: Prisma.OrderWhereInput,
  ) {
    return this.prisma.order.groupBy({
      by: [field],
      _count: {
        [field]: true,
      },
      orderBy: {
        _count: {
          [field]: 'desc',
        },
      },
      where,
    })
  }

  async getMostOccuredFieldValue(
    field: Prisma.OrderScalarFieldEnum,
    where?: Prisma.OrderWhereInput,
  ): Promise<any | null> {
    const occurencies = await this.getOccurrences(field, where)
    return occurencies[0]?.[field] || null
  }

  async sum(
    field: Prisma.OrderScalarFieldEnum,
    where?: Prisma.OrderWhereInput,
  ): Promise<number | null> {
    const result = await this.prisma.order.aggregate({
      where,
      _sum: {
        [field]: true,
      },
    })

    return result._sum?.[field] || null
  }

  async getAverageTripDuration(driverId: number): Promise<string | null> {
    const averageTripDuration = await this.prisma.$queryRaw`
      SELECT TO_CHAR(AVG("finishedAt"::timestamptz - "startedAt"::timestamptz), 'HH24:MI:SS') as "avgTripDuration"
      FROM "Order"
      WHERE "driverId" = ${driverId} AND "startedAt" is not NULL AND "finishedAt" is not NULL;
    `
    return averageTripDuration[0]?.avgTripDuration
  }

  private handleRepositoryError(error): void {
    if (error.code === RECORDS_NOT_FOUND_CODE) throw OrderNotFoundException
    throw error
  }
}
