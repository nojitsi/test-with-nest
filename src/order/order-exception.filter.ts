import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'
import { OrderException } from './order.error'

@Catch(OrderException)
export class OrderExceptionFilter implements ExceptionFilter {
  catch(exception: OrderException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception?.httpStatus || 500

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal Server Error',
    })
  }
}
