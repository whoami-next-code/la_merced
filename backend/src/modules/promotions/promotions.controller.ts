import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuth } from '../../common/decorators/staff-auth.decorator';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion.dto';

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
  create(@Body() dto: CreatePromotionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @AdminAuth()
  update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @AdminAuth()
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
