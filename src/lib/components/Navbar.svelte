<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import { Menu, X, Film, Tv, List, LogOut, Clapperboard, Search } from 'lucide-svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import NavSearch from '$lib/components/NavSearch.svelte';

	let isMobileMenuOpen = $state(false);
	let searchQuery = $state('');

	const username = $derived(auth.user?.user_metadata?.username ?? null);
	// Storage path is fixed (upsert), so cache-bust with the user's updated_at
	// to refresh the photo immediately after an upload.
	const avatarUrl = $derived(
		auth.user?.user_metadata?.avatar_url
			? `${auth.user.user_metadata.avatar_url}?t=${encodeURIComponent(auth.user.updated_at ?? '')}`
			: null
	);

	function toggleMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	let searchDebounce: ReturnType<typeof setTimeout>;

	// Debounced live navigation (matches the /search page: 400ms, min 2 chars).
	// replaceState avoids stacking a history entry per keystroke; the /search
	// page takes over with its own live search + "show more" once we land there.
	function handleSearchInput(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		clearTimeout(searchDebounce);
		if (value.trim().length >= 2) {
			searchDebounce = setTimeout(() => {
				goto(`/search?q=${encodeURIComponent(value.trim())}`, { replaceState: true });
			}, 400);
		}
	}

	function handleSearchSubmit(e: Event) {
		e.preventDefault();
		clearTimeout(searchDebounce);
		if (searchQuery.trim().length >= 1) {
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}
</script>

<nav class="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between gap-4">
			<!-- Logo -->
			<a href="/" class="group flex shrink-0 items-center gap-2">
				<Clapperboard
					class="h-7 w-7 text-indigo-500 transition-colors group-hover:text-indigo-400"
				/>
				<span class="hidden text-lg font-bold tracking-tight text-text sm:block">MyNextWatch</span>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex md:items-center md:gap-6">
				<a
					href="/movies"
					class="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-text"
				>
					<Film class="h-4 w-4" /> Films
				</a>
				<a
					href="/tv"
					class="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-text"
				>
					<Tv class="h-4 w-4" /> Séries
				</a>
				{#if auth.session}
					<a
						href="/watchlist"
						class="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-text"
					>
						<List class="h-4 w-4" /> Ma Watchlist
					</a>
				{/if}
			</div>

			<!-- Search bar desktop (with quick-results dropdown) -->
			<div class="hidden max-w-xs flex-1 items-center md:flex">
				<NavSearch
					placeholder="Rechercher..."
					inputClass="w-full rounded-md border border-border bg-surface py-1.5 pr-9 pl-9 text-sm text-text placeholder-muted transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
				/>
			</div>

			<!-- Desktop Auth + Mobile controls -->
			<div class="flex shrink-0 items-center gap-3">
				<!-- Mobile search icon -->
				<a href="/search" class="text-muted transition-colors hover:text-text md:hidden">
					<Search class="h-5 w-5" />
				</a>

				{#if auth.session}
					<a
						href="/profile"
						class="hidden items-center gap-2 text-muted transition-colors hover:text-text md:flex"
					>
						<Avatar src={avatarUrl} name={username} class="h-7 w-7 text-xs" />
						<span class="text-sm font-medium">{username ?? 'Profil'}</span>
					</a>
					<form action="/auth/logout" method="POST" class="hidden md:block">
						<button
							type="submit"
							class="flex items-center gap-1.5 rounded-md border border-red-500/20 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
						>
							<LogOut class="h-4 w-4" />
							Déconnexion
						</button>
					</form>
				{:else}
					<a
						href="/auth"
						class="hidden rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 md:block"
					>
						Se connecter
					</a>
				{/if}

				<!-- Mobile menu button -->
				<button
					onclick={toggleMenu}
					aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
					aria-expanded={isMobileMenuOpen}
					class="text-muted hover:text-text focus:outline-none md:hidden"
				>
					{#if isMobileMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if isMobileMenuOpen}
		<div class="border-b border-border bg-surface md:hidden">
			<!-- Mobile search -->
			<div class="px-4 pt-3 pb-2">
				<form onsubmit={handleSearchSubmit}>
					<div class="relative">
						<Search
							class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
						/>
						<input
							name="q"
							type="search"
							placeholder="Rechercher un film ou une série..."
							bind:value={searchQuery}
							oninput={handleSearchInput}
							class="w-full rounded-md border border-border bg-bg py-2 pr-3 pl-9 text-sm text-text placeholder-muted focus:ring-1 focus:ring-indigo-500 focus:outline-none"
						/>
					</div>
				</form>
			</div>

			<div class="space-y-1 px-2 pb-3">
				<a
					href="/movies"
					class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-border hover:text-text"
					onclick={toggleMenu}
				>
					<Film class="h-4 w-4" /> Films
				</a>
				<a
					href="/tv"
					class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-border hover:text-text"
					onclick={toggleMenu}
				>
					<Tv class="h-4 w-4" /> Séries
				</a>
				{#if auth.session}
					<a
						href="/watchlist"
						class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-border hover:text-text"
						onclick={toggleMenu}
					>
						<List class="h-4 w-4" /> Ma Watchlist
					</a>
				{/if}
			</div>

			<div class="border-t border-border px-4 py-3">
				{#if auth.session}
					<div class="mb-3 flex items-center gap-3">
						<Avatar src={avatarUrl} name={username} class="h-10 w-10 shrink-0 text-sm" />
						<div>
							<div class="text-sm font-medium text-text">
								{username ?? 'Utilisateur'}
							</div>
							<div class="text-xs text-muted">{auth.user?.email}</div>
						</div>
					</div>
					<div class="flex gap-2">
						<a
							href="/profile"
							class="flex-1 rounded-md px-3 py-2 text-center text-sm font-medium text-muted transition-colors hover:bg-border hover:text-text"
							onclick={toggleMenu}
						>
							Mon Profil
						</a>
						<form action="/auth/logout" method="POST" class="flex-1">
							<button
								type="submit"
								class="flex w-full items-center justify-center gap-1.5 rounded-md border border-red-500/20 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
							>
								<LogOut class="h-4 w-4" /> Déconnexion
							</button>
						</form>
					</div>
				{:else}
					<a
						href="/auth"
						class="block w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-500"
						onclick={toggleMenu}
					>
						Se connecter / S'inscrire
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
