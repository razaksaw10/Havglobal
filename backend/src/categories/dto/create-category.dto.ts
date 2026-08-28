import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'textile', description: 'Slug unique de la catégorie' })
  @IsString()
  @IsNotEmpty({ message: 'Le slug est requis' })
  slug: string;

  @ApiProperty({ example: 'Textile & Confection', description: 'Nom de la catégorie' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la catégorie est requis' })
  name: string;

  @ApiPropertyOptional({ example: '👔', description: 'Icône ou émoji de la catégorie' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'Vêtements haut de gamme...', description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'Ordre d’affichage' })
  @IsNumber()
  @IsOptional()
  orderIndex?: number;
}
