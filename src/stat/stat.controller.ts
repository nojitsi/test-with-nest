import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { PRICE_MULTIPLIER, SYSTEM_CURRENCY } from 'src/constants'
import { StatService } from './stat.service'

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get('order-quantity/:driverId')
  getOrderQuantity(
    @Param('driverId', ParseIntPipe) driverId: number,
  ): Promise<number> {
    return this.statService.getDriverOrderQuantity(driverId)
  }

  @Get('total-order-sum/:driverId')
  async getTotalPrice(
    @Param('driverId', ParseIntPipe) driverId,
  ): Promise<string> {
    return `${
      Number(await this.statService.getDriverOrdersPriceTotalSum(driverId)) /
      PRICE_MULTIPLIER
    } ${SYSTEM_CURRENCY}`
  }

  @Get('most-often-destination/:driverId')
  async getMostOftenDestination(
    @Param('driverId', ParseIntPipe) driverId,
  ): Promise<string> {
    const mostOftenDestination =
      await this.statService.getMostOftenDriverDestination(driverId)
    return mostOftenDestination ?? 'Driver does not have any orders'
  }

  @Get('average-trip-duration/:driverId')
  getAverageTripDuration(
    @Param('driverId', ParseIntPipe) driverId,
  ): Promise<string | null> {
    return this.statService.getAverageDriverTripDuration(driverId)
  }
}
