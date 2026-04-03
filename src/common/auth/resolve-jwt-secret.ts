import { ConfigService } from '@nestjs/config';

const ENV_KEYS = ['JWT_SECRET', 'AUTH_JWT_SECRET', 'JWT_ACCESS_SECRET'] as const;

/**
 * Resolves JWT signing secret. Prefer runtime process.env (bracket access so
 * serverless bundlers are less likely to inline undefined at build time), then ConfigService.
 */
export function resolveJwtSecret(configService: ConfigService): string | undefined {
  const tryTrim = (v: string | undefined): string | undefined => {
    const t = v?.trim();
    return t ? t : undefined;
  };

  for (const key of ENV_KEYS) {
    const fromProcess = tryTrim(process.env[key]);
    if (fromProcess) return fromProcess;
    const fromConfig = tryTrim(configService.get<string>(key));
    if (fromConfig) return fromConfig;
  }

  return undefined;
}

/** Safe diagnostics when secret is missing (no values logged). */
export function jwtSecretEnvDiagnostics(): string {
  const parts = ENV_KEYS.map(
    (k) => `${k}=${process.env[k]?.length ? 'set' : 'unset'}`,
  );
  return parts.join(', ');
}
