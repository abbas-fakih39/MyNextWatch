<script lang="ts">
	import type { MediaItem } from '$lib/types/tmdb';
	import { getTitle, getYear, getHref, getPosterUrl, getRating, getTypeLabel } from '$lib/utils/media';

	let { item }: { item: MediaItem } = $props();

	const title = $derived(getTitle(item));
	const year = $derived(getYear(item));
	const posterUrl = $derived(getPosterUrl(item));
	const rating = $derived(getRating(item));
	const href = $derived(getHref(item));
	const typeLabel = $derived(getTypeLabel(item));
</script>

<a
	{href}
	class="group flex flex-col rounded-md overflow-hidden bg-surface transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl hover:shadow-black/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
>
	<div class="aspect-2/3 w-full overflow-hidden bg-border relative">
		{#if posterUrl}
			<img
				src={posterUrl}
				alt={title}
				class="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
				loading="lazy"
			/>
		{:else}
			<div class="h-full w-full flex flex-col items-center justify-center gap-3 p-4 text-center">
				<svg class="h-10 w-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
					/>
				</svg>
				<span class="text-xs text-muted font-medium leading-tight">{title}</span>
			</div>
		{/if}

		<!-- Badge type — pill discret -->
		<span
			class="absolute top-1.5 left-1.5 bg-surface/90 border border-border text-muted text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider"
		>
			{typeLabel}
		</span>

		<!-- Rating — jaune accent -->
		{#if rating > 0}
			<span
				class="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-surface/90 border border-border text-accent text-[10px] font-bold px-1.5 py-0.5 rounded"
			>
				★ {rating}
			</span>
		{/if}
	</div>

	<!-- Barre info toujours visible -->
	<div class="px-2 py-1.5 bg-surface">
		<p class="text-text text-xs font-semibold leading-tight line-clamp-1">{title}</p>
		{#if year}
			<p class="text-muted text-[10px] mt-0.5">{year}</p>
		{/if}
	</div>
</a>
