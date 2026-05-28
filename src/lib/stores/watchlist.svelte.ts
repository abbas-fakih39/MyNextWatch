import type { WatchlistEntry, WatchlistStatus } from '$lib/types/watchlist';

class WatchlistStore {
	entries = $state<WatchlistEntry[]>([]);

	counts = $derived({
		watching: this.entries.filter((e) => e.status === 'watching').length,
		completed: this.entries.filter((e) => e.status === 'completed').length,
		plan_to_watch: this.entries.filter((e) => e.status === 'plan_to_watch').length,
		on_hold: this.entries.filter((e) => e.status === 'on_hold').length,
		dropped: this.entries.filter((e) => e.status === 'dropped').length
	});

	setEntries(entries: WatchlistEntry[]) {
		this.entries = entries;
	}

	getEntry(tmdbId: number, mediaType: 'movie' | 'tv'): WatchlistEntry | undefined {
		return this.entries.find((e) => e.tmdb_id === tmdbId && e.media_type === mediaType);
	}

	add(entry: WatchlistEntry) {
		const idx = this.entries.findIndex(
			(e) => e.tmdb_id === entry.tmdb_id && e.media_type === entry.media_type
		);
		if (idx >= 0) {
			this.entries = this.entries.map((e, i) => (i === idx ? entry : e));
		} else {
			this.entries = [...this.entries, entry];
		}
	}

	remove(id: string) {
		this.entries = this.entries.filter((e) => e.id !== id);
	}

	updateStatus(id: string, status: WatchlistStatus) {
		this.entries = this.entries.map((e) => (e.id === id ? { ...e, status } : e));
	}

	updateRating(id: string, rating: number | null) {
		this.entries = this.entries.map((e) => (e.id === id ? { ...e, rating } : e));
	}
}

export const watchlist = new WatchlistStore();
