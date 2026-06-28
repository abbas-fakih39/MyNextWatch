<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	let isRegistering = $state(false);
	let loading = $state(false);

	function toggleMode() {
		isRegistering = !isRegistering;
		if (form) form.error = undefined;
		if (form) form.success = undefined;
	}
</script>

<svelte:head>
	<title>{isRegistering ? 'Inscription' : 'Connexion'} - MyNextWatch</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-bg px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface p-10 shadow-xl">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
				{isRegistering ? 'Créer un compte' : 'Connectez-vous'}
			</h2>
			<p class="mt-2 text-center text-sm text-muted">MyNextWatch - Votre Watchlist</p>
		</div>

		{#if form?.error}
			<div
				class="rounded-lg border border-red-500 bg-red-500/10 p-3 text-center text-sm text-red-500"
			>
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div
				class="rounded-lg border border-emerald-500 bg-emerald-500/10 p-3 text-center text-sm text-emerald-500"
			>
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
			<div class="space-y-4 rounded-md">
				{#if isRegistering}
					<div>
						<label for="username" class="sr-only">Nom d'utilisateur</label>
						<input
							id="username"
							name="username"
							type="text"
							required
							class="relative block w-full appearance-none rounded-xl border border-border bg-bg px-4 py-3 text-white placeholder-muted transition-all focus:border-transparent focus:ring-2 focus:ring-primary-hover focus:outline-none sm:text-sm"
							placeholder="Nom d'utilisateur"
						/>
					</div>
					<div>
						<label for="birth_date" class="sr-only">Date de naissance</label>
						<input
							id="birth_date"
							name="birth_date"
							type="date"
							required
							class="relative block w-full appearance-none rounded-xl border border-border bg-bg px-4 py-3 text-muted placeholder-muted transition-all focus:border-transparent focus:ring-2 focus:ring-primary-hover focus:outline-none sm:text-sm"
						/>
					</div>
				{/if}
				<div>
					<label for="email-address" class="sr-only">Adresse Email</label>
					<input
						id="email-address"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="relative block w-full appearance-none rounded-xl border border-border bg-bg px-4 py-3 text-white placeholder-muted transition-all focus:border-transparent focus:ring-2 focus:ring-primary-hover focus:outline-none sm:text-sm"
						placeholder="Adresse Email"
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Mot de passe</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="relative block w-full appearance-none rounded-xl border border-border bg-bg px-4 py-3 text-white placeholder-muted transition-all focus:border-transparent focus:ring-2 focus:ring-primary-hover focus:outline-none sm:text-sm"
						placeholder="Mot de passe"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="group relative flex w-full justify-center rounded-xl border border-transparent bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-hover hover:shadow-primary-hover/30 focus:ring-2 focus:ring-primary-hover focus:ring-offset-2 focus:ring-offset-bg focus:outline-none disabled:opacity-50"
				>
					{#if loading}
						Chargement...
					{:else}
						{isRegistering ? "S'inscrire" : 'Se connecter'}
					{/if}
				</button>
			</div>
		</form>

		<div class="mt-4 text-center">
			<button
				type="button"
				onclick={toggleMode}
				class="text-sm font-medium text-primary-bright transition-colors hover:text-primary-bright"
			>
				{isRegistering ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
			</button>
		</div>
	</div>
</div>
