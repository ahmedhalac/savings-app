import { createAuthClient } from 'better-auth/client';
import { environment } from '../../../environments/environment';

// better-auth appends /api/auth to baseURL.
// If apiBaseUrl is relative (e.g. /api), use window.location.origin so requests stay
// same-origin and are proxied by the CDN edge — required for iOS PWA cookie handling.
const rawBase = environment.apiBaseUrl.replace(/\/api$/, '');
const backendUrl = rawBase.startsWith('http') ? rawBase : window.location.origin;

export const authClient = createAuthClient({
  baseURL: backendUrl,
});
