import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentDto } from './Dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}
  async getAll() {
    return this.prisma.payment.findMany();
  }

  async updatePayment(id: number, paymentDetails: PaymentDto) {
    const payment = this.prisma.payment.findFirst({ where: { id } });
    if (!payment) {
      throw new NotFoundException('payment doesnot exist');
    }
    const amount = parseInt(paymentDetails.amount, 10);
    return this.prisma.payment.update({
      where: { id },
      data: { amount, status: paymentDetails.status },
    });
  }
}
