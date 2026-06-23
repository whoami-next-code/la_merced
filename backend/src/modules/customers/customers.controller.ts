import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StaffAuth } from '../../common/decorators/staff-auth.decorator';
import { CustomersService } from './customers.service';

@ApiTags('customers')
@Controller('customers')
@StaffAuth()
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.service.create(body);
  }
}
