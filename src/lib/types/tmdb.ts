export interface PaginatedResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

export interface MediaBase {
	id: number;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	vote_average: number;
	vote_count: number;
	popularity: number;
	genre_ids: number[];
}

export interface Movie extends MediaBase {
	media_type: 'movie';
	title: string;
	original_title: string;
	release_date: string;
}

export interface TVShow extends MediaBase {
	media_type: 'tv';
	name: string;
	original_name: string;
	first_air_date: string;
}

export type MediaItem = Movie | TVShow;

/** @deprecated Use MediaItem */
export type SearchResult = MediaItem;

export function isMovie(item: MediaItem): item is Movie {
	return item.media_type === 'movie';
}

export function isTVShow(item: MediaItem): item is TVShow {
	return item.media_type === 'tv';
}

export interface Genre {
	id: number;
	name: string;
}

export interface CastMember {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
}

export interface CrewMember {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path: string | null;
}

export interface CreditsResponse {
	id: number;
	cast: CastMember[];
	crew: CrewMember[];
}

export interface MovieDetail {
	media_type: 'movie';
	id: number;
	title: string;
	original_title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	popularity: number;
	runtime: number | null;
	genres: Genre[];
	status: string;
	tagline: string;
}

export interface TVDetail {
	media_type: 'tv';
	id: number;
	name: string;
	original_name: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	first_air_date: string;
	vote_average: number;
	vote_count: number;
	popularity: number;
	number_of_seasons: number;
	number_of_episodes: number;
	episode_run_time: number[];
	genres: Genre[];
	status: string;
	tagline: string;
	in_production: boolean;
}

export type MediaDetail = MovieDetail | TVDetail;

export function isMovieDetail(item: MediaDetail): item is MovieDetail {
	return item.media_type === 'movie';
}

export function isTVDetail(item: MediaDetail): item is TVDetail {
	return item.media_type === 'tv';
}
