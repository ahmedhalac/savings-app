import { Injectable, DestroyRef, computed, inject, signal } from '@angular/core';
import { authClient } from './auth.client';

type SessionAtomState = ReturnType<typeof authClient.useSession.get>;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _state = signal<SessionAtomState>(authClient.useSession.get());

  private readonly _signingOut = signal(false);
  readonly session = computed(() => this._state().data);
  readonly isAuthenticated = computed(() => !this._signingOut() && !!this._state().data && !this._state().isPending);

  constructor() {
    const unsub = authClient.useSession.subscribe((s) => this._state.set(s));
    this.destroyRef.onDestroy(() => unsub());
  }

  async signIn(email: string, password: string) {
    const result = await authClient.signIn.email({ email, password });
    if (!result.error) {
      await authClient.useSession.get().refetch();
    }
    return result;
  }

  signUp(name: string, email: string, password: string) {
    return authClient.signUp.email({ name, email, password });
  }

  async signOut() {
    this._signingOut.set(true);
    return authClient.signOut();
  }
}
