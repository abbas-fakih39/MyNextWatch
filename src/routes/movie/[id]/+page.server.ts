import { error } from '@sveltejs/kit';
import { getMovieDetails } from '$lib/server/tmdb';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);

	if (!Number.isFinite(id) || id <= 0) {
		error(404, 'Film introuvable');
	}

	const result = await getMovieDetails(id);

	if (!result) {
		error(404, 'Film introuvable');
	}

	return {
		detail: result.detail,
		credits: result.credits,
		similar: result.similar
	};
};
