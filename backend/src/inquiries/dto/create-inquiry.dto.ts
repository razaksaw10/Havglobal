import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty({ example: 'Jean Dupont', description: 'Nom complet du demandeur' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;

  @ApiProperty({ example: 'jean.dupont@entreprise.com', description: 'Email professionnel' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty({ message: 'L’email est requis' })
  email: string;

  @ApiPropertyOptional({ example: '+33 6 12 34 56 78', description: 'Numéro de téléphone ou WhatsApp' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Global Import-Export SAS', description: 'Raison sociale' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({ example: 'France', description: 'Pays de destination' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'Demande de devis conteneur 40ft', description: 'Objet de la demande' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ example: 'textile', description: 'Secteur d’activité' })
  @IsString()
  @IsOptional()
  categorySlug?: string;

  @ApiProperty({ example: 'Bonjour, nous souhaitons commander 1000 polos...', description: 'Détail de la demande' })
  @IsString()
  @IsNotEmpty({ message: 'Le message est requis' })
  @MinLength(10, { message: 'Le message doit contenir au moins 10 caractères' })
  message: string;
}
