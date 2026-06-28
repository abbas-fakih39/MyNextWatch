import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchMedia } from '$lib/server/tmdb';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';
	const page = Number(url.searchParams.get('page') ?? '1') || 1;

	if (!query) {
		return json({ items: [], totalPages: 0, page: 1 });
	}

	const { items, totalPages } = await searchMedia(query, page);
	return json({ items, totalPages, page });
};
