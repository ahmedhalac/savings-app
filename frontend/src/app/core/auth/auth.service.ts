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
  readonly isLoading = computed(() => this._state().isPending);
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
    // Wait for any in-flight session validation to settle before signing in.
    // After inactivity, useSession re-validates lazily; signing in during that
    // pending window can cause a false "invalid credentials" error.
    await withTimeout(
      new Promise<void>(resolve => {
        if (!authClient.useSession.get().isPending) { resolve(); return; }
        const unsub = authClient.useSession.subscribe(s => {
          if (!s.isPending) { unsub(); resolve(); }
        });
      }),
      2000,
      undefined,
    );

    const result = await withTimeout(
      authClient.signIn.email({ email, password }),
      8000,
      { data: null, error: { message: 'timeout', status: 408, statusText: 'Request Timeout' } } as Awaited<ReturnType<typeof authClient.signIn.email>>,
    );
    if (!result.error) {
      this._signingOut.set(false);
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
    // Cap the wait — on iOS PWA signOut can hang. We've already cleared client state.
    return withTimeout(authClient.signOut(), 8000, undefined as Awaited<ReturnType<typeof authClient.signOut>>);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms)),
  ]);
}
