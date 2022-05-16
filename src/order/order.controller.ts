import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Request,
  UseFilters,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { Order } from '@prisma/client'
import { OrderExceptionFilter } from './order-exception.filter'
import { IsNotEmpty } from 'class-validator'
import { MOCKED_CLIENT_USER_ID, MOCKED_DRIVER_USER_ID } from 'src/constants'

export class LocationDto {
  @IsNotEmpty()
  from: string

  @IsNotEmpty()
  to: string
}

@UseFilters(new OrderExceptionFilter())
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Req() request: Request,
    @Body() body: LocationDto,
  ): Promise<Order> {
    const order = await this.orderService.registerOrder(
      body.from,
      body.to,
      MOCKED_CLIENT_USER_ID,
    )
    //notify drivers via socket about new order

    /*
      If drivers does not have offers board (Uber, Uklon like), script would select driver from active drivers list 
      and apply it to the user order, if there is no driver working would notify user, 
      since we have bid(offer) system no notify for user
      because driver could become active and take order any moment
    */

    return order
  }

  @Patch('apply/:id')
  async apply(
    @Req() request: Request,
    @Param('id', ParseIntPipe) orderId,
  ): Promise<Order> {
    const order = await this.orderService.applyDriverToOrder(
      orderId,
      MOCKED_DRIVER_USER_ID,
    )
    //notify drivers via socket that order is taken
    //notify client via socket that he should wait for driver
    return order
  }

  @Patch('start/:id')
  async start(
    @Req() request: Request,
    @Param('id', ParseIntPipe) orderId,
  ): Promise<Order> {
    const order = await this.orderService.startOrderTrip(orderId)
    //notify client via socket that driver started trip
    return order
  }

  @Patch('end/:id')
  async end(
    @Req() request: Request,
    @Param('id', ParseIntPipe) orderId,
  ): Promise<Order> {
    const order = await this.orderService.finishOrderTrip(orderId)
    //notify client via socket that driver eneded trip
    return order
  }
}
