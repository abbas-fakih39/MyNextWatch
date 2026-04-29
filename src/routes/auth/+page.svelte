<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	
	let isRegistering = $state(false);
	let loading = $state(false);

	function toggleMode() {
		isRegistering = !isRegistering;
		if (form) form.error = null;
		if (form) form.success = null;
	}
</script>

<svelte:head>
	<title>{isRegistering ? 'Inscription' : 'Connexion'} - MyNextWatch</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-700">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
				{isRegistering ? 'Créer un compte' : 'Connectez-vous'}
			</h2>
			<p class="mt-2 text-center text-sm text-gray-400">
				MyNextWatch - Votre Watchlist
			</p>
		</div>

		{#if form?.error}
			<div class="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm text-center">
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded-lg p-3 text-sm text-center">
				{form.success}
			</div>
		{/if}

		<form 
			class="mt-8 space-y-6" 
			method="POST" 
			action={isRegistering ? '?/register' : '?/login'}
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<div class="rounded-md space-y-4">
				{#if isRegistering}
					<div>
						<label for="username" class="sr-only">Nom d'utilisateur</label>
						<input id="username" name="username" type="text" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all" placeholder="Nom d'utilisateur">
					</div>
					<div>
						<label for="birth_date" class="sr-only">Date de naissance</label>
						<input id="birth_date" name="birth_date" type="date" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-500 text-gray-400 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all">
					</div>
				{/if}
				<div>
					<label for="email-address" class="sr-only">Adresse Email</label>
					<input id="email-address" name="email" type="email" autocomplete="email" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all" placeholder="Adresse Email">
				</div>
				<div>
					<label for="password" class="sr-only">Mot de passe</label>
					<input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all" placeholder="Mot de passe">
				</div>
			</div>

			<div>
				<button type="submit" disabled={loading} class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 transition-all shadow-lg hover:shadow-indigo-500/30">
					{#if loading}
						Chargement...
					{:else}
						{isRegistering ? 'S\'inscrire' : 'Se connecter'}
					{/if}
				</button>
			</div>
		</form>

		<div class="text-center mt-4">
			<button type="button" onclick={toggleMode} class="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
				{isRegistering ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
			</button>
		</div>
	</div>
</div>
