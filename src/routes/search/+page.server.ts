import type { PageServerLoad } from './$types';
import { searchMedia } from '$lib/server/tmdb';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';
	if (!query) {
		return { items: [], totalPages: 0, query: '' };
	}
	const { items, totalPages } = await searchMedia(query, 1);
	return { items, totalPages, query };
};
