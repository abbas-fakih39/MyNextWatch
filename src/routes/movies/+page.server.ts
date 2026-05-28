import type { Actions, PageServerLoad } from './$types';
import { getPopular } from '$lib/server/tmdb';

export const load: PageServerLoad = async () => {
	const { items, totalPages } = await getPopular('movie', 1);
	return { items, totalPages, currentPage: 1 };
};

export const actions: Actions = {
	more: async ({ request }) => {
		const data = await request.formData();
		const page = Number(data.get('page'));
		const { items, totalPages } = await getPopular('movie', page);
		return { items, totalPages, page };
	}
};
