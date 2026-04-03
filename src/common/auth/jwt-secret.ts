import { createHash } from 'crypto';

/**
 * Prefer JWT_SECRET. If unset in production, derive from MONGODB_URI so serverless
 * still boots when only the DB URL is configured. Local non-production uses a fixed dev string.
 */
export function getJwtSecret(): string {
  const jwt = process.env.JWT_SECRET?.trim();
  if (jwt) return jwt;

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-only-not-for-production';
  }

  const mongo = process.env.MONGODB_URI?.trim();
  if (mongo) {
    return createHash('sha256').update(`jwt:${mongo}`, 'utf8').digest('base64url');
  }

  throw new Error(
    'Set JWT_SECRET or MONGODB_URI in Vercel → Environment Variables, then redeploy.',
  );
}
