<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { watchlist } from '$lib/stores/watchlist.svelte';
	import { onNavigate } from '$app/navigation';

	let { data, children } = $props();

	$effect(() => {
		auth.setAuth(data.session, data.user);
	});

	$effect(() => {
		watchlist.setEntries(data.watchlistEntries ?? []);
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-bg text-text flex flex-col font-body">
	<Navbar />

	<main class="grow flex flex-col">
		{@render children()}
	</main>

	<Toast />
</div>
