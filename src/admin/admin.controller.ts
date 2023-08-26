import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDto } from './Dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async adminLogin(@Body() adminDto: AdminDto) {
    return this.adminService.adminLogin(adminDto);
  }
}
