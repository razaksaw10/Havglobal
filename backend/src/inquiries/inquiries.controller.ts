import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';
import { FilterInquiriesDto } from './dto/filter-inquiries.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Inquiries')
@Controller('api/v1/inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Soumettre une nouvelle demande de devis B2B (Public)' })
  @ApiResponse({ status: 201, description: 'Demande enregistrée avec succès' })
  async createInquiry(@Body() dto: CreateInquiryDto) {
    return this.inquiriesService.createInquiry(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les demandes de devis avec filtres et pagination (Admin)' })
  @ApiResponse({ status: 200, description: 'Liste des devis renvoyée' })
  async getInquiries(@Query() query: FilterInquiriesDto) {
    return this.inquiriesService.getInquiries(query);
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exporter toutes les demandes de devis au format CSV (Admin)' })
  async exportCsv(@Res() res: Response) {
    const csvData = await this.inquiriesService.exportCsv();
    const dateStr = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="havaglobal-devis-${dateStr}.csv"`,
    );
    return res.status(200).send(csvData);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les détails d’une demande de devis (Admin)' })
  async getInquiryById(@Param('id', ParseIntPipe) id: number) {
    return this.inquiriesService.getInquiryById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut et les notes d’un devis (Admin)' })
  async updateInquiryStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInquiryStatusDto,
    @CurrentUser('id') adminId: number,
  ) {
    return this.inquiriesService.updateInquiryStatus(id, dto, adminId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une demande de devis (Admin)' })
  async deleteInquiry(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') adminId: number,
  ) {
    return this.inquiriesService.deleteInquiry(id, adminId);
  }
}
