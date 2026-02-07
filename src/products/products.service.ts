import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, gt, gte, lte, ilike, sql } from 'drizzle-orm';
import { DrizzleService } from '../database/drizzle.service';
import { products } from '../database/schemas';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private drizzleService: DrizzleService) {}

  async create(createProductDto: CreateProductDto) {
    const [product] = await this.drizzleService.db
      .insert(products)
      .values({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price.toString(),
        stock: createProductDto.stock ?? 0,
        imageUrl: createProductDto.imageUrl,
        category: createProductDto.category,
      })
      .returning();

    return product;
  }

  async findAll(query: ProductQueryDto) {
    const { cursor, limit = 10, category, search, minPrice, maxPrice } = query;

    // Build conditions
    const conditions: any[] = [];

    if (cursor) {
      conditions.push(gt(products.id, cursor));
    }

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }

    if (minPrice !== undefined) {
      conditions.push(gte(products.price, minPrice.toString()));
    }

    if (maxPrice !== undefined) {
      conditions.push(lte(products.price, maxPrice.toString()));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await this.drizzleService.db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(products.id)
      .limit(limit + 1);

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, -1) : items;
    const nextCursor = hasMore ? data[data.length - 1]?.id : null;

    return {
      data,
      pagination: {
        hasMore,
        nextCursor,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const [product] = await this.drizzleService.db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const updateData: any = {
      ...updateProductDto,
      updatedAt: new Date(),
    };

    if (updateProductDto.price !== undefined) {
      updateData.price = updateProductDto.price.toString();
    }

    const [updatedProduct] = await this.drizzleService.db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    return updatedProduct;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.drizzleService.db.delete(products).where(eq(products.id, id));

    return { message: 'Product deleted successfully' };
  }

  async getCategories() {
    const result = await this.drizzleService.db
      .selectDistinct({ category: products.category })
      .from(products)
      .where(sql`${products.category} IS NOT NULL`);

    return result.map((r) => r.category).filter(Boolean);
  }
}
