import { error, fail, redirect } from '@sveltejs/kit';
import { getTVDetails } from '$lib/server/tmdb';
import type { PageServerLoad, Actions } from './$types';
import type { WatchlistEntry, WatchlistStatus } from '$lib/types/watchlist';

const VALID_STATUSES: WatchlistStatus[] = [
	'watching',
	'completed',
	'plan_to_watch',
	'on_hold',
	'dropped'
];

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

export const actions: Actions = {
	add: async ({ locals, params, request }) => {
		if (!locals.user) redirect(303, '/auth');

		const id = Number(params.id);
		const data = await request.formData();
		const rawStatus = data.get('status');
		const status = typeof rawStatus === 'string' ? rawStatus : '';
		const rawTitle = data.get('title');
		const title = typeof rawTitle === 'string' ? rawTitle : '';
		const rawPoster = data.get('poster_path');
		const poster_path = typeof rawPoster === 'string' ? rawPoster : null;

		if (!VALID_STATUSES.includes(status as WatchlistStatus)) {
			return fail(400, { error: 'Statut invalide' });
		}
		if (!title) return fail(400, { error: 'Titre manquant' });

		const { data: entry, error: dbError } = await locals.supabase
			.from('watchlist')
			.upsert(
				{
					user_id: locals.user.id,
					tmdb_id: id,
					media_type: 'tv',
					title,
					poster_path: poster_path || null,
					status
				},
				{ onConflict: 'user_id,tmdb_id,media_type' }
			)
			.select()
			.single();

		if (dbError) return fail(500, { error: dbError.message });
		return { entry: entry as WatchlistEntry };
	},

	remove: async ({ locals, request }) => {
		if (!locals.user) redirect(303, '/auth');

		const data = await request.formData();
		const rawId = data.get('id');
		const entryId = typeof rawId === 'string' ? rawId : '';

		if (!entryId) return fail(400, { error: 'ID manquant' });

		const { error: dbError } = await locals.supabase
			.from('watchlist')
			.delete()
			.eq('id', entryId)
			.eq('user_id', locals.user.id);

		if (dbError) return fail(500, { error: dbError.message });
		return { success: true };
	},

	updateStatus: async ({ locals, request }) => {
		if (!locals.user) redirect(303, '/auth');

		const data = await request.formData();
		const rawId = data.get('id');
		const entryId = typeof rawId === 'string' ? rawId : '';
		const rawStatus = data.get('status');
		const status = typeof rawStatus === 'string' ? rawStatus : '';

		if (!entryId) return fail(400, { error: 'ID manquant' });
		if (!VALID_STATUSES.includes(status as WatchlistStatus)) {
			return fail(400, { error: 'Statut invalide' });
		}

		const { data: entry, error: dbError } = await locals.supabase
			.from('watchlist')
			.update({ status })
			.eq('id', entryId)
			.eq('user_id', locals.user.id)
			.select()
			.single();

		if (dbError) return fail(500, { error: dbError.message });
		return { entry: entry as WatchlistEntry };
	}
};
