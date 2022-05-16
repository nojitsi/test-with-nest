/* eslint-disable @typescript-eslint/prefer-as-const */
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { OrderController } from './order/order.controller'
import { CalculatorService } from './calculator/calculator.service'
import { OrderRepository } from './order/order.repository'
import { PrismaService } from './prisma.service'
import configuration from './config/configuration'
import { OrderService } from './order/order.service'
import { StatController } from './stat/stat.controller'
import { StatService } from './stat/stat.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [AppController, OrderController, StatController],
  providers: [
    AppService,
    CalculatorService,
    OrderService,
    OrderRepository,
    PrismaService,
    StatService,
  ],
})
export class AppModule {}
