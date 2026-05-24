import { Injectable, DestroyRef, computed, inject, signal } from '@angular/core';
import { authClient } from './auth.client';

type SessionAtomState = ReturnType<typeof authClient.useSession.get>;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _state = signal<SessionAtomState>(authClient.useSession.get());

  private readonly _signingOut = signal(false);
  // Optimistically true immediately after a successful signIn before refetch completes
  private readonly _signedIn = signal(false);

  readonly session = computed(() => this._state().data);
  readonly isAuthenticated = computed(() =>
    !this._signingOut() && (this._signedIn() || (!!this._state().data && !this._state().isPending))
  );

  constructor() {
    const unsub = authClient.useSession.subscribe((s) => {
      this._state.set(s);
      if (s.data && !s.isPending) this._signedIn.set(false);
    });
    this.destroyRef.onDestroy(() => unsub());
  }

  async signIn(email: string, password: string) {
    const result = await authClient.signIn.email({ email, password });
    if (!result.error) {
      this._signedIn.set(true);
      // Fire-and-forget — on mobile PWA the service worker can cause this to hang
      authClient.useSession.get().refetch().catch(() => {});
    }
    return result;
  }

  signUp(name: string, email: string, password: string) {
    return authClient.signUp.email({ name, email, password });
  }

  async signOut() {
    this._signingOut.set(true);
    this._signedIn.set(false);
    return authClient.signOut();
  }
}
