<script lang="ts">
	import { replaceState } from '$app/navigation';
	import MediaCard from '$lib/components/MediaCard.svelte';
	import type { MediaItem } from '$lib/types/tmdb';

	let { data } = $props();

	type SearchResponse = { items: MediaItem[]; totalPages: number; page: number };

	// Editable input value. Seeded from SSR data via the effect below.
	let query = $state('');

	// Client-side results (live search / "show more"). When null, the SSR
	// `data` results are shown — this keeps the first paint server-rendered.
	let override = $state<SearchResponse | null>(null);

	let loading = $state(false); // full (new) search in progress
	let loadingMore = $state(false); // "show more" in progress

	const items = $derived(override ? override.items : data.items);
	const totalPages = $derived(override ? override.totalPages : data.totalPages);
	const page = $derived(override ? override.page : 1);

	const hasQuery = $derived(query.trim().length >= 1);
	const canLoadMore = $derived(hasQuery && page < totalPages);

	// On real navigation (e.g. navbar submit) the query changes: sync the input
	// and drop the client override so the fresh SSR results take over.
	// replaceState() below is shallow routing and does NOT change data.query,
	// so this effect won't fire for in-page live searches.
	$effect(() => {
		query = data.query;
		override = null;
	});

	let debounceTimer: ReturnType<typeof setTimeout>;
	let controller: AbortController | undefined;

	async function runSearch(q: string) {
		// Cancel any in-flight search so a slow older response can't overwrite
		// the results of a newer query.
		controller?.abort();
		controller = new AbortController();
		loading = true;
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=1`, {
				signal: controller.signal
			});
			override = await res.json();
			// Keep the URL shareable without triggering a reload.
			replaceState(`/search?q=${encodeURIComponent(q)}`, {});
		} catch (err) {
			// Ignore aborts; on real network errors keep the previous results.
			if ((err as Error).name !== 'AbortError') console.error('Search failed:', err);
		} finally {
			loading = false;
		}
	}

	function handleInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		query = value;
		clearTimeout(debounceTimer);
		const trimmed = value.trim();
		if (trimmed.length >= 2) {
			debounceTimer = setTimeout(() => runSearch(trimmed), 400);
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		clearTimeout(debounceTimer);
		const trimmed = query.trim();
		if (trimmed.length >= 1) runSearch(trimmed);
	}

	async function loadMore() {
		if (loadingMore || page >= totalPages) return;
		loadingMore = true;
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&page=${page + 1}`);
			const result: SearchResponse = await res.json();
			// De-dupe by id — TMDB can repeat items across pages, which would
			// break the keyed {#each} below.
			const seen = new Set(items.map((it) => it.id));
			const merged = [...items, ...result.items.filter((it) => !seen.has(it.id))];
			override = { items: merged, totalPages: result.totalPages, page: result.page };
		} catch (err) {
			console.error('Load more failed:', err);
		} finally {
			loadingMore = false;
		}
	}
</script>

<svelte:head>
	<title>{query ? `"${query}" — Recherche` : 'Recherche'} — MyNextWatch</title>
</svelte:head>

<div class="min-h-screen bg-bg pb-16">
	<div class="mx-auto max-w-400 px-4 pt-10 pb-8 sm:px-6 lg:px-8">
		<h1 class="mb-6 font-display text-5xl text-text sm:text-6xl">Recherche</h1>

		<!-- Search input -->
		<form onsubmit={handleSubmit} class="max-w-xl">
			<div class="relative">
				<svg
					class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					name="q"
					type="search"
					placeholder="Titre d'un film ou d'une série..."
					value={query}
					oninput={handleInput}
					class="w-full rounded-md border border-border bg-surface py-3 pr-12 pl-12 text-base text-text placeholder-muted transition-all focus:border-primary-hover focus:ring-2 focus:ring-primary-hover focus:outline-none"
				/>
				{#if loading}
					<span
						class="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-muted/40 border-t-primary-hover"
						aria-label="Recherche en cours"
					></span>
				{/if}
			</div>
		</form>
	</div>

	<div class="mx-auto max-w-400 px-4 sm:px-6 lg:px-8">
		{#if !hasQuery}
			<!-- No query yet -->
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<svg
					class="mb-4 h-16 w-16 text-border"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<p class="text-lg text-muted">Tapez un titre pour rechercher</p>
				<p class="mt-1 text-sm text-muted">Films, séries, documentaires...</p>
			</div>
		{:else if items.length === 0 && !loading}
			<!-- No results -->
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<svg
					class="mb-4 h-16 w-16 text-border"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1"
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-lg font-medium text-text">Aucun résultat pour</p>
				<p class="mt-1 text-xl font-semibold text-accent">« {query} »</p>
				<p class="mt-3 text-sm text-muted">Vérifiez l'orthographe ou essayez un autre titre.</p>
			</div>
		{:else}
			<!-- Results -->
			<div class="mb-4">
				<p class="text-sm text-muted">
					{items.length} résultat{items.length > 1 ? 's' : ''} affiché{items.length > 1 ? 's' : ''} pour
					<span class="font-medium text-text">« {query} »</span>
				</p>
			</div>
			<div
				class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6"
			>
				{#each items as item (item.id)}
					<MediaCard {item} />
				{/each}
			</div>

			{#if canLoadMore}
				<div class="mt-8 flex justify-center">
					<button
						type="button"
						onclick={loadMore}
						disabled={loadingMore}
						class="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-6 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary-hover hover:text-primary-bright disabled:opacity-50"
					>
						{#if loadingMore}
							<span
								class="h-4 w-4 animate-spin rounded-full border-2 border-muted/40 border-t-primary-hover"
							></span>
							Chargement…
						{:else}
							Afficher plus
						{/if}
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>
