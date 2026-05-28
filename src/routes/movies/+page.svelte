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
	<title>Films Populaires — MyNextWatch</title>
	<meta name="description" content="Découvrez les films les plus populaires du moment sur MyNextWatch." />
</svelte:head>

<div class="min-h-screen bg-bg pb-16">
	<!-- Header -->
	<div class="px-4 sm:px-6 lg:px-8 max-w-400 mx-auto pt-10 pb-6">
		<h1 class="font-display text-5xl sm:text-6xl text-text mb-1">Films</h1>
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
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
			</svg>
			<p class="text-muted text-lg">Aucun film disponible pour le moment.</p>
		</div>
	{/if}
</div>
