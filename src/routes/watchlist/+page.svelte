<script lang="ts">
	import { navigating } from '$app/stores';
	import { enhance } from '$app/forms';
	import { watchlist } from '$lib/stores/watchlist.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { getTitle, getYear, getPosterUrl } from '$lib/utils/media';
	import { STATUS_LABELS, STATUS_OPTIONS, type WatchlistStatus } from '$lib/types/watchlist';
	import type { WatchlistEntryWithMedia } from './+page.server';

	let { data } = $props();

	const tabs: { value: WatchlistStatus; label: string }[] = [
		{ value: 'watching', label: 'En cours' },
		{ value: 'completed', label: 'Vu' },
		{ value: 'plan_to_watch', label: 'À voir' },
		{ value: 'on_hold', label: 'En pause' },
		{ value: 'dropped', label: 'Abandonné' }
	];

	let activeTab = $state<WatchlistStatus>('watching');

	const filteredEntries = $derived(
		data.entries.filter((e: WatchlistEntryWithMedia) => e.status === activeTab)
	);

	function handleTabKey(e: KeyboardEvent, tab: { value: WatchlistStatus }) {
		const idx = tabs.findIndex((t) => t.value === tab.value);
		if (e.key === 'ArrowRight') {
			activeTab = tabs[(idx + 1) % tabs.length].value;
		} else if (e.key === 'ArrowLeft') {
			activeTab = tabs[(idx - 1 + tabs.length) % tabs.length].value;
		}
	}
</script>

<svelte:head>
	<title>Ma Watchlist — MyNextWatch</title>
</svelte:head>

{#if $navigating}
	<div class="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
		<div class="h-10 bg-surface rounded w-48 mb-8"></div>
		<div class="flex gap-2 mb-8">
			{#each { length: 5 } as _}
				<div class="h-9 bg-surface rounded-full w-24"></div>
			{/each}
		</div>
		{#each { length: 4 } as _}
			<div class="flex gap-4 mb-4 bg-surface rounded-lg p-4">
				<div class="w-14 h-20 bg-border rounded shrink-0"></div>
				<div class="flex-1 space-y-2 py-1">
					<div class="h-4 bg-border rounded w-1/2"></div>
					<div class="h-3 bg-border rounded w-1/4"></div>
					<div class="h-3 bg-border rounded w-1/3"></div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
		<h1 class="font-display text-4xl sm:text-5xl text-text mb-8">Ma Watchlist</h1>

		<!-- Tabs -->
		<div class="flex flex-wrap gap-2 mb-8" role="tablist">
			{#each tabs as tab (tab.value)}
				<button
					onclick={() => (activeTab = tab.value)}
					onkeydown={(e) => handleTabKey(e, tab)}
					role="tab"
					aria-selected={activeTab === tab.value}
					class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors {activeTab === tab.value
						? 'bg-accent text-bg'
						: 'bg-surface border border-border text-muted hover:text-text hover:border-accent'}"
				>
					{tab.label}
					<span
						class="text-xs px-1.5 py-0.5 rounded-full {activeTab === tab.value
							? 'bg-bg/20 text-bg'
							: 'bg-border text-muted'}"
					>
						{watchlist.counts[tab.value]}
					</span>
				</button>
			{/each}
		</div>

		<!-- Entry list -->
		{#if filteredEntries.length === 0}
			<div class="flex flex-col items-center justify-center py-24 text-center">
				<svg
					class="h-16 w-16 text-muted mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1"
						d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
					/>
				</svg>
				<p class="text-muted text-lg">Aucune entrée dans cette liste</p>
				<p class="text-muted text-sm mt-1">
					Ajoutez des films ou séries depuis leur page de détail.
				</p>
			</div>
		{:else}
			<ul class="space-y-3">
				{#each filteredEntries as entry (entry.id)}
					{@const poster = entry.media
						? getPosterUrl(entry.media, 'w185')
						: entry.poster_path
							? `https://image.tmdb.org/t/p/w185${entry.poster_path}`
							: null}
					{@const mediaTitle = entry.media ? getTitle(entry.media) : entry.title}
					{@const year = entry.media ? getYear(entry.media) : null}
					<li class="flex gap-4 bg-surface border border-border rounded-lg p-3 sm:p-4">
						<!-- Poster -->
						<a href="/{entry.media_type}/{entry.tmdb_id}" class="shrink-0">
							{#if poster}
								<img
									src={poster}
									alt={mediaTitle}
									class="w-12 sm:w-14 aspect-2/3 object-cover rounded"
								/>
							{:else}
								<div
									class="w-12 sm:w-14 aspect-2/3 bg-border rounded flex items-center justify-center"
								>
									<svg
										class="h-5 w-5 text-muted"
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
						</a>

						<!-- Info + controls -->
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between gap-2">
								<div class="min-w-0">
									<a
										href="/{entry.media_type}/{entry.tmdb_id}"
										class="font-semibold text-text text-sm sm:text-base leading-tight hover:text-accent transition-colors line-clamp-2"
									>
										{mediaTitle}
									</a>
									<p class="text-muted text-xs mt-0.5">
										{year ?? ''}
										<span
											class="ml-1 border border-border rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide"
										>
											{entry.media_type === 'movie' ? 'Film' : 'Série'}
										</span>
									</p>
								</div>

								<!-- Remove -->
								<form
									method="POST"
									action="?/remove"
									use:enhance={() => {
										watchlist.remove(entry.id);
										return async ({ result, update }) => {
											if (result.type === 'failure') {
												watchlist.add(entry);
												toast.add('Erreur lors de la suppression', 'error');
											} else {
												toast.add('Retiré de la watchlist');
											}
											await update({ reset: false });
										};
									}}
								>
									<input type="hidden" name="id" value={entry.id} />
									<button
										type="submit"
										aria-label="Retirer {mediaTitle} de la watchlist"
										class="text-muted hover:text-red-400 transition-colors p-1 shrink-0"
									>
										<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</form>
							</div>

							<!-- Status + Rating row -->
							<div class="flex flex-wrap items-center gap-3 mt-2">
								<!-- Status selector -->
								<form
									method="POST"
									action="?/updateStatus"
									use:enhance={({ formData }) => {
										const newStatus = formData.get('status') as WatchlistStatus;
										watchlist.updateStatus(entry.id, newStatus);
										return async ({ result, update }) => {
											if (result.type === 'failure') {
												watchlist.updateStatus(entry.id, entry.status);
											} else {
												toast.add('Statut mis à jour');
											}
											await update({ reset: false });
										};
									}}
								>
									<input type="hidden" name="id" value={entry.id} />
									<select
										name="status"
										aria-label="Statut de {mediaTitle}"
										onchange={(e) => (e.currentTarget as HTMLSelectElement).form?.requestSubmit()}
										class="text-[16px] sm:text-xs bg-bg border border-border rounded px-2 py-1.5 text-text focus:outline-none focus:border-accent cursor-pointer"
									>
										{#each STATUS_OPTIONS as opt (opt.value)}
											<option value={opt.value} selected={entry.status === opt.value}>
												{opt.label}
											</option>
										{/each}
									</select>
								</form>

								<!-- Rating input -->
								<form
									method="POST"
									action="?/updateRating"
									use:enhance={({ formData }) => {
										const raw = formData.get('rating');
										const newRating = raw ? Number(raw) : null;
										watchlist.updateRating(entry.id, newRating);
										return async ({ result, update }) => {
											if (result.type === 'failure') {
												watchlist.updateRating(entry.id, entry.rating);
											} else {
												toast.add('Note mise à jour');
											}
											await update({ reset: false });
										};
									}}
								>
									<input type="hidden" name="id" value={entry.id} />
									<div class="flex items-center gap-1">
										<span class="text-accent text-xs">★</span>
										<input
											type="number"
											name="rating"
											min="1"
											max="10"
											placeholder="—"
											aria-label="Note sur 10 pour {mediaTitle}"
											value={entry.rating ?? ''}
											onblur={(e) => {
												const val = (e.currentTarget as HTMLInputElement).value;
												const next = val ? Number(val) : null;
												if (next !== entry.rating) {
													(e.currentTarget as HTMLInputElement).form?.requestSubmit();
												}
											}}
											class="w-12 text-[16px] sm:text-xs bg-bg border border-border rounded px-2 py-1.5 text-text focus:outline-none focus:border-accent text-center"
										/>
										<span class="text-muted text-xs">/10</span>
									</div>
								</form>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}
