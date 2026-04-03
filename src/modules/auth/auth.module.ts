import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import {
  jwtSecretEnvDiagnostics,
  resolveJwtSecret,
} from '../../common/auth/resolve-jwt-secret';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = resolveJwtSecret(configService);
        if (!secret) {
          const log = new Logger('AuthModule');
          log.error(
            `JWT secret missing (${jwtSecretEnvDiagnostics()}). In Vercel → Settings → Environment Variables: add JWT_SECRET, tick Production (and Preview if you use preview deploys), save, then Redeploy.`,
          );
          throw new Error(
            'No JWT signing secret found. Set JWT_SECRET in Vercel Environment Variables for the same environment as this deployment (Production vs Preview), then redeploy.',
          );
        }
        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') ?? '7d',
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}