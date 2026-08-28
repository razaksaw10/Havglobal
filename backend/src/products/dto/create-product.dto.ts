import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Costume Homme Sur-Mesure Laine & Soie' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du produit est requis' })
  name: string;

  @ApiProperty({ example: 'textile' })
  @IsString()
  @IsNotEmpty({ message: 'La catégorie est requise' })
  categorySlug: string;

  @ApiPropertyOptional({ example: 'Costume 2 pièces pour homme...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 95.0 })
  @Type(() => Number)
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'EUR', default: 'EUR' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: 50, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  minOrderQty?: number;

  @ApiPropertyOptional({
    example: '[{"label":"Matière","value":"80% Laine Vierge"}]',
    description: 'Spécifications techniques au format JSON stringifié ou tableau',
  })
  @IsOptional()
  specsJson?: any;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800' })
  @IsString()
  @IsNotEmpty({ message: 'L’URL de l’image est requise' })
  imageUrl: string;

  @ApiPropertyOptional({ example: 400, default: 100 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ example: true, default: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
