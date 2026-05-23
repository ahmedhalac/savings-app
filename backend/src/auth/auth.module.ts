import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth.js';

export const AuthModule = BetterAuthModule.forRoot({ auth });
