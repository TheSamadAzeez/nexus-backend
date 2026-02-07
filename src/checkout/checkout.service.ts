import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../database/drizzle.service';
import { orders } from '../database/schemas';
import { ProcessPaymentDto } from './dto';

@Injectable()
export class CheckoutService {
  constructor(private drizzleService: DrizzleService) {}

  async processPayment(userId: string, processPaymentDto: ProcessPaymentDto) {
    const { orderId, paymentMethod, cardLastFour } = processPaymentDto;

    // Get order
    const [order] = await this.drizzleService.db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot process payment for order with status: ${order.status}`,
      );
    }

    // Mock payment processing
    // In a real application, you would integrate with a payment gateway
    const mockPaymentResult = this.mockPaymentGateway(
      order.totalAmount,
      paymentMethod,
    );

    if (!mockPaymentResult.success) {
      throw new BadRequestException(mockPaymentResult.message);
    }

    // Update order status
    const [updatedOrder] = await this.drizzleService.db
      .update(orders)
      .set({
        status: 'PAID',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    return {
      success: true,
      message: 'Payment processed successfully',
      order: updatedOrder,
      payment: {
        transactionId: mockPaymentResult.transactionId,
        paymentMethod,
        cardLastFour,
        amount: order.totalAmount,
        processedAt: new Date().toISOString(),
      },
    };
  }

  private mockPaymentGateway(
    amount: string,
    paymentMethod: string,
  ): { success: boolean; message: string; transactionId?: string } {
    // Simulate payment processing
    // In a real application, this would call Stripe, PayPal, etc.

    // Simulate random failure (10% chance) for testing
    if (Math.random() < 0.1) {
      return {
        success: false,
        message: 'Payment declined. Please try again.',
      };
    }

    // Generate mock transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      success: true,
      message: 'Payment approved',
      transactionId,
    };
  }
}
