import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuth } from '../../common/decorators/staff-auth.decorator';
import { PromotionsService } from './promotions.service';

@ApiTags('promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly service: PromotionsService) {}

  @Get()
  findActive() {
    return this.service.findActive();
  }

  @Get('admin')
  @AdminAuth()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @AdminAuth()
  create(@Body() body: Record<string, unknown>) {
    return this.service.create(body);
  }
}
