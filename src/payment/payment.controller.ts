import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './Dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  getaAll() {
    return this.paymentService.getAll();
  }

  @Put('/:id')
  updatePayment(
    @Body() paymentDto: PaymentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentService.updatePayment(id, paymentDto);
  }
}
