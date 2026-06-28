<script lang="ts">
	import type { MediaItem } from '$lib/types/tmdb';
	import { getTitle, getYear, getHref, getBackdropUrl, truncate } from '$lib/utils/media';
	import { Flame } from 'lucide-svelte';

	let { item }: { item: MediaItem } = $props();

	let title = $derived(getTitle(item));
	let year = $derived(getYear(item));
	let backdropUrl = $derived(getBackdropUrl(item));
	let href = $derived(getHref(item));
	let overview = $derived(truncate(item.overview ?? '', 200));
	let exploreHref = $derived(item.media_type === 'movie' ? '/movies' : '/tv');
</script>

<div class="relative flex min-h-[70vh] items-end overflow-hidden bg-bg">
	{#if backdropUrl}
		<img
			src={backdropUrl}
			alt={title}
			class="absolute inset-0 h-full w-full object-cover object-center"
		/>
	{/if}

	<div class="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-transparent"></div>
	<div class="absolute inset-0 bg-linear-to-r from-bg/80 via-bg/30 to-transparent"></div>

	<div class="relative z-10 mx-auto w-full max-w-400 px-6 pt-32 pb-16 sm:px-10">
		<div class="max-w-2xl">
			<span
				class="mb-4 inline-flex items-center gap-1.5 rounded border border-primary-hover/40 bg-primary/20 px-3 py-1 text-xs font-semibold tracking-wider text-primary-bright uppercase"
			>
				<Flame class="h-3.5 w-3.5" /> Tendance du jour
			</span>

			<h1
				class="mb-3 font-display text-5xl leading-tight tracking-tight text-text drop-shadow-lg sm:text-6xl md:text-7xl"
			>
				{title}
			</h1>

			{#if year}
				<p class="mb-3 text-sm text-muted">{year}</p>
			{/if}

			{#if overview}
				<p class="mb-8 max-w-xl text-base leading-relaxed text-text/80 sm:text-lg">
					{overview}
				</p>
			{/if}

			<div class="flex flex-wrap gap-3">
				<a
					{href}
					class="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-primary-hover"
				>
					<svg
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Voir les détails
				</a>

				<a
					href={exploreHref}
					class="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
				>
					Explorer plus
				</a>
			</div>
		</div>
	</div>
</div>
