export type WatchlistStatus = 'watching' | 'completed' | 'plan_to_watch' | 'on_hold' | 'dropped';

export interface WatchlistEntry {
	id: string;
	user_id: string;
	tmdb_id: number;
	media_type: 'movie' | 'tv';
	title: string;
	poster_path: string | null;
	status: WatchlistStatus;
	rating: number | null;
	added_at: string;
}

export const STATUS_LABELS: Record<WatchlistStatus, string> = {
	watching: 'En cours',
	completed: 'Vu',
	plan_to_watch: 'À voir',
	on_hold: 'En pause',
	dropped: 'Abandonné'
};

export const STATUS_OPTIONS: { value: WatchlistStatus; label: string }[] = [
	{ value: 'plan_to_watch', label: 'À voir' },
	{ value: 'watching', label: 'En cours' },
	{ value: 'completed', label: 'Vu' },
	{ value: 'on_hold', label: 'En pause' },
	{ value: 'dropped', label: 'Abandonné' }
];
