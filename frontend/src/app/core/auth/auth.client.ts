import { createAuthClient } from 'better-auth/client';
import { environment } from '../../../environments/environment';

// better-auth client appends /api/auth — strip the /api suffix from apiBaseUrl
const backendUrl = environment.apiBaseUrl.replace(/\/api$/, '');

export const authClient = createAuthClient({
  baseURL: backendUrl,
});
