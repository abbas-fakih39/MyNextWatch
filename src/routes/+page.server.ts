import type { PageServerLoad } from './$types';
import { getTrending, getPopular } from '$lib/server/tmdb';

export const load: PageServerLoad = async () => {
	const [trending, { items: popularMovies }, { items: popularTV }] = await Promise.all([
		getTrending('all', 'day'),
		getPopular('movie'),
		getPopular('tv')
	]);

	return {
		hero: trending[0] ?? null,
		trending,
		popularMovies,
		popularTV
	};
};
