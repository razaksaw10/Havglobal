import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Vérification de l’état du serveur' })
  getHealth() {
    return {
      status: 'ok',
      api: 'HAVA Global Trade REST API v3 (NestJS & Prisma Enterprise)',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('api/v1/health')
  @ApiOperation({ summary: 'Health check API v1' })
  getV1Health() {
    return {
      status: 'ok',
      api: 'HAVA Global Trade REST API v1 (NestJS Architecture)',
      timestamp: new Date().toISOString(),
    };
  }
}
