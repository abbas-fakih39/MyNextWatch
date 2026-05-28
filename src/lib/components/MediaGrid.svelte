<script lang="ts">
	import MediaCard from './MediaCard.svelte';
	import type { MediaItem } from '$lib/types/tmdb';

	let {
		title,
		items,
		viewAllHref,
		limit = 18,
		carousel = false
	}: {
		title: string;
		items: MediaItem[];
		viewAllHref?: string;
		limit?: number;
		carousel?: boolean;
	} = $props();

	let scrollEl = $state<HTMLDivElement | null>(null);

	function scroll(dir: 'left' | 'right') {
		if (!scrollEl) return;
		scrollEl.scrollBy({
			left: dir === 'right' ? scrollEl.clientWidth * 0.75 : -(scrollEl.clientWidth * 0.75),
			behavior: 'smooth'
		});
	}
</script>

<section class="mx-auto max-w-400 py-6">
	<div class="mb-4 flex items-center justify-between px-4 sm:px-6 lg:px-8">
		<h2 class="text-xl font-bold tracking-tight text-text sm:text-2xl">{title}</h2>
		{#if viewAllHref}
			<a href={viewAllHref} class="voir-tout-btn">
				Voir tout
				<svg
					class="h-3.5 w-3.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		{/if}
	</div>

	{#if carousel}
		<div class="carousel-wrap">
			<button onclick={() => scroll('left')} class="arrow-btn arrow-left" aria-label="Précédent">
				<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<div bind:this={scrollEl} class="carousel-row">
				{#each items.slice(0, limit) as item (item.id)}
					<div class="carousel-card">
						<MediaCard {item} />
					</div>
				{/each}
			</div>

			<button onclick={() => scroll('right')} class="arrow-btn arrow-right" aria-label="Suivant">
				<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	{:else}
		<div
			class="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:px-8 xl:grid-cols-6"
		>
			{#each items.slice(0, limit) as item (item.id)}
				<MediaCard {item} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.voir-tout-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-muted);
		border: 1px solid var(--color-border);
		padding: 0.3rem 0.75rem;
		border-radius: 9999px;
		transition:
			color 0.15s,
			border-color 0.15s;
		letter-spacing: 0.02em;
	}
	.voir-tout-btn:hover {
		color: var(--color-text);
		border-color: var(--color-accent);
	}

	.carousel-wrap {
		position: relative;
	}

	.carousel-row {
		display: flex;
		gap: 0.75rem;
		overflow-x: auto;
		scroll-behavior: smooth;
		padding: 0 1rem 0.75rem;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
	}
	@media (min-width: 640px) {
		.carousel-row {
			padding-inline: 1.5rem;
		}
	}
	@media (min-width: 1024px) {
		.carousel-row {
			padding-inline: 2rem;
		}
	}
	.carousel-row::-webkit-scrollbar {
		display: none;
	}

	.carousel-card {
		flex: none;
		width: 140px;
		scroll-snap-align: start;
	}
	@media (min-width: 640px) {
		.carousel-card {
			width: 155px;
		}
	}
	@media (min-width: 768px) {
		.carousel-card {
			width: 170px;
		}
	}

	.arrow-btn {
		display: none;
		position: absolute;
		top: 50%;
		transform: translateY(calc(-50% - 0.375rem));
		z-index: 10;
		width: 2.25rem;
		height: 4rem;
		align-items: center;
		justify-content: center;
		color: var(--color-text);
		background: linear-gradient(to right, var(--color-bg) 60%, transparent);
		border: none;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.2s;
	}
	.arrow-btn svg {
		width: 1.25rem;
		height: 1.25rem;
	}
	.arrow-left {
		left: 0;
		background: linear-gradient(to right, var(--color-bg) 60%, transparent);
	}
	.arrow-right {
		right: 0;
		background: linear-gradient(to left, var(--color-bg) 60%, transparent);
	}
	@media (min-width: 640px) {
		.arrow-btn {
			display: flex;
		}
		.carousel-wrap:hover .arrow-btn {
			opacity: 1;
		}
	}
</style>
