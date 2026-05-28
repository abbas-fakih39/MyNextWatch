<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Série introuvable — MyNextWatch</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
	<p class="mb-4 font-display text-8xl text-border">{$page.status}</p>
	<h1 class="mb-2 font-display text-3xl text-text">Série introuvable</h1>
	<p class="mb-8 max-w-sm text-muted">
		{$page.error?.message ?? "Cette série n'existe pas ou n'est plus disponible."}
	</p>
	<a
		href="/tv"
		class="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-6 py-3 font-medium text-text transition-colors hover:border-accent hover:text-accent"
	>
		← Retour aux séries
	</a>
</div>
