import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { mapSupabaseAuthError } from '$lib/utils/authErrors';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (session) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());
		const email = (body.email as string).trim();
		const password = body.password as string;

		if (!email || !password) {
			return fail(400, { error: 'Email et mot de passe requis.' });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Adresse email invalide.' });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return fail(400, { error: mapSupabaseAuthError(error) });
		}

		throw redirect(303, '/');
	},

	register: async ({ request, locals, url }) => {
		const body = Object.fromEntries(await request.formData());
		const email = (body.email as string).trim();
		const password = body.password as string;
		const username = (body.username as string)?.trim();
		const birth_date = body.birth_date as string;

		if (!email || !password || !username || !birth_date) {
			return fail(400, { error: 'Tous les champs sont requis.' });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Adresse email invalide.' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Le mot de passe doit faire au moins 6 caractères.' });
		}

		if (username.length < 3) {
			return fail(400, { error: 'Le nom d\'utilisateur doit faire au moins 3 caractères.' });
		}

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`,
				data: {
					username,
					birth_date
				}
			},
		});

		if (error) {
			return fail(400, { error: mapSupabaseAuthError(error) });
		}

		return { success: 'Inscription réussie ! Vous pouvez maintenant vous connecter (ou vérifier vos emails).' };
	}
};
