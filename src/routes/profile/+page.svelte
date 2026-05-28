<script lang="ts">
	import { navigating } from '$app/stores';
	import { enhance } from '$app/forms';
	import { watchlist } from '$lib/stores/watchlist.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { Camera } from 'lucide-svelte';

	let { data } = $props();

	// Form field state — $effect below syncs initial + subsequent values from data.profile
	let username = $state('');
	let bio = $state('');
	let birth_date = $state('');

	$effect(() => {
		username = data.profile?.username ?? '';
		bio = data.profile?.bio ?? '';
		birth_date = data.profile?.birth_date ?? '';
	});

	// Error-only inline feedback (success goes to global toast)
	let profileError = $state<string | null>(null);
	let avatarError = $state<string | null>(null);
	let profileLoading = $state(false);
	let avatarLoading = $state(false);

	// Avatar fallback initials
	const initials = $derived(
		username.trim().length >= 1 ? username.trim().slice(0, 2).toUpperCase() : '?'
	);

	// Watchlist stats
	const totalCount = $derived(watchlist.entries.length);

	// DOM refs
	let fileInput = $state<HTMLInputElement | undefined>(undefined);
	let avatarForm = $state<HTMLFormElement | undefined>(undefined);
</script>

<svelte:head>
	<title>Mon Profil — MyNextWatch</title>
</svelte:head>

{#if $navigating}
	<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
		<div class="h-10 bg-surface rounded w-40 mb-8"></div>
		<div class="bg-surface border border-border rounded-xl p-6 mb-4 flex flex-col items-center gap-4">
			<div class="w-24 h-24 rounded-full bg-border"></div>
			<div class="h-4 bg-border rounded w-32"></div>
		</div>
		<div class="bg-surface border border-border rounded-xl p-6 mb-4 space-y-4">
			{#each { length: 3 } as _}
				<div class="h-10 bg-border rounded"></div>
			{/each}
			<div class="h-10 bg-border rounded w-32"></div>
		</div>
		<div class="bg-surface border border-border rounded-xl p-6 grid grid-cols-3 gap-4">
			{#each { length: 6 } as _}
				<div class="h-16 bg-border rounded"></div>
			{/each}
		</div>
	</div>
{:else}
	<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
		<h1 class="font-display text-4xl sm:text-5xl text-text mb-8">Mon Profil</h1>

		<!-- Avatar card -->
		<div class="bg-surface border border-border rounded-xl p-6 mb-4 flex flex-col items-center gap-3">
			<!-- Hidden upload form -->
			<form
				bind:this={avatarForm}
				method="POST"
				action="?/uploadAvatar"
				enctype="multipart/form-data"
				use:enhance={() => {
					avatarLoading = true;
					avatarError = null;
					return async ({ result, update }) => {
						avatarLoading = false;
						if (result.type === 'success' && result.data) {
							const d = result.data as Record<string, unknown>;
							if (typeof d.avatarSuccess === 'string') {
								toast.add(d.avatarSuccess);
							}
						} else if (result.type === 'failure' && result.data) {
							const d = result.data as Record<string, unknown>;
							if (typeof d.avatarError === 'string') {
								avatarError = d.avatarError;
							}
						}
						await update({ reset: false });
					};
				}}
			>
				<input
					bind:this={fileInput}
					type="file"
					name="avatar"
					accept="image/*"
					class="hidden"
					onchange={() => avatarForm?.requestSubmit()}
				/>
			</form>

			<!-- Avatar circle -->
			<div class="relative group">
				<button
					type="button"
					onclick={() => fileInput?.click()}
					class="block rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
					title="Modifier l'avatar"
					aria-label="Modifier l'avatar"
				>
					{#if data.profile?.avatar_url}
						<img
							src="{data.profile.avatar_url}?t={encodeURIComponent(data.profile.updated_at ?? '')}"
							alt="Avatar de {username || 'utilisateur'}"
							class="w-24 h-24 rounded-full object-cover border-2 border-border group-hover:opacity-75 transition-opacity"
						/>
					{:else}
						<div
							class="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-bg text-2xl font-bold font-display group-hover:opacity-75 transition-opacity select-none"
						>
							{initials}
						</div>
					{/if}
					<div
						class="absolute inset-0 rounded-full flex items-center justify-center bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
					>
						{#if avatarLoading}
							<span class="w-6 h-6 border-2 border-text/40 border-t-text rounded-full animate-spin"
							></span>
						{:else}
							<Camera class="h-6 w-6 text-text" />
						{/if}
					</div>
				</button>
			</div>

			{#if avatarError}
				<p class="text-sm text-red-400">{avatarError}</p>
			{:else}
				<p class="text-muted text-xs">Cliquez sur l'avatar pour le modifier (max 2 Mo)</p>
			{/if}
		</div>

		<!-- Edit form card -->
		<div class="bg-surface border border-border rounded-xl p-6 mb-4">
			<h2 class="text-lg font-semibold text-text mb-4">Informations</h2>

			<form
				method="POST"
				action="?/updateProfile"
				use:enhance={() => {
					profileLoading = true;
					profileError = null;
					return async ({ result, update }) => {
						profileLoading = false;
						if (result.type === 'success' && result.data) {
							const d = result.data as Record<string, unknown>;
							if (typeof d.updateSuccess === 'string') {
								toast.add(d.updateSuccess);
							}
						} else if (result.type === 'failure' && result.data) {
							const d = result.data as Record<string, unknown>;
							if (typeof d.updateError === 'string') {
								profileError = d.updateError;
							}
						}
						await update({ reset: false });
					};
				}}
				class="space-y-4"
			>
				<!-- Username -->
				<div>
					<label for="username" class="block text-sm font-medium text-muted mb-1">
						Nom d'utilisateur
					</label>
					<input
						id="username"
						name="username"
						type="text"
						bind:value={username}
						minlength="3"
						required
						class="w-full bg-bg border border-border rounded-md px-3 py-2 text-text text-sm placeholder-muted focus:outline-none focus:border-accent transition-colors"
						placeholder="votre_pseudo"
					/>
				</div>

				<!-- Bio -->
				<div>
					<label for="bio" class="block text-sm font-medium text-muted mb-1">Bio</label>
					<textarea
						id="bio"
						name="bio"
						bind:value={bio}
						rows="3"
						class="w-full bg-bg border border-border rounded-md px-3 py-2 text-text text-sm placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
						placeholder="Parlez-nous de vous…"
					></textarea>
				</div>

				<!-- Birth date -->
				<div>
					<label for="birth_date" class="block text-sm font-medium text-muted mb-1">
						Date de naissance
					</label>
					<input
						id="birth_date"
						name="birth_date"
						type="date"
						bind:value={birth_date}
						class="w-full bg-bg border border-border rounded-md px-3 py-2 text-text text-sm focus:outline-none focus:border-accent transition-colors"
					/>
				</div>

				<!-- Submit + inline error -->
				<div class="flex items-center gap-3 pt-1">
					<button
						type="submit"
						disabled={profileLoading}
						class="inline-flex items-center gap-2 bg-accent text-bg px-5 py-2 rounded-md text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
					>
						{#if profileLoading}
							<span
								class="inline-block w-4 h-4 border-2 border-bg/40 border-t-bg rounded-full animate-spin"
							></span>
							Enregistrement…
						{:else}
							Enregistrer
						{/if}
					</button>

					{#if profileError}
						<p class="text-sm text-red-400">{profileError}</p>
					{/if}
				</div>
			</form>
		</div>

		<!-- Stats card -->
		<div class="bg-surface border border-border rounded-xl p-6">
			<h2 class="text-lg font-semibold text-text mb-4">Statistiques</h2>

			<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
				<div class="bg-bg border border-border rounded-lg p-4 text-center">
					<div class="text-2xl font-bold font-display text-accent">{totalCount}</div>
					<div class="text-xs text-muted mt-1">Total</div>
				</div>
				<div class="bg-bg border border-border rounded-lg p-4 text-center">
					<div class="text-2xl font-bold font-display text-text">
						{watchlist.counts.watching}
					</div>
					<div class="text-xs text-muted mt-1">En cours</div>
				</div>
				<div class="bg-bg border border-border rounded-lg p-4 text-center">
					<div class="text-2xl font-bold font-display text-text">
						{watchlist.counts.completed}
					</div>
					<div class="text-xs text-muted mt-1">Vus</div>
				</div>
				<div class="bg-bg border border-border rounded-lg p-4 text-center">
					<div class="text-2xl font-bold font-display text-text">
						{watchlist.counts.plan_to_watch}
					</div>
					<div class="text-xs text-muted mt-1">À voir</div>
				</div>
				<div class="bg-bg border border-border rounded-lg p-4 text-center">
					<div class="text-2xl font-bold font-display text-text">
						{watchlist.counts.on_hold}
					</div>
					<div class="text-xs text-muted mt-1">En pause</div>
				</div>
				<div class="bg-bg border border-border rounded-lg p-4 text-center">
					<div class="text-2xl font-bold font-display text-text">
						{watchlist.counts.dropped}
					</div>
					<div class="text-xs text-muted mt-1">Abandonnés</div>
				</div>
			</div>
		</div>
	</div>
{/if}
