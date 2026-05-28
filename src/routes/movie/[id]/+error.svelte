<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Film introuvable — MyNextWatch</title>
</svelte:head>

<div class="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center">
	<p class="font-display text-8xl text-border mb-4">{$page.status}</p>
	<h1 class="font-display text-3xl text-text mb-2">Film introuvable</h1>
	<p class="text-muted mb-8 max-w-sm">
		{$page.error?.message ?? "Ce film n'existe pas ou n'est plus disponible."}
	</p>
	<a
		href="/movies"
		class="inline-flex items-center gap-2 bg-surface border border-border hover:border-accent text-text hover:text-accent px-6 py-3 rounded-md font-medium transition-colors"
	>
		← Retour aux films
	</a>
</div>
