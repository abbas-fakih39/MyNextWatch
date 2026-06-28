<script lang="ts">
	import { navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { auth } from '$lib/stores/auth.svelte';
	import { watchlist } from '$lib/stores/watchlist.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import MediaGrid from '$lib/components/MediaGrid.svelte';
	import MediaCardSkeleton from '$lib/components/MediaCardSkeleton.svelte';
	import { getTitle, getYear, getPosterUrl, getBackdropUrl, getRating } from '$lib/utils/media';
	import { STATUS_LABELS, STATUS_OPTIONS, type WatchlistEntry } from '$lib/types/watchlist';
	import type { MediaItem } from '$lib/types/tmdb';

	let { data } = $props();

	let watchlistOpen = $state(false);

	const currentEntry = $derived(watchlist.getEntry(data.detail.id, 'movie'));

	function handleWatchlistClick() {
		if (!auth.user) {
			goto('/auth');
			return;
		}
		watchlistOpen = !watchlistOpen;
	}

	// Close the status dropdown on a click outside the button + menu.
	function clickOutside(onClose: () => void) {
		return (node: HTMLElement) => {
			function handle(event: MouseEvent) {
				if (!node.contains(event.target as Node)) onClose();
			}
			document.addEventListener('click', handle, true);
			return () => document.removeEventListener('click', handle, true);
		};
	}

	const backdropUrl = $derived(getBackdropUrl(data.detail, 'w1280'));
	const posterUrl = $derived(getPosterUrl(data.detail, 'w500'));
	const title = $derived(getTitle(data.detail));
	const year = $derived(getYear(data.detail));
	const rating = $derived(getRating(data.detail));
	const runtime = $derived(
		data.detail.runtime
			? `${Math.floor(data.detail.runtime / 60)}h ${data.detail.runtime % 60}m`
			: null
	);
	const topCast = $derived(data.credits.cast.slice(0, 8));
	const similarItems = $derived(data.similar as MediaItem[]);
</script>

<svelte:head>
	<title>{title} — MyNextWatch</title>
	<meta name="description" content={data.detail.overview} />
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') watchlistOpen = false;
	}}
/>

{#if $navigating}
	<div class="min-h-screen animate-pulse bg-bg">
		<div class="h-[55vh] bg-surface"></div>
		<div class="relative z-10 mx-auto -mt-40 max-w-400 px-4 pb-16 sm:px-6 lg:px-8">
			<div class="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
				<div class="aspect-2/3 w-36 shrink-0 rounded-md bg-border sm:w-48"></div>
				<div class="flex-1 space-y-4 pt-2 sm:pt-24">
					<div class="h-10 w-2/3 rounded bg-border"></div>
					<div class="h-4 w-1/4 rounded bg-border"></div>
					<div class="h-4 w-full rounded bg-border"></div>
					<div class="h-4 w-5/6 rounded bg-border"></div>
					<div class="h-4 w-4/5 rounded bg-border"></div>
				</div>
			</div>
			<div class="mt-12">
				<div class="mb-5 h-8 w-32 rounded bg-border"></div>
				<div class="flex gap-4">
					{#each { length: 5 } as _}
						<div class="w-24 shrink-0">
							<div class="mx-auto mb-2 h-20 w-20 rounded-md bg-border"></div>
							<div class="mx-auto h-3 w-3/4 rounded bg-border"></div>
						</div>
					{/each}
				</div>
			</div>
			<div
				class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6"
			>
				{#each { length: 6 } as _}
					<MediaCardSkeleton />
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-bg pb-16">
		<div class="relative h-[55vh] overflow-hidden">
			{#if backdropUrl}
				<img
					src={backdropUrl}
					alt={title}
					fetchpriority="high"
					class="absolute inset-0 h-full w-full object-cover object-top"
				/>
			{/if}
			<div class="absolute inset-0 bg-linear-to-t from-bg via-bg/50 to-transparent"></div>
			<div class="absolute inset-0 bg-linear-to-r from-bg/60 to-transparent"></div>
		</div>

		<div class="relative z-10 mx-auto -mt-40 max-w-400 px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
				<div class="w-36 shrink-0 sm:w-48">
					{#if posterUrl}
						<img
							src={posterUrl}
							alt={title}
							class="aspect-2/3 w-full rounded-md object-cover shadow-2xl"
						/>
					{:else}
						<div
							class="flex aspect-2/3 w-full items-center justify-center rounded-md border border-border bg-surface"
						>
							<svg
								class="h-10 w-10 text-muted"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
								/>
							</svg>
						</div>
					{/if}
				</div>

				<div class="flex-1 pt-2 sm:pt-24">
					<span
						class="mb-3 inline-block rounded border border-border bg-surface/80 px-2 py-0.5 text-xs font-semibold tracking-wider text-muted uppercase"
					>
						Film
					</span>

					<h1
						class="mb-2 font-display text-4xl leading-tight tracking-tight text-text sm:text-5xl md:text-6xl"
					>
						{title}
					</h1>

					<div class="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted">
						{#if year}<span>{year}</span>{/if}
						{#if runtime}<span>·</span><span>{runtime}</span>{/if}
						{#if rating > 0}
							<span class="flex items-center gap-1 font-semibold text-accent">★ {rating}</span>
						{/if}
						{#if data.detail.status}
							<span class="rounded border border-border bg-surface px-2 py-0.5 text-xs">
								{data.detail.status}
							</span>
						{/if}
					</div>

					{#if data.detail.genres.length > 0}
						<div class="mb-4 flex flex-wrap gap-2">
							{#each data.detail.genres as genre (genre.id)}
								<span
									class="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted"
								>
									{genre.name}
								</span>
							{/each}
						</div>
					{/if}

					{#if data.detail.tagline}
						<p class="mb-3 text-sm text-muted italic">"{data.detail.tagline}"</p>
					{/if}

					{#if data.detail.overview}
						<p class="mb-6 max-w-2xl text-base leading-relaxed text-text/80">
							{data.detail.overview}
						</p>
					{/if}

					<!-- Watchlist button -->
					<div class="relative inline-block" {@attach clickOutside(() => (watchlistOpen = false))}>
						<button
							onclick={handleWatchlistClick}
							class="inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors {currentEntry
								? 'border-accent bg-accent text-bg'
								: 'border-border bg-surface text-text hover:border-accent hover:text-accent'}"
						>
							{currentEntry ? STATUS_LABELS[currentEntry.status] : '+ Ajouter à ma watchlist'}
						</button>

						{#if watchlistOpen && auth.user}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="absolute top-full left-0 z-20 mt-1 min-w-48 overflow-hidden rounded-md border border-border bg-surface shadow-xl"
								onmouseleave={() => (watchlistOpen = false)}
							>
								{#if currentEntry}
									<!-- Status options (update) -->
									{#each STATUS_OPTIONS as option (option.value)}
										<form
											method="POST"
											action="?/updateStatus"
											use:enhance={() => {
												watchlistOpen = false;
												if (currentEntry) {
													watchlist.updateStatus(currentEntry.id, option.value);
												}
												const snapId = currentEntry!.id;
												const snapStatus = currentEntry!.status;
												return async ({ result, update }) => {
													if (result.type === 'failure') {
														watchlist.updateStatus(snapId, snapStatus);
													} else if (result.type === 'success' && result.data?.entry) {
														watchlist.add(result.data.entry as WatchlistEntry);
														toast.add('Statut mis à jour');
													}
													await update({ reset: false });
												};
											}}
										>
											<input type="hidden" name="id" value={currentEntry.id} />
											<input type="hidden" name="status" value={option.value} />
											<button
												type="submit"
												class="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-border {currentEntry.status ===
												option.value
													? 'text-accent'
													: 'text-text'}"
											>
												{option.label}
											</button>
										</form>
									{/each}
									<div class="border-t border-border">
										<form
											method="POST"
											action="?/remove"
											use:enhance={() => {
												watchlistOpen = false;
												const snap = { ...currentEntry! };
												watchlist.remove(snap.id);
												return async ({ result, update }) => {
													if (result.type === 'failure') {
														watchlist.add(snap);
													} else {
														toast.add('Retiré de la watchlist');
													}
													await update({ reset: false });
												};
											}}
										>
											<input type="hidden" name="id" value={currentEntry.id} />
											<button
												type="submit"
												class="w-full px-4 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-border"
											>
												Retirer de la watchlist
											</button>
										</form>
									</div>
								{:else}
									<!-- Status options (add) -->
									{#each STATUS_OPTIONS as option (option.value)}
										<form
											method="POST"
											action="?/add"
											use:enhance={() => {
												watchlistOpen = false;
												const optimistic: WatchlistEntry = {
													id: crypto.randomUUID(),
													user_id: auth.user?.id ?? '',
													tmdb_id: data.detail.id,
													media_type: 'movie',
													title,
													poster_path: data.detail.poster_path,
													status: option.value,
													rating: null,
													added_at: new Date().toISOString()
												};
												watchlist.add(optimistic);
												return async ({ result, update }) => {
													if (result.type === 'success' && result.data?.entry) {
														watchlist.add(result.data.entry as WatchlistEntry);
														toast.add('Ajouté à la watchlist');
													} else if (result.type === 'failure') {
														watchlist.remove(optimistic.id);
														toast.add("Erreur lors de l'ajout", 'error');
													}
													await update({ reset: false });
												};
											}}
										>
											<input type="hidden" name="status" value={option.value} />
											<input type="hidden" name="title" value={title} />
											<input
												type="hidden"
												name="poster_path"
												value={data.detail.poster_path ?? ''}
											/>
											<button
												type="submit"
												class="w-full px-4 py-2.5 text-left text-sm text-text transition-colors hover:bg-border"
											>
												{option.label}
											</button>
										</form>
									{/each}
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>

			{#if topCast.length > 0}
				<section class="mt-12">
					<h2 class="mb-5 font-display text-3xl text-text">Casting</h2>
					<div class="flex gap-4 overflow-x-auto pb-2">
						{#each topCast as actor (actor.id)}
							<div class="w-24 shrink-0 text-center">
								{#if actor.profile_path}
									<img
										src="https://image.tmdb.org/t/p/w185{actor.profile_path}"
										alt={actor.name}
										loading="lazy"
										class="mx-auto mb-2 h-20 w-20 rounded-md bg-surface object-cover"
									/>
								{:else}
									<div
										class="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-md border border-border bg-surface text-muted"
									>
										<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="1.5"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
								{/if}
								<p class="line-clamp-2 text-xs leading-tight font-semibold text-text">
									{actor.name}
								</p>
								<p class="mt-0.5 line-clamp-1 text-[10px] text-muted">{actor.character}</p>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			{#if similarItems.length > 0}
				<div class="-mx-4 mt-4 sm:-mx-6 lg:-mx-8">
					<MediaGrid title="Films similaires" items={similarItems} limit={12} carousel={true} />
				</div>
			{/if}
		</div>
	</div>
{/if}
