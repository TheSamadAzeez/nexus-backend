import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @ApiPropertyOptional({ description: 'Cursor for pagination (product ID)' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Search by name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
