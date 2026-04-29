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
	title: string;
	original_title: string;
	release_date: string;
	media_type?: 'movie';
}

export interface TVShow extends MediaBase {
	name: string;
	original_name: string;
	first_air_date: string;
	media_type?: 'tv';
}

export type SearchResult = Movie | TVShow;
