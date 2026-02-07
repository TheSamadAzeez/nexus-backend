import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Order ID' })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'Mock payment method', example: 'credit_card' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    description: 'Mock card number (last 4 digits)',
    example: '4242',
    required: false,
  })
  @IsOptional()
  @IsString()
  cardLastFour?: string;
}
