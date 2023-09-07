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
import { loginDto, LoginResponseDto, UserDto, UserResponseDto } from './Dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

// @UseGuards(UserAuthGuards)
@ApiTags('User')
// @ApiBearerAuth()
// @UseGuards(UserAuthGuards)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }
  @Get('userPayment/:id')
  async userPayments(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserPayment(id);
  }
  @Get('userBookings/:id')
  getUserBookings(@Param('id', ParseIntPipe) id: number) {
    console.log('aaxa ta bookings ma');
    return this.userService.getUserBookings(id);
  }

  @Post('login')
  @ApiResponse({ type: LoginResponseDto })
  loginUser(@Body() loginData: loginDto) {
    return this.userService.loginUser(loginData);
  }

  @Post()
  @ApiResponse({ type: LoginResponseDto })
  addUser(@Body() userDto: UserDto) {
    return this.userService.addUser(userDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: UserResponseDto })
  @ApiParam({ name: 'id', type: 'number', description: 'User Id' })
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto) {
    return this.userService.updateUser(id, userDto);
  }

  @Delete('delete/:id')
  @ApiResponse({ type: UserResponseDto })
  @ApiParam({ name: 'id', type: 'number', description: 'User Id' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
