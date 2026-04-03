import { ConfigService } from '@nestjs/config';

/**
 * Resolves JWT signing secret from env. Checks several sources because
 * serverless hosts expose variables on process.env and names may differ.
 */
export function resolveJwtSecret(configService: ConfigService): string | undefined {
  const tryTrim = (v: string | undefined): string | undefined => {
    const t = v?.trim();
    return t ? t : undefined;
  };

  return (
    tryTrim(configService.get<string>('JWT_SECRET')) ??
    tryTrim(process.env.JWT_SECRET) ??
    tryTrim(configService.get<string>('AUTH_JWT_SECRET')) ??
    tryTrim(process.env.AUTH_JWT_SECRET)
  );
}
