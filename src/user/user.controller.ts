import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './Dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post('add')
  addUser(@Body() userDto: UserDto) {
    return this.userService.addUser(userDto);
  }

  @Put('update/:id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto) {
    return this.userService.updateUser(id, userDto);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
