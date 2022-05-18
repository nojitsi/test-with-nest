import { Injectable } from '@nestjs/common'
import { Order } from '@prisma/client'
import { CalculatorService } from 'src/calculator/calculator.service'
import { USER_ORDERS_LIMIT } from '../constants'
import {
  UserPassedOrderLimit,
  OrderIsHandled,
  TripHasFinishedOnce,
  TripHasStartedOnce,
  TripHasNotStarted,
} from './order.error'
import { OrderRepository } from './order.repository'

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly calculatorService: CalculatorService,
  ) {}

  async registerOrder(
    from: string,
    to: string,
    clientId: number,
  ): Promise<Order> {
    if (await this.clientPassedOrderLimit(clientId)) {
      throw new UserPassedOrderLimit(
        'Client has one unfinished order, pls finish it first.',
      )
    }

    return this.orderRepository.create({
      from,
      to,
      client: {
        connect: {
          id: clientId,
        },
      },
    })
  }

  async applyDriverToOrder(orderId: number, driverId: number): Promise<Order> {
    if (await this.orderHasDriver(orderId)) {
      throw new OrderIsHandled('Order is already handeled by a driver.')
    }

    return this.orderRepository.update(
      {
        id: orderId,
      },
      {
        driver: {
          connect: {
            id: driverId,
          },
        },
      },
    )
  }

  async startOrderTrip(orderId: number): Promise<Order> {
    if (!(await this.orderHasDriver(orderId))) {
      throw new OrderIsHandled(
        'Pls apply to the order before trying to start trip.',
      )
    }

    if (await this.orderIsAlreadyStarted(orderId)) {
      throw new TripHasStartedOnce('Order has already started.')
    }

    return this.orderRepository.update(
      {
        id: orderId,
      },
      {
        startedAt: new Date(),
      },
    )
  }

  async finishOrderTrip(orderId: number): Promise<Order> {
    if (!(await this.orderHasDriver(orderId))) {
      throw new OrderIsHandled(
        'Pls apply to the order before trying to start trip.',
      )
    }

    if (!(await this.orderIsAlreadyStarted(orderId))) {
      throw new TripHasNotStarted('Pls start trip before finishing it.')
    }

    if (await this.orderIsAlreadyFinished(orderId)) {
      throw new TripHasFinishedOnce('Order has already finished.')
    }

    const orderWhereUniqueInput = {
      id: orderId,
    }

    return this.orderRepository.update(orderWhereUniqueInput, {
      finishedAt: new Date(),
      price: this.calculatorService.calculate(
        await this.orderRepository.findOne(orderWhereUniqueInput),
      ),
    })
  }

  private async clientPassedOrderLimit(clientId: number): Promise<boolean> {
    const clientOrders = await this.orderRepository.find({
      client: {
        id: clientId,
      },
      finishedAt: null,
    })

    return clientOrders.length > USER_ORDERS_LIMIT
  }

  private async orderHasDriver(orderId: number): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      id: orderId,
    })
    return order.driverId !== null
  }

  private async orderIsAlreadyStarted(orderId: number): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      id: orderId,
    })
    return order.startedAt !== null
  }

  private async orderIsAlreadyFinished(orderId: number): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      id: orderId,
    })
    return order.finishedAt !== null
  }
}
