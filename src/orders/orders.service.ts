import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DrizzleService } from '../database/drizzle.service';
import {
  orders,
  orderItems,
  products,
  carts,
  cartItems,
} from '../database/schemas';

@Injectable()
export class OrdersService {
  constructor(private drizzleService: DrizzleService) {}

  async createFromCart(userId: string) {
    // Get user's cart with items
    const [cart] = await this.drizzleService.db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (!cart) {
      throw new BadRequestException('Cart is empty');
    }

    const items = await this.drizzleService.db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        productId: cartItems.productId,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          stock: products.stock,
        },
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));

    if (items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock
    for (const item of items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${item.product.name}`,
        );
      }
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    // Create order
    const [order] = await this.drizzleService.db
      .insert(orders)
      .values({
        userId,
        totalAmount: totalAmount.toFixed(2),
        status: 'PENDING',
      })
      .returning();

    // Create order items
    await this.drizzleService.db.insert(orderItems).values(
      items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      })),
    );

    // Update product stock
    for (const item of items) {
      await this.drizzleService.db
        .update(products)
        .set({
          stock: item.product.stock - item.quantity,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId));
    }

    // Clear cart
    await this.drizzleService.db
      .delete(cartItems)
      .where(eq(cartItems.cartId, cart.id));

    return this.findOne(userId, order.id);
  }

  async findAll(userId: string) {
    const userOrders = await this.drizzleService.db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    return userOrders;
  }

  async findOne(userId: string, orderId: string) {
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

    const items = await this.drizzleService.db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        price: orderItems.price,
        product: {
          id: products.id,
          name: products.name,
          imageUrl: products.imageUrl,
        },
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));

    return {
      ...order,
      items,
    };
  }

  async updateStatus(orderId: string, status: string) {
    const [order] = await this.drizzleService.db
      .update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
