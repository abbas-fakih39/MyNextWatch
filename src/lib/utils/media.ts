import type { MediaDetail, MediaItem } from '$lib/types/tmdb';

type AnyMedia = MediaItem | MediaDetail;

export function getTitle(item: AnyMedia): string {
	return item.media_type === 'movie' ? item.title : item.name;
}

export function getReleaseDate(item: AnyMedia): string | null {
	return item.media_type === 'movie'
		? (item.release_date ?? null)
		: (item.first_air_date ?? null);
}

export function getYear(item: AnyMedia): number | null {
	const date = getReleaseDate(item);
	return date ? new Date(date).getFullYear() : null;
}

export function getHref(item: AnyMedia): string {
	return `/${item.media_type}/${item.id}`;
}

export function getPosterUrl(
	item: AnyMedia,
	size: 'w185' | 'w342' | 'w500' = 'w342'
): string | null {
	return item.poster_path ? `https://image.tmdb.org/t/p/${size}${item.poster_path}` : null;
}

export function getBackdropUrl(
	item: AnyMedia,
	size: 'w780' | 'original' = 'original'
): string | null {
	return item.backdrop_path ? `https://image.tmdb.org/t/p/${size}${item.backdrop_path}` : null;
}

export function getRating(item: AnyMedia): number {
	return Math.round(item.vote_average * 10) / 10;
}

export function getTypeLabel(item: AnyMedia): string {
	return item.media_type === 'movie' ? 'Film' : 'Série';
}

export function truncate(text: string, max: number): string {
	return text.length > max ? text.slice(0, max) + '…' : text;
}
