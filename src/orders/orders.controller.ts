import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../common/decorators';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create order from cart' })
  @ApiResponse({ status: 201, description: 'Order created' })
  @ApiResponse({
    status: 400,
    description: 'Cart is empty or insufficient stock',
  })
  create(@CurrentUser('id') userId: string) {
    return this.ordersService.createFromCart(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get order history' })
  @ApiResponse({ status: 200, description: 'Returns user orders' })
  findAll(@CurrentUser('id') userId: string) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  @ApiResponse({ status: 200, description: 'Returns order with items' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    return this.ordersService.findOne(userId, orderId);
  }
}
