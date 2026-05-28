import type { LayoutServerLoad } from './$types';
import type { WatchlistEntry } from '$lib/types/watchlist';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession();

	let watchlistEntries: WatchlistEntry[] = [];
	if (user) {
		const { data } = await supabase
			.from('watchlist')
			.select('*')
			.order('added_at', { ascending: false });
		watchlistEntries = (data ?? []) as WatchlistEntry[];
	}

	return { session, user, watchlistEntries };
};
