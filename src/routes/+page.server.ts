import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getTrending } from '$lib/server/tmdb';

export const load: PageServerLoad = async () => {
	// Test temporaire pour vérifier que l'API TMDB fonctionne
	const trendingMovies = await getTrending('movie', 'day');
	if (trendingMovies.length > 0) {
		console.log('✅ TMDB SUCCESS: Found trending movies!', trendingMovies[0].title);
	} else {
		console.error('❌ TMDB FAILED: No trending movies found.');
	}

	return {
		trendingMovies
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const { error } = await locals.supabase.auth.signOut();
		if (error) {
			console.error('Logout error:', error);
		}
		throw redirect(303, '/auth');
	}
};
