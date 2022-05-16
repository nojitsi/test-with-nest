import { Injectable } from '@nestjs/common'
import { Order } from '@prisma/client'

@Injectable()
export class CalculatorService {
  calculate(order: Order): number {
    return Math.round(Math.random() * 50000)
  }
}
