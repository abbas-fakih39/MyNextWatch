<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import { auth } from '$lib/stores/auth.svelte';

	let { data, children } = $props();

	// On synchronise le store global avec les données récupérées côté serveur au chargement
	// Svelte 5 $effect permet de réagir aux changements de props
	$effect(() => {
		auth.setAuth(data.session, data.user);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
	<Navbar />
	
	<main class="flex-grow flex flex-col">
		{@render children()}
	</main>
</div>
