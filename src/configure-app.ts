import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';

export async function configureApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );
  // CJS module — default import breaks under Vercel/esbuild; require is reliable
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const compression = require('compression');
  app.use(compression());

  const corsEnv = process.env.CORS_ORIGINS?.trim();
  const allowedList = corsEnv
    ? corsEnv === '*' || corsEnv === 'true'
      ? null
      : corsEnv.split(',').map((o) => o.trim()).filter(Boolean)
    : null;

  const isVercelPreviewOrProduction = (origin: string) => {
    try {
      const { protocol, hostname } = new URL(origin);
      return (
        protocol === 'https:' &&
        (hostname === 'vercel.app' || hostname.endsWith('.vercel.app'))
      );
    } catch {
      return false;
    }
  };

  const originFn = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin) return callback(null, true);
    if (allowedList === null && !corsEnv) {
      const ok =
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        isVercelPreviewOrProduction(origin);
      return callback(null, ok);
    }
    if (allowedList === null) return callback(null, true);
    callback(null, allowedList.includes(origin));
  };

  app.enableCors({
    origin: allowedList === null && (corsEnv === '*' || corsEnv === 'true') ? true : originFn,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Real Estate API')
    .setDescription('API for Real Estate Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  return app;
}
