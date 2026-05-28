import type { Actions, PageServerLoad } from './$types';
import { getPopular } from '$lib/server/tmdb';

export const load: PageServerLoad = async () => {
	const { items, totalPages } = await getPopular('tv', 1);
	return { items, totalPages, currentPage: 1 };
};

export const actions: Actions = {
	more: async ({ request }) => {
		const data = await request.formData();
		const page = Math.max(1, Number(data.get('page')) || 1);
		const { items, totalPages } = await getPopular('tv', page);
		return { items, totalPages, page };
	}
};
