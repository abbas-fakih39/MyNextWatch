import type { Session, User } from '@supabase/supabase-js';

class AuthStore {
	// Les propriétés sont réactives globalement grâce à $state (Svelte 5)
	session = $state<Session | null>(null);
	user = $state<User | null>(null);
	isInitialized = $state(false);

	setAuth(session: Session | null, user: User | null) {
		this.session = session;
		this.user = user;
		this.isInitialized = true;
	}
}

export const auth = new AuthStore();
