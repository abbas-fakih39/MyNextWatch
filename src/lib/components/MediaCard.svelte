<script lang="ts">
	import type { MediaItem } from '$lib/types/tmdb';
	import {
		getTitle,
		getYear,
		getHref,
		getPosterUrl,
		getRating,
		getTypeLabel
	} from '$lib/utils/media';

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
	class="group flex flex-col overflow-hidden rounded-md bg-surface transition-transform duration-200 ease-out hover:scale-105 hover:shadow-xl hover:shadow-black/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
>
	<div class="relative aspect-2/3 w-full overflow-hidden bg-border">
		{#if posterUrl}
			<img
				src={posterUrl}
				alt={title}
				class="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
				loading="lazy"
			/>
		{:else}
			<div class="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center">
				<svg class="h-10 w-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
					/>
				</svg>
				<span class="text-xs leading-tight font-medium text-muted">{title}</span>
			</div>
		{/if}

		<span
			class="absolute top-1.5 left-1.5 rounded border border-border bg-surface/90 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-muted uppercase"
		>
			{typeLabel}
		</span>

		{#if rating > 0}
			<span
				class="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded border border-border bg-surface/90 px-1.5 py-0.5 text-[10px] font-bold text-accent"
			>
				★ {rating}
			</span>
		{/if}
	</div>

	<div class="bg-surface px-2 py-1.5">
		<p class="line-clamp-1 text-xs leading-tight font-semibold text-text">{title}</p>
		{#if year}
			<p class="mt-0.5 text-[10px] text-muted">{year}</p>
		{/if}
	</div>
</a>
