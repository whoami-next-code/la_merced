import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuth, StaffAuth } from '../../common/decorators/staff-auth.decorator';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @StaffAuth()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/role')
  @AdminAuth()
  updateRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.service.updateRole(id, body.role);
  }

  @Patch(':id/status')
  @AdminAuth()
  updateStatus(@Param('id') id: string, @Body() body: { is_active: boolean }) {
    return this.service.updateStatus(id, body.is_active);
  }
}
