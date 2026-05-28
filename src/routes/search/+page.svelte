<script lang="ts">
	import { goto } from '$app/navigation';
	import MediaCard from '$lib/components/MediaCard.svelte';

	let { data } = $props();

	let query = $state('');
	$effect(() => {
		query = data.query;
	});
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
					class="w-full rounded-md border border-border bg-surface py-3 pr-4 pl-12 text-base text-text placeholder-muted transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
				/>
			</div>
		</form>
	</div>

	<div class="mx-auto max-w-400 px-4 sm:px-6 lg:px-8">
		{#if !data.query}
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
				<p class="mt-1 text-sm text-border">Films, séries, documentaires...</p>
			</div>
		{:else if data.items.length === 0}
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
				<p class="mt-1 text-xl font-semibold text-accent">« {data.query} »</p>
				<p class="mt-3 text-sm text-muted">Vérifiez l'orthographe ou essayez un autre titre.</p>
			</div>
		{:else}
			<!-- Results -->
			<div class="mb-4">
				<p class="text-sm text-muted">
					{data.items.length} résultat{data.items.length > 1 ? 's' : ''} pour
					<span class="font-medium text-text">« {data.query} »</span>
				</p>
			</div>
			<div
				class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6"
			>
				{#each data.items as item (item.id)}
					<MediaCard {item} />
				{/each}
			</div>
		{/if}
	</div>
</div>
