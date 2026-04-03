import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma/prisma.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../package.json') as { version?: string };

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check() {
    const dbOk = await this.checkDatabase();
    const healthy = dbOk;

    return {
      status: healthy ? 'healthy' : 'unhealthy',
      healthy,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: version ?? '0.0.0',
      environment: process.env.NODE_ENV ?? 'development',
      checks: {
        database: dbOk ? 'ok' : 'error',
      },
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
    };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiResponse({ status: 200, description: 'Service is ready to accept traffic' })
  async ready() {
    const dbOk = await this.checkDatabase();
    if (!dbOk) {
      return { status: 'not ready', database: 'unavailable' };
    }
    return { status: 'ready' };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}