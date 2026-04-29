import { TMDB_API_KEY } from '$env/static/private';
import type { Movie, PaginatedResponse, TVShow } from '$lib/types/tmdb';

const BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_LANG = 'fr-FR';

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
	const url = new URL(`${BASE_URL}${endpoint}`);
	url.searchParams.append('api_key', TMDB_API_KEY);
	url.searchParams.append('language', DEFAULT_LANG);
	
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.append(key, value);
	}

	try {
		const response = await fetch(url.toString(), {
			headers: {
				'Accept': 'application/json'
			}
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

export async function getTrending(mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'day') {
	const data = await fetchFromTMDB<PaginatedResponse<Movie | TVShow>>(`/trending/${mediaType}/${timeWindow}`);
	return data?.results || [];
}

export async function getPopular(mediaType: 'movie' | 'tv' = 'movie') {
	const data = await fetchFromTMDB<PaginatedResponse<Movie | TVShow>>(`/${mediaType}/popular`);
	return data?.results || [];
}

export async function searchMedia(query: string, page: number = 1) {
	const data = await fetchFromTMDB<PaginatedResponse<Movie | TVShow>>(`/search/multi`, {
		query,
		page: page.toString(),
		include_adult: 'false'
	});
	return data;
}

export async function getDetails(id: number, mediaType: 'movie' | 'tv') {
	// append_to_response permet de récupérer le casting et les trailers en 1 seule requête
	return await fetchFromTMDB<any>(`/${mediaType}/${id}`, {
		append_to_response: 'credits,videos'
	});
}
