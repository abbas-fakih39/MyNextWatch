<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import { Menu, X, Film, Tv, List, User, LogOut, Clapperboard } from 'lucide-svelte';

	let isMobileMenuOpen = $state(false);

	function toggleMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<nav class="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center gap-2 group">
					<Clapperboard class="h-8 w-8 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
					<span class="text-xl font-bold text-white tracking-tight">MyNextWatch</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex md:items-center md:space-x-8">
				<a href="/" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Accueil</a>
				<a href="/movies" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Films</a>
				<a href="/tv" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Séries</a>
				{#if auth.session}
					<a href="/watchlist" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Ma Watchlist</a>
				{/if}
			</div>

			<!-- Desktop Auth -->
			<div class="hidden md:flex md:items-center md:space-x-4">
				{#if auth.session}
					<a href="/profile" class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
						<User class="h-5 w-5" />
						<span class="text-sm font-medium">{auth.user?.user_metadata.username || 'Profil'}</span>
					</a>
					<form action="/?/logout" method="POST">
						<button type="submit" class="flex items-center gap-1 bg-red-600/10 text-red-500 hover:bg-red-600/20 px-3 py-2 rounded-lg transition-colors text-sm font-medium border border-red-500/20">
							<LogOut class="h-4 w-4" />
							Déconnexion
						</button>
					</form>
				{:else}
					<a href="/auth" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
						Se connecter
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="flex items-center md:hidden">
				<button onclick={toggleMenu} class="text-gray-400 hover:text-white focus:outline-none">
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
		<div class="md:hidden bg-gray-800 border-b border-gray-700">
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				<a href="/" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">Accueil</a>
				<a href="/movies" class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
					<Film class="h-5 w-5" /> Films
				</a>
				<a href="/tv" class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
					<Tv class="h-5 w-5" /> Séries
				</a>
				{#if auth.session}
					<a href="/watchlist" class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
						<List class="h-5 w-5" /> Ma Watchlist
					</a>
				{/if}
			</div>
			<div class="pt-4 pb-3 border-t border-gray-700">
				{#if auth.session}
					<div class="flex items-center px-5 gap-3">
						<div class="flex-shrink-0 bg-gray-700 p-2 rounded-full">
							<User class="h-6 w-6 text-gray-300" />
						</div>
						<div>
							<div class="text-base font-medium leading-none text-white">{auth.user?.user_metadata.username || 'Utilisateur'}</div>
							<div class="text-sm font-medium leading-none text-gray-400 mt-1">{auth.user?.email}</div>
						</div>
					</div>
					<div class="mt-3 px-2 space-y-1">
						<a href="/profile" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Mon Profil</a>
						<form action="/?/logout" method="POST">
							<button type="submit" class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-700">
								<LogOut class="h-5 w-5" /> Déconnexion
							</button>
						</form>
					</div>
				{:else}
					<div class="px-5 py-3">
						<a href="/auth" class="flex justify-center items-center w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-base font-medium transition-colors">
							Se connecter / S'inscrire
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>
