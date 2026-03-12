import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { NewsModule } from './modules/news/news.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { UsersModule } from './modules/users/users.module';
import { UploadModule } from './modules/upload/upload.module';
import { EmailModule } from './modules/email/email.module';
import { PagesModule } from './modules/pages/pages.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    PropertiesModule,
    NewsModule,
    InquiriesModule,
    GalleryModule,
    UsersModule,
    UploadModule,
    EmailModule,
    PagesModule,
    HealthModule,
  ],
})
export class AppModule {}