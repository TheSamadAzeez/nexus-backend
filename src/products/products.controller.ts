import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../common/decorators';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all products with cursor pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated products' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: 200, description: 'Returns all categories' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Returns product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
