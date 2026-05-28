import { TMDB_API_KEY } from '$env/static/private';
import type {
	CreditsResponse,
	MediaItem,
	Movie,
	MovieDetail,
	PaginatedResponse,
	TVDetail,
	TVShow
} from '$lib/types/tmdb';

const BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_LANG = 'fr-FR';

async function fetchFromTMDB<T>(
	endpoint: string,
	params: Record<string, string> = {}
): Promise<T | null> {
	const url = new URL(`${BASE_URL}${endpoint}`);
	url.searchParams.append('api_key', TMDB_API_KEY);
	url.searchParams.append('language', DEFAULT_LANG);

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.append(key, value);
	}

	try {
		const response = await fetch(url.toString(), {
			headers: { Accept: 'application/json' }
		});

		if (!response.ok) {
			console.error(`TMDB Error: ${response.status} ${response.statusText} on ${endpoint}`);
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error(`TMDB Fetch Error on ${endpoint}:`, error);
		return null;
	}
}

export async function getTrending(
	mediaType: 'movie' | 'tv' | 'all' = 'all',
	timeWindow: 'day' | 'week' = 'day'
): Promise<MediaItem[]> {
	const data = await fetchFromTMDB<PaginatedResponse<MediaItem>>(
		`/trending/${mediaType}/${timeWindow}`
	);
	if (mediaType === 'all') {
		return data?.results ?? [];
	}
	return (data?.results ?? []).map((item) => ({ ...item, media_type: mediaType })) as MediaItem[];
}

export async function getPopular(
	mediaType: 'movie' | 'tv',
	page: number = 1
): Promise<{ items: MediaItem[]; totalPages: number }> {
	const data = await fetchFromTMDB<PaginatedResponse<Movie | TVShow>>(`/${mediaType}/popular`, {
		page: page.toString()
	});
	const items = (data?.results ?? []).map((item) => ({
		...item,
		media_type: mediaType
	})) as MediaItem[];
	return { items, totalPages: data?.total_pages ?? 1 };
}

export async function searchMedia(
	query: string,
	page: number = 1
): Promise<{ items: MediaItem[]; totalPages: number }> {
	const data = await fetchFromTMDB<PaginatedResponse<MediaItem>>(`/search/multi`, {
		query,
		page: page.toString(),
		include_adult: 'false'
	});
	const items = (data?.results ?? []).filter(
		(item) => item.media_type === 'movie' || item.media_type === 'tv'
	) as MediaItem[];
	return { items, totalPages: data?.total_pages ?? 1 };
}

export async function getMovieDetails(id: number): Promise<{
	detail: MovieDetail;
	credits: CreditsResponse;
	similar: Movie[];
} | null> {
	const [rawDetail, credits, similarData] = await Promise.all([
		fetchFromTMDB<Omit<MovieDetail, 'media_type'>>(`/movie/${id}`),
		fetchFromTMDB<CreditsResponse>(`/movie/${id}/credits`),
		fetchFromTMDB<PaginatedResponse<Omit<Movie, 'media_type'>>>(`/movie/${id}/similar`)
	]);

	if (!rawDetail) return null;

	const detail: MovieDetail = { ...rawDetail, media_type: 'movie' };
	const similar: Movie[] = (similarData?.results ?? []).map((item) => ({
		...item,
		media_type: 'movie' as const
	}));

	return { detail, credits: credits ?? { id, cast: [], crew: [] }, similar };
}

export async function getMovieBasic(id: number): Promise<MovieDetail | null> {
	const data = await fetchFromTMDB<Omit<MovieDetail, 'media_type'>>(`/movie/${id}`);
	if (!data) return null;
	return { ...data, media_type: 'movie' };
}

export async function getTVBasic(id: number): Promise<TVDetail | null> {
	const data = await fetchFromTMDB<Omit<TVDetail, 'media_type'>>(`/tv/${id}`);
	if (!data) return null;
	return { ...data, media_type: 'tv' };
}

export async function getTVDetails(id: number): Promise<{
	detail: TVDetail;
	credits: CreditsResponse;
	similar: TVShow[];
} | null> {
	const [rawDetail, credits, similarData] = await Promise.all([
		fetchFromTMDB<Omit<TVDetail, 'media_type'>>(`/tv/${id}`),
		fetchFromTMDB<CreditsResponse>(`/tv/${id}/credits`),
		fetchFromTMDB<PaginatedResponse<Omit<TVShow, 'media_type'>>>(`/tv/${id}/similar`)
	]);

	if (!rawDetail) return null;

	const detail: TVDetail = { ...rawDetail, media_type: 'tv' };
	const similar: TVShow[] = (similarData?.results ?? []).map((item) => ({
		...item,
		media_type: 'tv' as const
	}));

	return { detail, credits: credits ?? { id, cast: [], crew: [] }, similar };
}
