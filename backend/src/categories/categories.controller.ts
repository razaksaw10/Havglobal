import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Categories')
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lister toutes les catégories de produits' })
  @ApiResponse({ status: 200, description: 'Liste des catégories renvoyée' })
  async getAll() {
    return this.categoriesService.getAllCategories();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Obtenir les détails et produits d’une catégorie' })
  @ApiResponse({ status: 200, description: 'Détail de la catégorie' })
  @ApiResponse({ status: 404, description: 'Catégorie introuvable' })
  async getBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getCategoryBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une nouvelle catégorie (Admin)' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }
}
