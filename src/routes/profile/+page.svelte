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
	<div class="mx-auto max-w-2xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8 h-10 w-40 rounded bg-surface"></div>
		<div
			class="mb-4 flex flex-col items-center gap-4 rounded-xl border border-border bg-surface p-6"
		>
			<div class="h-24 w-24 rounded-full bg-border"></div>
			<div class="h-4 w-32 rounded bg-border"></div>
		</div>
		<div class="mb-4 space-y-4 rounded-xl border border-border bg-surface p-6">
			{#each { length: 3 } as _}
				<div class="h-10 rounded bg-border"></div>
			{/each}
			<div class="h-10 w-32 rounded bg-border"></div>
		</div>
		<div class="grid grid-cols-3 gap-4 rounded-xl border border-border bg-surface p-6">
			{#each { length: 6 } as _}
				<div class="h-16 rounded bg-border"></div>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto max-w-2xl px-4 py-8 pb-16 sm:px-6 lg:px-8">
		<h1 class="mb-8 font-display text-4xl text-text sm:text-5xl">Mon Profil</h1>

		<!-- Avatar card -->
		<div
			class="mb-4 flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6"
		>
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
			<div class="group relative">
				<button
					type="button"
					onclick={() => fileInput?.click()}
					class="block rounded-full focus:ring-2 focus:ring-accent focus:outline-none"
					title="Modifier l'avatar"
					aria-label="Modifier l'avatar"
				>
					{#if data.profile?.avatar_url}
						<img
							src="{data.profile.avatar_url}?t={encodeURIComponent(data.profile.updated_at ?? '')}"
							alt="Avatar de {username || 'utilisateur'}"
							class="h-24 w-24 rounded-full border-2 border-border object-cover transition-opacity group-hover:opacity-75"
						/>
					{:else}
						<div
							class="flex h-24 w-24 items-center justify-center rounded-full bg-accent font-display text-2xl font-bold text-bg transition-opacity select-none group-hover:opacity-75"
						>
							{initials}
						</div>
					{/if}
					<div
						class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-bg/60 opacity-0 transition-opacity group-hover:opacity-100"
					>
						{#if avatarLoading}
							<span class="h-6 w-6 animate-spin rounded-full border-2 border-text/40 border-t-text"
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
				<p class="text-xs text-muted">Cliquez sur l'avatar pour le modifier (max 2 Mo)</p>
			{/if}
		</div>

		<!-- Edit form card -->
		<div class="mb-4 rounded-xl border border-border bg-surface p-6">
			<h2 class="mb-4 text-lg font-semibold text-text">Informations</h2>

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
					<label for="username" class="mb-1 block text-sm font-medium text-muted">
						Nom d'utilisateur
					</label>
					<input
						id="username"
						name="username"
						type="text"
						bind:value={username}
						minlength="3"
						required
						class="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder-muted transition-colors focus:border-accent focus:outline-none"
						placeholder="votre_pseudo"
					/>
				</div>

				<!-- Bio -->
				<div>
					<label for="bio" class="mb-1 block text-sm font-medium text-muted">Bio</label>
					<textarea
						id="bio"
						name="bio"
						bind:value={bio}
						rows="3"
						class="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder-muted transition-colors focus:border-accent focus:outline-none"
						placeholder="Parlez-nous de vous…"
					></textarea>
				</div>

				<!-- Birth date -->
				<div>
					<label for="birth_date" class="mb-1 block text-sm font-medium text-muted">
						Date de naissance
					</label>
					<input
						id="birth_date"
						name="birth_date"
						type="date"
						bind:value={birth_date}
						class="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text transition-colors focus:border-accent focus:outline-none"
					/>
				</div>

				<!-- Submit + inline error -->
				<div class="flex items-center gap-3 pt-1">
					<button
						type="submit"
						disabled={profileLoading}
						class="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover disabled:opacity-50"
					>
						{#if profileLoading}
							<span
								class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-bg/40 border-t-bg"
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
		<div class="rounded-xl border border-border bg-surface p-6">
			<h2 class="mb-4 text-lg font-semibold text-text">Statistiques</h2>

			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<div class="rounded-lg border border-border bg-bg p-4 text-center">
					<div class="font-display text-2xl font-bold text-accent">{totalCount}</div>
					<div class="mt-1 text-xs text-muted">Total</div>
				</div>
				<div class="rounded-lg border border-border bg-bg p-4 text-center">
					<div class="font-display text-2xl font-bold text-text">
						{watchlist.counts.watching}
					</div>
					<div class="mt-1 text-xs text-muted">En cours</div>
				</div>
				<div class="rounded-lg border border-border bg-bg p-4 text-center">
					<div class="font-display text-2xl font-bold text-text">
						{watchlist.counts.completed}
					</div>
					<div class="mt-1 text-xs text-muted">Vus</div>
				</div>
				<div class="rounded-lg border border-border bg-bg p-4 text-center">
					<div class="font-display text-2xl font-bold text-text">
						{watchlist.counts.plan_to_watch}
					</div>
					<div class="mt-1 text-xs text-muted">À voir</div>
				</div>
				<div class="rounded-lg border border-border bg-bg p-4 text-center">
					<div class="font-display text-2xl font-bold text-text">
						{watchlist.counts.on_hold}
					</div>
					<div class="mt-1 text-xs text-muted">En pause</div>
				</div>
				<div class="rounded-lg border border-border bg-bg p-4 text-center">
					<div class="font-display text-2xl font-bold text-text">
						{watchlist.counts.dropped}
					</div>
					<div class="mt-1 text-xs text-muted">Abandonnés</div>
				</div>
			</div>
		</div>
	</div>
{/if}
