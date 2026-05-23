import { Injectable, DestroyRef, computed, inject, signal } from '@angular/core';
import { authClient } from './auth.client';

type SessionAtomState = ReturnType<typeof authClient.useSession.get>;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _state = signal<SessionAtomState>(authClient.useSession.get());

  readonly session = computed(() => this._state().data);
  readonly isAuthenticated = computed(() => !!this._state().data && !this._state().isPending);

  constructor() {
    const unsub = authClient.useSession.subscribe((s) => this._state.set(s));
    this.destroyRef.onDestroy(() => unsub());
  }

  signIn(email: string, password: string) {
    return authClient.signIn.email({ email, password });
  }

  signOut() {
    return authClient.signOut();
  }
}
