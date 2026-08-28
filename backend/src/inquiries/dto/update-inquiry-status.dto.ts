import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateInquiryStatusDto {
  @ApiProperty({
    example: 'in_progress',
    enum: ['new', 'in_progress', 'resolved', 'archived'],
    description: 'Nouveau statut du devis',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le statut est requis' })
  @IsIn(['new', 'in_progress', 'resolved', 'archived'], {
    message: 'Statut invalide (valeurs autorisées: new, in_progress, resolved, archived)',
  })
  status: string;

  @ApiPropertyOptional({ example: 'Offre envoyée par email le 12/03', description: 'Notes internes de suivi' })
  @IsString()
  @IsOptional()
  notes?: string;
}
