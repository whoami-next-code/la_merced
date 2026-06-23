import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StaffAuth } from '../../common/decorators/staff-auth.decorator';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @StaffAuth()
  create(@Body() body: { name: string; slug: string; description?: string; parent_id?: string }) {
    return this.service.create(body);
  }

  @Patch(':id')
  @StaffAuth()
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; slug?: string; description?: string; is_active?: boolean },
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @StaffAuth()
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
