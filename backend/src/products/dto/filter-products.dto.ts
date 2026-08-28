import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProductsDto {
  @ApiPropertyOptional({ example: 'textile', description: 'Slug de la catégorie' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'costume', description: 'Terme de recherche texte' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'true', description: 'Filtrer les produits vedettes' })
  @IsOptional()
  featured?: any;

  @ApiPropertyOptional({
    example: 'price_asc',
    enum: ['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest'],
    description: 'Ordre de tri',
  })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}
