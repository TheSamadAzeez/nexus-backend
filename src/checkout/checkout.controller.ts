import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { ProcessPaymentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../common/decorators';

@ApiTags('checkout')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('pay')
  @ApiOperation({ summary: 'Process payment for an order (mock)' })
  @ApiResponse({ status: 200, description: 'Payment processed' })
  @ApiResponse({ status: 400, description: 'Payment failed' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  processPayment(
    @CurrentUser('id') userId: string,
    @Body() processPaymentDto: ProcessPaymentDto,
  ) {
    return this.checkoutService.processPayment(userId, processPaymentDto);
  }
}
