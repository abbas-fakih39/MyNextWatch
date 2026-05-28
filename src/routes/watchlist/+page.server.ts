import { fail, redirect } from '@sveltejs/kit';
import { getMovieBasic, getTVBasic } from '$lib/server/tmdb';
import type { PageServerLoad, Actions } from './$types';
import type { WatchlistEntry } from '$lib/types/watchlist';
import type { MovieDetail, TVDetail } from '$lib/types/tmdb';

export type WatchlistEntryWithMedia = WatchlistEntry & {
	media: MovieDetail | TVDetail | null;
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/auth');

	const { data: rows } = await locals.supabase
		.from('watchlist')
		.select('*')
		.order('added_at', { ascending: false });

	const entries = (rows ?? []) as WatchlistEntry[];

	if (entries.length === 0) {
		return { entries: [] as WatchlistEntryWithMedia[] };
	}

	const enriched = await Promise.all(
		entries.map(async (entry): Promise<WatchlistEntryWithMedia> => {
			const media =
				entry.media_type === 'movie'
					? await getMovieBasic(entry.tmdb_id)
					: await getTVBasic(entry.tmdb_id);
			return { ...entry, media };
		})
	);

	return { entries: enriched };
};

export const actions: Actions = {
	remove: async ({ locals, request }) => {
		if (!locals.user) redirect(303, '/auth');

		const data = await request.formData();
		const id = data.get('id');

		if (typeof id !== 'string' || !id) {
			return fail(400, { error: 'ID manquant' });
		}

		const { error } = await locals.supabase
			.from('watchlist')
			.delete()
			.eq('id', id)
			.eq('user_id', locals.user.id);

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	updateStatus: async ({ locals, request }) => {
		if (!locals.user) redirect(303, '/auth');

		const data = await request.formData();
		const id = data.get('id');
		const status = data.get('status');

		if (typeof id !== 'string' || !id || typeof status !== 'string' || !status) {
			return fail(400, { error: 'Paramètres manquants' });
		}

		const { data: entry, error } = await locals.supabase
			.from('watchlist')
			.update({ status })
			.eq('id', id)
			.eq('user_id', locals.user.id)
			.select()
			.single();

		if (error) return fail(500, { error: error.message });
		return { entry: entry as WatchlistEntry };
	},

	updateRating: async ({ locals, request }) => {
		if (!locals.user) redirect(303, '/auth');

		const data = await request.formData();
		const id = data.get('id');
		const ratingRaw = data.get('rating');

		if (typeof id !== 'string' || !id) {
			return fail(400, { error: 'ID manquant' });
		}

		const rating = ratingRaw ? Number(ratingRaw) : null;
		if (rating !== null && (isNaN(rating) || rating < 1 || rating > 10)) {
			return fail(400, { error: 'Note invalide (1-10)' });
		}

		const { data: entry, error } = await locals.supabase
			.from('watchlist')
			.update({ rating })
			.eq('id', id)
			.eq('user_id', locals.user.id)
			.select()
			.single();

		if (error) return fail(500, { error: error.message });
		return { entry: entry as WatchlistEntry };
	}
};
