<script lang="ts">
	import MediaCard from './MediaCard.svelte';
	import type { MediaItem } from '$lib/types/tmdb';

	let {
		title,
		items,
		viewAllHref,
		limit = 18
	}: {
		title: string;
		items: MediaItem[];
		viewAllHref?: string;
		limit?: number;
	} = $props();
</script>

<section class="py-8 px-4 sm:px-6 lg:px-8 max-w-400 mx-auto">
	<div class="flex items-center justify-between mb-5">
		<h2 class="text-xl sm:text-2xl font-bold text-text tracking-tight">{title}</h2>
		{#if viewAllHref}
			<a href={viewAllHref} class="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
				Voir tout →
			</a>
		{/if}
	</div>
	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
		{#each items.slice(0, limit) as item (item.id)}
			<MediaCard {item} />
		{/each}
	</div>
</section>
