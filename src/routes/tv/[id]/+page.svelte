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

	const currentEntry = $derived(watchlist.getEntry(data.detail.id, 'tv'));

	function handleWatchlistClick() {
		if (!auth.user) {
			goto('/auth');
			return;
		}
		watchlistOpen = !watchlistOpen;
	}

	const backdropUrl = $derived(getBackdropUrl(data.detail, 'original'));
	const posterUrl = $derived(getPosterUrl(data.detail, 'w500'));
	const title = $derived(getTitle(data.detail));
	const year = $derived(getYear(data.detail));
	const rating = $derived(getRating(data.detail));
	const episodeRuntime = $derived(
		data.detail.episode_run_time.length > 0
			? `~${data.detail.episode_run_time[0]} min / épisode`
			: null
	);
	const topCast = $derived(data.credits.cast.slice(0, 8));
	const similarItems = $derived(data.similar as MediaItem[]);
</script>

<svelte:head>
	<title>{title} — MyNextWatch</title>
	<meta name="description" content={data.detail.overview} />
</svelte:head>

{#if $navigating}
	<div class="min-h-screen bg-bg animate-pulse">
		<div class="h-[55vh] bg-surface"></div>
		<div class="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10 pb-16">
			<div class="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
				<div class="w-36 sm:w-48 shrink-0 aspect-2/3 rounded-md bg-border"></div>
				<div class="flex-1 pt-2 sm:pt-24 space-y-4">
					<div class="h-10 bg-border rounded w-2/3"></div>
					<div class="h-4 bg-border rounded w-1/4"></div>
					<div class="h-4 bg-border rounded w-full"></div>
					<div class="h-4 bg-border rounded w-5/6"></div>
					<div class="h-4 bg-border rounded w-4/5"></div>
				</div>
			</div>
			<div class="mt-12">
				<div class="h-8 bg-border rounded w-32 mb-5"></div>
				<div class="flex gap-4">
					{#each { length: 5 } as _}
						<div class="shrink-0 w-24">
							<div class="w-20 h-20 rounded-md bg-border mx-auto mb-2"></div>
							<div class="h-3 bg-border rounded w-3/4 mx-auto"></div>
						</div>
					{/each}
				</div>
			</div>
			<div class="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
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
					class="absolute inset-0 h-full w-full object-cover object-top"
				/>
			{/if}
			<div class="absolute inset-0 bg-linear-to-t from-bg via-bg/50 to-transparent"></div>
			<div class="absolute inset-0 bg-linear-to-r from-bg/60 to-transparent"></div>
		</div>

		<div class="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
			<div class="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
				<div class="w-36 sm:w-48 shrink-0">
					{#if posterUrl}
						<img
							src={posterUrl}
							alt={title}
							class="w-full rounded-md shadow-2xl aspect-2/3 object-cover"
						/>
					{:else}
						<div
							class="w-full rounded-md bg-surface border border-border aspect-2/3 flex items-center justify-center"
						>
							<svg class="h-10 w-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
					{/if}
				</div>

				<div class="flex-1 pt-2 sm:pt-24">
					<span
						class="inline-block text-xs font-semibold uppercase tracking-wider text-muted border border-border rounded px-2 py-0.5 bg-surface/80 mb-3"
					>
						Série
					</span>

					<h1
						class="font-display text-4xl sm:text-5xl md:text-6xl text-text leading-tight tracking-tight mb-2"
					>
						{title}
					</h1>

					<div class="flex flex-wrap items-center gap-3 text-sm text-muted mb-4">
						{#if year}<span>{year}</span>{/if}
						{#if episodeRuntime}<span>·</span><span>{episodeRuntime}</span>{/if}
						{#if rating > 0}
							<span class="flex items-center gap-1 text-accent font-semibold">★ {rating}</span>
						{/if}
						{#if data.detail.status}
							<span class="border border-border rounded px-2 py-0.5 text-xs bg-surface">
								{data.detail.status}
							</span>
						{/if}
					</div>

					<div class="flex flex-wrap gap-4 text-sm text-muted mb-4">
						<span>
							<span class="text-text font-semibold">{data.detail.number_of_seasons}</span>
							saison{data.detail.number_of_seasons > 1 ? 's' : ''}
						</span>
						<span>
							<span class="text-text font-semibold">{data.detail.number_of_episodes}</span>
							épisode{data.detail.number_of_episodes > 1 ? 's' : ''}
						</span>
						{#if data.detail.in_production}
							<span class="text-accent font-medium">En cours de diffusion</span>
						{/if}
					</div>

					{#if data.detail.genres.length > 0}
						<div class="flex flex-wrap gap-2 mb-4">
							{#each data.detail.genres as genre (genre.id)}
								<span
									class="bg-surface border border-border text-muted text-xs font-medium px-2.5 py-1 rounded-md"
								>
									{genre.name}
								</span>
							{/each}
						</div>
					{/if}

					{#if data.detail.tagline}
						<p class="text-muted italic text-sm mb-3">"{data.detail.tagline}"</p>
					{/if}

					{#if data.detail.overview}
						<p class="text-text/80 text-base leading-relaxed max-w-2xl mb-6">
							{data.detail.overview}
						</p>
					{/if}

					<!-- Watchlist button -->
					<div class="relative inline-block">
						<button
							onclick={handleWatchlistClick}
							class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm transition-colors border {currentEntry
								? 'bg-accent text-bg border-accent'
								: 'bg-surface border-border text-text hover:border-accent hover:text-accent'}"
						>
							{currentEntry ? STATUS_LABELS[currentEntry.status] : '+ Ajouter à ma watchlist'}
						</button>

						{#if watchlistOpen && auth.user}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="absolute top-full left-0 mt-1 z-20 bg-surface border border-border rounded-md shadow-xl min-w-48 overflow-hidden"
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
												class="w-full text-left px-4 py-2.5 text-sm hover:bg-border transition-colors {currentEntry.status === option.value ? 'text-accent' : 'text-text'}"
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
												class="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-border transition-colors"
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
													media_type: 'tv',
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
												class="w-full text-left px-4 py-2.5 text-sm hover:bg-border transition-colors text-text"
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
					<h2 class="font-display text-3xl text-text mb-5">Casting</h2>
					<div class="flex gap-4 overflow-x-auto pb-2">
						{#each topCast as actor (actor.id)}
							<div class="shrink-0 w-24 text-center">
								{#if actor.profile_path}
									<img
										src="https://image.tmdb.org/t/p/w185{actor.profile_path}"
										alt={actor.name}
										class="w-20 h-20 rounded-md object-cover mx-auto mb-2 bg-surface"
									/>
								{:else}
									<div
										class="w-20 h-20 rounded-md bg-surface border border-border mx-auto mb-2 flex items-center justify-center text-muted"
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
								<p class="text-text text-xs font-semibold leading-tight line-clamp-2">
									{actor.name}
								</p>
								<p class="text-muted text-[10px] mt-0.5 line-clamp-1">{actor.character}</p>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			{#if similarItems.length > 0}
				<div class="-mx-4 sm:-mx-6 lg:-mx-8 mt-4">
					<MediaGrid title="Séries similaires" items={similarItems} limit={12} />
				</div>
			{/if}
		</div>
	</div>
{/if}
