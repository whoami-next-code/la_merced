import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { PromotionsModule } from '../promotions/promotions.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [SettingsModule, PromotionsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
