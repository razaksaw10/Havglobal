import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Stats')
@Controller('api/v1/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les statistiques complètes pour le tableau de bord (Admin)' })
  @ApiResponse({ status: 200, description: 'KPIs et métriques retournés' })
  async getDashboardStats() {
    return this.statsService.getDashboardStats();
  }
}
