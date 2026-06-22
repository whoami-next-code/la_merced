import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get('movements')
  getMovements(@Query('productId') productId?: string) {
    return this.service.getMovements(productId);
  }

  @Post('movements')
  registerMovement(
    @Body()
    body: {
      product_id: string;
      movement_type: 'entry' | 'exit' | 'adjustment';
      quantity: number;
      notes?: string;
    },
  ) {
    return this.service.registerMovement(body);
  }
}
