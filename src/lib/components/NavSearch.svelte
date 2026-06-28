<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { Search } from 'lucide-svelte';
	import { getTitle, getYear, getHref, getPosterUrl, getTypeLabel } from '$lib/utils/media';
	import type { MediaItem } from '$lib/types/tmdb';

	let {
		placeholder = 'Rechercher...',
		inputClass = ''
	}: { placeholder?: string; inputClass?: string } = $props();

	const MAX_RESULTS = 6;

	let query = $state('');
	let results = $state<MediaItem[]>([]);
	let open = $state(false);
	let loading = $state(false);
	let activeIndex = $state(-1); // keyboard-highlighted result, -1 = none

	let debounceTimer: ReturnType<typeof setTimeout>;
	let controller: AbortController | undefined;

	const trimmed = $derived(query.trim());

	async function fetchResults(q: string) {
		// Abort the previous request so a slow response can't overwrite newer one.
		controller?.abort();
		controller = new AbortController();
		loading = true;
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=1`, {
				signal: controller.signal
			});
			const data: { items: MediaItem[] } = await res.json();
			results = data.items.slice(0, MAX_RESULTS);
			activeIndex = -1;
			open = true;
		} catch (err) {
			if ((err as Error).name !== 'AbortError') console.error('Quick search failed:', err);
		} finally {
			loading = false;
		}
	}

	function handleInput() {
		clearTimeout(debounceTimer);
		if (trimmed.length >= 2) {
			debounceTimer = setTimeout(() => fetchResults(trimmed), 300);
		} else {
			results = [];
			open = false;
		}
	}

	function goToSearchPage() {
		clearTimeout(debounceTimer);
		if (trimmed.length >= 1) {
			open = false;
			goto(`/search?q=${encodeURIComponent(trimmed)}`);
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		// Enter on a highlighted result opens it; otherwise go to the full page.
		const picked = activeIndex >= 0 ? results[activeIndex] : undefined;
		if (picked) {
			open = false;
			goto(getHref(picked));
		} else {
			goToSearchPage();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false;
			return;
		}
		if (!open || results.length === 0) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % results.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = (activeIndex - 1 + results.length) % results.length;
		}
	}

	// Close + reset after navigating to a result or the search page.
	afterNavigate(() => {
		open = false;
		activeIndex = -1;
	});

	// Close the dropdown when clicking anywhere outside the search box.
	function clickOutside(onClose: () => void) {
		return (node: HTMLElement) => {
			function handle(event: MouseEvent) {
				if (!node.contains(event.target as Node)) onClose();
			}
			document.addEventListener('click', handle, true);
			return () => document.removeEventListener('click', handle, true);
		};
	}
</script>

<div class="relative w-full" {@attach clickOutside(() => (open = false))}>
	<form onsubmit={handleSubmit}>
		<div class="relative">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
			/>
			<input
				name="q"
				type="search"
				autocomplete="off"
				{placeholder}
				bind:value={query}
				oninput={handleInput}
				onkeydown={handleKeydown}
				onfocus={() => {
					if (results.length) open = true;
				}}
				role="combobox"
				aria-expanded={open}
				aria-controls="nav-search-results"
				class={inputClass}
			/>
			{#if loading}
				<span
					class="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted/40 border-t-primary-hover"
					aria-label="Recherche en cours"
				></span>
			{/if}
		</div>
	</form>

	{#if open && results.length > 0}
		<ul
			id="nav-search-results"
			role="listbox"
			class="absolute top-full left-0 z-50 mt-2 max-h-96 w-full overflow-auto rounded-md border border-border bg-surface py-1 shadow-xl"
		>
			{#each results as item, i (item.id)}
				{@const poster = getPosterUrl(item, 'w185')}
				<li role="option" aria-selected={i === activeIndex}>
					<a
						href={getHref(item)}
						onmouseenter={() => (activeIndex = i)}
						class="flex items-center gap-3 px-3 py-2 transition-colors {i === activeIndex
							? 'bg-border'
							: ''}"
					>
						{#if poster}
							<img src={poster} alt="" class="h-12 w-8 shrink-0 rounded object-cover" />
						{:else}
							<div class="h-12 w-8 shrink-0 rounded bg-border"></div>
						{/if}
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium text-text">{getTitle(item)}</p>
							<p class="text-xs text-muted">
								{getTypeLabel(item)}{getYear(item) ? ` · ${getYear(item)}` : ''}
							</p>
						</div>
					</a>
				</li>
			{/each}
			<li class="border-t border-border">
				<a
					href="/search?q={encodeURIComponent(trimmed)}"
					class="block px-3 py-2 text-center text-sm font-medium text-primary-bright transition-colors hover:bg-border"
				>
					Voir tous les résultats pour « {trimmed} »
				</a>
			</li>
		</ul>
	{/if}
</div>
