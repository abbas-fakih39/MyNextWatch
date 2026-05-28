<script lang="ts">
	import { navigating } from '$app/stores';
	import { enhance } from '$app/forms';
	import { watchlist } from '$lib/stores/watchlist.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { getTitle, getYear, getPosterUrl } from '$lib/utils/media';
	import { STATUS_OPTIONS, type WatchlistStatus } from '$lib/types/watchlist';
	import type { WatchlistEntryWithMedia } from './+page.server';

	let { data } = $props();

	type TabValue = WatchlistStatus | 'all';

	const tabs: { value: TabValue; label: string }[] = [
		{ value: 'all', label: 'Tout' },
		{ value: 'watching', label: 'En cours' },
		{ value: 'completed', label: 'Vu' },
		{ value: 'plan_to_watch', label: 'À voir' },
		{ value: 'on_hold', label: 'En pause' },
		{ value: 'dropped', label: 'Abandonné' }
	];

	let activeTab = $state<TabValue>('all');
	let searchQuery = $state('');

	const filteredEntries = $derived(
		data.entries.filter((e: WatchlistEntryWithMedia) => {
			const q = searchQuery.trim().toLowerCase();
			if (q) {
				const title = (e.media ? getTitle(e.media) : e.title).toLowerCase();
				return title.includes(q);
			}
			return activeTab === 'all' || e.status === activeTab;
		})
	);

	function tabCount(value: TabValue): number {
		if (value === 'all') return data.entries.length;
		return watchlist.counts[value as WatchlistStatus] ?? 0;
	}

	function handleTabKey(e: KeyboardEvent, tab: { value: TabValue }) {
		const idx = tabs.findIndex((t) => t.value === tab.value);
		if (e.key === 'ArrowRight') activeTab = tabs[(idx + 1) % tabs.length].value;
		else if (e.key === 'ArrowLeft') activeTab = tabs[(idx - 1 + tabs.length) % tabs.length].value;
	}
</script>

<svelte:head>
	<title>Ma Watchlist — MyNextWatch</title>
</svelte:head>

{#if $navigating}
	<div class="mx-auto max-w-400 animate-pulse px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8 h-10 w-48 rounded bg-surface"></div>
		<div class="mb-8 flex gap-2">
			{#each { length: 5 } as _}
				<div class="h-9 w-24 rounded-full bg-surface"></div>
			{/each}
		</div>
		{#each { length: 4 } as _}
			<div class="mb-4 flex gap-4 rounded-lg bg-surface p-4">
				<div class="h-20 w-14 shrink-0 rounded bg-border"></div>
				<div class="flex-1 space-y-2 py-1">
					<div class="h-4 w-1/2 rounded bg-border"></div>
					<div class="h-3 w-1/4 rounded bg-border"></div>
					<div class="h-3 w-1/3 rounded bg-border"></div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="mx-auto max-w-400 px-4 py-8 pb-16 sm:px-6 lg:px-8">
		<h1 class="mb-6 font-display text-4xl text-text sm:text-5xl">Ma Watchlist</h1>

		<!-- Search bar -->
		<div class="relative mb-6 w-full">
			<svg
				class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
				/>
			</svg>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Rechercher dans toute ma watchlist…"
				class="w-full rounded-lg border border-border bg-surface py-2.5 pr-10 pl-10 text-sm text-text transition-colors placeholder:text-muted focus:border-accent focus:outline-none"
			/>
			{#if searchQuery}
				<button
					onclick={() => (searchQuery = '')}
					class="absolute top-1/2 right-3 -translate-y-1/2 text-muted transition-colors hover:text-text"
					aria-label="Effacer la recherche"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>

		<!-- Tabs (masqués quand recherche active) -->
		{#if !searchQuery.trim()}
			<div class="mb-8 flex flex-wrap gap-2" role="tablist">
				{#each tabs as tab (tab.value)}
					<button
						onclick={() => (activeTab = tab.value)}
						onkeydown={(e) => handleTabKey(e, tab)}
						role="tab"
						aria-selected={activeTab === tab.value}
						class="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors {activeTab ===
						tab.value
							? 'bg-accent text-bg'
							: 'border border-border bg-surface text-muted hover:border-accent hover:text-text'}"
					>
						{tab.label}
						<span
							class="rounded-full px-1.5 py-0.5 text-xs {activeTab === tab.value
								? 'bg-bg/20 text-bg'
								: 'bg-border text-muted'}"
						>
							{tabCount(tab.value)}
						</span>
					</button>
				{/each}
			</div>
		{:else}
			<p class="mb-6 text-sm text-muted">
				{filteredEntries.length} résultat{filteredEntries.length !== 1 ? 's' : ''} pour
				<span class="font-medium text-text">"{searchQuery}"</span>
			</p>
		{/if}

		<!-- Entry list -->
		{#if filteredEntries.length === 0}
			<div class="flex flex-col items-center justify-center py-24 text-center">
				<svg
					class="mb-4 h-16 w-16 text-muted"
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
				{#if searchQuery.trim()}
					<p class="text-lg text-muted">Aucun résultat pour "{searchQuery}"</p>
					<p class="mt-1 text-sm text-muted">Essaie un autre titre.</p>
				{:else}
					<p class="text-lg text-muted">Aucune entrée dans cette liste</p>
					<p class="mt-1 text-sm text-muted">
						Ajoutez des films ou séries depuis leur page de détail.
					</p>
				{/if}
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
					<li class="flex gap-4 rounded-lg border border-border bg-surface p-3 sm:p-4">
						<!-- Poster -->
						<a href="/{entry.media_type}/{entry.tmdb_id}" class="shrink-0">
							{#if poster}
								<img
									src={poster}
									alt={mediaTitle}
									class="aspect-2/3 w-12 rounded object-cover sm:w-14"
								/>
							{:else}
								<div
									class="flex aspect-2/3 w-12 items-center justify-center rounded bg-border sm:w-14"
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
						<div class="min-w-0 flex-1">
							<div class="flex items-start justify-between gap-2">
								<div class="min-w-0">
									<a
										href="/{entry.media_type}/{entry.tmdb_id}"
										class="line-clamp-2 text-sm leading-tight font-semibold text-text transition-colors hover:text-accent sm:text-base"
									>
										{mediaTitle}
									</a>
									<p class="mt-0.5 text-xs text-muted">
										{year ?? ''}
										<span
											class="ml-1 rounded border border-border px-1.5 py-0.5 text-[10px] tracking-wide uppercase"
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
										class="shrink-0 p-1 text-muted transition-colors hover:text-red-400"
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
							<div class="mt-2 flex flex-wrap items-center gap-3">
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
										class="cursor-pointer rounded border border-border bg-bg px-2 py-1.5 text-[16px] text-text focus:border-accent focus:outline-none sm:text-xs"
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
										<span class="text-xs text-accent">★</span>
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
											class="w-12 rounded border border-border bg-bg px-2 py-1.5 text-center text-[16px] text-text focus:border-accent focus:outline-none sm:text-xs"
										/>
										<span class="text-xs text-muted">/10</span>
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
