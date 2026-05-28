<script lang="ts">
	import { goto } from '$app/navigation';
	import MediaCard from '$lib/components/MediaCard.svelte';

	let { data } = $props();

	let query = $state('');
	$effect(() => { query = data.query; });
	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		query = value;
		clearTimeout(debounceTimer);
		if (value.trim().length >= 2) {
			debounceTimer = setTimeout(() => {
				goto(`/search?q=${encodeURIComponent(value.trim())}`, { replaceState: true });
			}, 300);
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		clearTimeout(debounceTimer);
		if (query.trim().length >= 1) {
			goto(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}
</script>

<svelte:head>
	<title>{data.query ? `"${data.query}" — Recherche` : 'Recherche'} — MyNextWatch</title>
</svelte:head>

<div class="min-h-screen bg-bg pb-16">
	<div class="px-4 sm:px-6 lg:px-8 max-w-400 mx-auto pt-10 pb-8">
		<h1 class="font-display text-5xl sm:text-6xl text-text mb-6">Recherche</h1>

		<!-- Search input -->
		<form onsubmit={handleSubmit} class="max-w-xl">
			<div class="relative">
				<svg
					class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					name="q"
					type="search"
					placeholder="Titre d'un film ou d'une série..."
					value={query}
					oninput={handleInput}
					class="w-full bg-surface border border-border text-text placeholder-muted rounded-md pl-12 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
				/>
			</div>
		</form>
	</div>

	<div class="px-4 sm:px-6 lg:px-8 max-w-400 mx-auto">
		{#if !data.query}
			<!-- No query yet -->
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<svg class="h-16 w-16 text-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<p class="text-muted text-lg">Tapez un titre pour rechercher</p>
				<p class="text-border text-sm mt-1">Films, séries, documentaires...</p>
			</div>
		{:else if data.items.length === 0}
			<!-- No results -->
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<svg class="h-16 w-16 text-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="text-text text-lg font-medium">Aucun résultat pour</p>
				<p class="text-accent font-semibold text-xl mt-1">« {data.query} »</p>
				<p class="text-muted text-sm mt-3">Vérifiez l'orthographe ou essayez un autre titre.</p>
			</div>
		{:else}
			<!-- Results -->
			<div class="mb-4">
				<p class="text-muted text-sm">
					{data.items.length} résultat{data.items.length > 1 ? 's' : ''} pour
					<span class="text-text font-medium">« {data.query} »</span>
				</p>
			</div>
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
				{#each data.items as item (item.id)}
					<MediaCard {item} />
				{/each}
			</div>
		{/if}
	</div>
</div>
