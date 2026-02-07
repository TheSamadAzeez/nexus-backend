import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Latest Apple smartphone with A17 Pro chip' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 100 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'Electronics' })
  @IsOptional()
  @IsString()
  category?: string;
}
