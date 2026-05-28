<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import { Menu, X, Film, Tv, List, User, LogOut, Clapperboard, Search } from 'lucide-svelte';

	let isMobileMenuOpen = $state(false);
	let searchQuery = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	function toggleMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function handleSearchInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		searchQuery = value;
		clearTimeout(debounceTimer);
		if (value.trim().length >= 2) {
			debounceTimer = setTimeout(() => {
				goto(`/search?q=${encodeURIComponent(value.trim())}`);
			}, 300);
		}
	}

	function handleSearchSubmit(e: Event) {
		e.preventDefault();
		clearTimeout(debounceTimer);
		if (searchQuery.trim().length >= 1) {
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}
</script>

<nav class="bg-bg/90 backdrop-blur-md sticky top-0 z-50 border-b border-border">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 gap-4">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 group shrink-0">
				<Clapperboard class="h-7 w-7 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
				<span class="text-lg font-bold text-text tracking-tight hidden sm:block">MyNextWatch</span>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex md:items-center md:gap-6">
				<a href="/movies" class="text-muted hover:text-text transition-colors text-sm font-medium flex items-center gap-1.5">
					<Film class="h-4 w-4" /> Films
				</a>
				<a href="/tv" class="text-muted hover:text-text transition-colors text-sm font-medium flex items-center gap-1.5">
					<Tv class="h-4 w-4" /> Séries
				</a>
				{#if auth.session}
					<a href="/watchlist" class="text-muted hover:text-text transition-colors text-sm font-medium flex items-center gap-1.5">
						<List class="h-4 w-4" /> Ma Watchlist
					</a>
				{/if}
			</div>

			<!-- Search bar desktop -->
			<form onsubmit={handleSearchSubmit} class="hidden md:flex items-center flex-1 max-w-xs">
				<div class="relative w-full">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
					<input
						name="q"
						type="search"
						placeholder="Rechercher..."
						value={searchQuery}
						oninput={handleSearchInput}
						class="w-full bg-surface border border-border text-text placeholder-muted rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
					/>
				</div>
			</form>

			<!-- Desktop Auth + Mobile controls -->
			<div class="flex items-center gap-3 shrink-0">
				<!-- Mobile search icon -->
				<a href="/search" class="md:hidden text-muted hover:text-text transition-colors">
					<Search class="h-5 w-5" />
				</a>

				{#if auth.session}
					<a href="/profile" class="hidden md:flex items-center gap-2 text-muted hover:text-text transition-colors">
						<User class="h-5 w-5" />
						<span class="text-sm font-medium">{auth.user?.user_metadata?.username ?? 'Profil'}</span>
					</a>
					<form action="/auth/logout" method="POST" class="hidden md:block">
						<button
							type="submit"
							class="flex items-center gap-1.5 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-md border border-red-500/20 hover:bg-red-500/10 transition-colors text-sm font-medium"
						>
							<LogOut class="h-4 w-4" />
							Déconnexion
						</button>
					</form>
				{:else}
					<a
						href="/auth"
						class="hidden md:block bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
					>
						Se connecter
					</a>
				{/if}

				<!-- Mobile menu button -->
				<button
					onclick={toggleMenu}
					aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
					aria-expanded={isMobileMenuOpen}
					class="md:hidden text-muted hover:text-text focus:outline-none"
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
		<div class="md:hidden bg-surface border-b border-border">
			<!-- Mobile search -->
			<div class="px-4 pt-3 pb-2">
				<form onsubmit={handleSearchSubmit}>
					<div class="relative">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
						<input
							name="q"
							type="search"
							placeholder="Rechercher un film ou une série..."
							value={searchQuery}
							oninput={handleSearchInput}
							class="w-full bg-bg border border-border text-text placeholder-muted rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
						/>
					</div>
				</form>
			</div>

			<div class="px-2 pb-3 space-y-1">
				<a href="/movies" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted hover:text-text hover:bg-border" onclick={toggleMenu}>
					<Film class="h-4 w-4" /> Films
				</a>
				<a href="/tv" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted hover:text-text hover:bg-border" onclick={toggleMenu}>
					<Tv class="h-4 w-4" /> Séries
				</a>
				{#if auth.session}
					<a href="/watchlist" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted hover:text-text hover:bg-border" onclick={toggleMenu}>
						<List class="h-4 w-4" /> Ma Watchlist
					</a>
				{/if}
			</div>

			<div class="px-4 py-3 border-t border-border">
				{#if auth.session}
					<div class="flex items-center gap-3 mb-3">
						<div class="bg-border p-2 rounded-full shrink-0">
							<User class="h-5 w-5 text-muted" />
						</div>
						<div>
							<div class="text-sm font-medium text-text">{auth.user?.user_metadata?.username ?? 'Utilisateur'}</div>
							<div class="text-xs text-muted">{auth.user?.email}</div>
						</div>
					</div>
					<div class="flex gap-2">
						<a href="/profile" class="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium text-muted hover:text-text hover:bg-border transition-colors" onclick={toggleMenu}>
							Mon Profil
						</a>
						<form action="/auth/logout" method="POST" class="flex-1">
							<button type="submit" class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors">
								<LogOut class="h-4 w-4" /> Déconnexion
							</button>
						</form>
					</div>
				{:else}
					<a href="/auth" class="block text-center w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors" onclick={toggleMenu}>
						Se connecter / S'inscrire
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
