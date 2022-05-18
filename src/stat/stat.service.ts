import { Injectable } from '@nestjs/common'
import { OrderRepository } from 'src/order/order.repository'

@Injectable()
export class StatService {
  constructor(private readonly orderRepository: OrderRepository) {}

  getDriverOrderQuantity(driverId: number): Promise<number> {
    return this.orderRepository.count({
      driver: {
        id: driverId,
      },
    })
  }

  getDriverOrdersPriceTotalSumm(driverId: number): Promise<number> {
    return this.orderRepository.sum('price', { driverId })
  }

  getMostOftenDriverDestination(driverId: number): Promise<string | null> {
    return this.orderRepository.getMostOccuredFieldValue('to', { driverId })
  }

  async getAverageDriverTripDuration(driverId: number): Promise<string> {
    const averageDriverTripDuration =
      await this.orderRepository.getAverageTripDuration(driverId)
    return averageDriverTripDuration
      ? `Avarage driver trip: ${averageDriverTripDuration}`
      : 'No finished driver trips found.'
  }
}
