import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'New quantity' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;
}
