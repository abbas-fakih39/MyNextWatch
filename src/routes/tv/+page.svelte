<script lang="ts">
	import { enhance } from '$app/forms';
	import MediaCard from '$lib/components/MediaCard.svelte';
	import MediaCardSkeleton from '$lib/components/MediaCardSkeleton.svelte';
	import type { MediaItem } from '$lib/types/tmdb';

	let { data, form } = $props();

	let extraItems = $state<MediaItem[]>([]);
	let currentPage = $state(1);
	let loading = $state(false);

	const allItems = $derived([...data.items, ...extraItems]);
	const hasMore = $derived(currentPage < data.totalPages);

	$effect(() => {
		if (form?.items) {
			extraItems = [...extraItems, ...(form.items as MediaItem[])];
			currentPage = form.page as number;
		}
	});
</script>

<svelte:head>
	<title>Séries Populaires — MyNextWatch</title>
	<meta name="description" content="Découvrez les séries les plus populaires du moment sur MyNextWatch." />
</svelte:head>

<div class="min-h-screen bg-bg pb-16">
	<!-- Header -->
	<div class="px-4 sm:px-6 lg:px-8 max-w-400 mx-auto pt-10 pb-6">
		<h1 class="font-display text-5xl sm:text-6xl text-text mb-1">Séries</h1>
		<p class="text-muted text-sm">Les plus populaires du moment</p>
	</div>

	<!-- Grid -->
	{#if allItems.length > 0}
		<div class="px-4 sm:px-6 lg:px-8 max-w-400 mx-auto">
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
				{#each allItems as item (item.id)}
					<MediaCard {item} />
				{/each}
				{#if loading}
					{#each { length: 6 } as _}
						<MediaCardSkeleton />
					{/each}
				{/if}
			</div>

			<!-- Load more -->
			{#if hasMore && !loading}
				<div class="flex justify-center mt-10">
					<form
						method="POST"
						action="?/more"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								loading = false;
								await update({ reset: false });
							};
						}}
					>
						<input type="hidden" name="page" value={currentPage + 1} />
						<button
							type="submit"
							class="bg-surface border border-border hover:border-indigo-500 text-text hover:text-white px-8 py-3 rounded-md font-medium transition-colors"
						>
							Charger plus
						</button>
					</form>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Empty state -->
		<div class="flex flex-col items-center justify-center py-24 text-center px-4">
			<svg class="h-16 w-16 text-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
			</svg>
			<p class="text-muted text-lg">Aucune série disponible pour le moment.</p>
		</div>
	{/if}
</div>
