import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware (allow cross-origin API requests from dashboard/website)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(compression());

  // CORS – allow website, dashboard (local + Vercel production)
  const corsEnv = process.env.CORS_ORIGINS?.trim();
  const allowedList = corsEnv
    ? corsEnv === '*' || corsEnv === 'true'
      ? null
      : corsEnv.split(',').map((o) => o.trim()).filter(Boolean)
    : null;

  const originFn = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true); // same-origin or non-browser
    if (allowedList === null && !corsEnv) {
      // Default: localhost + *.vercel.app
      const ok =
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
      return callback(null, ok);
    }
    if (allowedList === null) return callback(null, true); // CORS_ORIGINS=*
    callback(null, allowedList.includes(origin));
  };

  app.enableCors({
    origin: allowedList === null && (corsEnv === '*' || corsEnv === 'true') ? true : originFn,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Real Estate API')
    .setDescription('API for Real Estate Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();