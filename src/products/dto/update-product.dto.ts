import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'iPhone 15 Pro Max' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1099.99 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 50 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 'https://example.com/new-image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'Smartphones' })
  @IsOptional()
  @IsString()
  category?: string;
}
