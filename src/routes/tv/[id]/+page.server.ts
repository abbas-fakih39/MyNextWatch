import { error } from '@sveltejs/kit';
import { getTVDetails } from '$lib/server/tmdb';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);

	if (!Number.isFinite(id) || id <= 0) {
		error(404, 'Série introuvable');
	}

	const result = await getTVDetails(id);

	if (!result) {
		error(404, 'Série introuvable');
	}

	return {
		detail: result.detail,
		credits: result.credits,
		similar: result.similar
	};
};
