export const environment = {
  production: true,
  // Relative path — Vercel proxies /api/* to the backend, making cookies first-party
  // and fixing the iOS PWA cross-site cookie block.
  apiBaseUrl: '/api',
};
