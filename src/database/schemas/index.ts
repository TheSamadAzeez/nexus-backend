// Users
export * from './users.schema';

// Products
export * from './products.schema';

// Carts
export * from './carts.schema';

// Orders
export * from './orders.schema';

// Combined schema for Drizzle
import { users, userRoleEnum } from './users.schema';
import { products } from './products.schema';
import {
  carts,
  cartItems,
  cartsRelations,
  cartItemsRelations,
} from './carts.schema';
import {
  orders,
  orderItems,
  orderStatusEnum,
  ordersRelations,
  orderItemsRelations,
} from './orders.schema';

export const databaseSchema = {
  // Enums
  userRoleEnum,
  orderStatusEnum,
  // Tables
  users,
  products,
  carts,
  cartItems,
  orders,
  orderItems,
  // Relations
  cartsRelations,
  cartItemsRelations,
  ordersRelations,
  orderItemsRelations,
};
