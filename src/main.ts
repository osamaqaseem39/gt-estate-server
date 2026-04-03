import type { NestExpressApplication } from '@nestjs/platform-express';
import { configureApp } from './configure-app';

let serverlessApp: Promise<NestExpressApplication> | null = null;

function getServerlessApp() {
  if (!serverlessApp) {
    serverlessApp = (async () => {
      const app = await configureApp();
      await app.init();
      return app;
    })();
  }
  return serverlessApp;
}

/** Vercel invokes `src/main` — must default-export a handler */
export default async function handler(req: any, res: any) {
  const app = await getServerlessApp();
  return app.getHttpAdapter().getInstance()(req, res);
}

/** Local / Docker / non-Vercel: start listening */
if (!process.env.VERCEL) {
  void (async () => {
    const app = await configureApp();
    const port = process.env.PORT || 3002;
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  })();
}
