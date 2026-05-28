<script lang="ts">
	import type { MediaItem } from '$lib/types/tmdb';
	import { getTitle, getYear, getHref, getBackdropUrl, truncate } from '$lib/utils/media';

	let { item }: { item: MediaItem } = $props();

	let title = $derived(getTitle(item));
	let year = $derived(getYear(item));
	let backdropUrl = $derived(getBackdropUrl(item));
	let href = $derived(getHref(item));
	let overview = $derived(truncate(item.overview ?? '', 200));
	let exploreHref = $derived(item.media_type === 'movie' ? '/movies' : '/tv');
</script>

<div class="relative min-h-[70vh] flex items-end overflow-hidden bg-bg">
	{#if backdropUrl}
		<img
			src={backdropUrl}
			alt={title}
			class="absolute inset-0 h-full w-full object-cover object-center"
		/>
	{/if}

	<div class="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-transparent"></div>
	<div class="absolute inset-0 bg-linear-to-r from-bg/80 via-bg/30 to-transparent"></div>

	<div class="relative z-10 max-w-400 mx-auto px-6 sm:px-10 pb-16 pt-32 w-full">
		<div class="max-w-2xl">
			<span
				class="inline-block bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold px-3 py-1 rounded uppercase tracking-wider mb-4"
			>
				🔥 Tendance du jour
			</span>

			<h1
				class="font-display text-5xl sm:text-6xl md:text-7xl text-text leading-tight tracking-tight drop-shadow-lg mb-3"
			>
				{title}
			</h1>

			{#if year}
				<p class="text-muted text-sm mb-3">{year}</p>
			{/if}

			{#if overview}
				<p class="text-text/80 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
					{overview}
				</p>
			{/if}

			<div class="flex gap-3 flex-wrap">
				<a
					{href}
					class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-md transition-all shadow-lg hover:scale-105"
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
					class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-md border border-white/20 transition-all hover:scale-105"
				>
					Explorer plus
				</a>
			</div>
		</div>
	</div>
</div>
