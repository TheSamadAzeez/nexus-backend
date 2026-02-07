import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DrizzleService } from '../database/drizzle.service';
import { carts, cartItems, products } from '../database/schemas';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private drizzleService: DrizzleService) {}

  async getOrCreateCart(userId: string) {
    let [cart] = await this.drizzleService.db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (!cart) {
      [cart] = await this.drizzleService.db
        .insert(carts)
        .values({ userId })
        .returning();
    }

    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const items = await this.drizzleService.db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          imageUrl: products.imageUrl,
          stock: products.stock,
        },
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));

    const total = items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    return {
      id: cart.id,
      items,
      total: total.toFixed(2),
      itemCount: items.length,
    };
  }

  async addItem(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Check product exists and has stock
    const [product] = await this.drizzleService.db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const cart = await this.getOrCreateCart(userId);

    // Check if item already in cart
    const [existingItem] = await this.drizzleService.db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
      )
      .limit(1);

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock');
      }

      await this.drizzleService.db
        .update(cartItems)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      // Add new item
      await this.drizzleService.db.insert(cartItems).values({
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    return this.getCart(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;

    const cart = await this.getOrCreateCart(userId);

    const [item] = await this.drizzleService.db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)))
      .limit(1);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity === 0) {
      // Remove item
      await this.drizzleService.db
        .delete(cartItems)
        .where(eq(cartItems.id, itemId));
    } else {
      // Check stock
      const [product] = await this.drizzleService.db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (product && product.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      await this.drizzleService.db
        .update(cartItems)
        .set({ quantity, updatedAt: new Date() })
        .where(eq(cartItems.id, itemId));
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);

    const [item] = await this.drizzleService.db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)))
      .limit(1);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.drizzleService.db
      .delete(cartItems)
      .where(eq(cartItems.id, itemId));

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.drizzleService.db
      .delete(cartItems)
      .where(eq(cartItems.cartId, cart.id));

    return { message: 'Cart cleared successfully' };
  }
}
