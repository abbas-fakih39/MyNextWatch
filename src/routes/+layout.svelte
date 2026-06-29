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

	let activeTransition: ViewTransition | null = null;

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		// A new navigation may start before the previous transition finishes
		// (e.g. clicking nav links quickly). Skip the in-flight one so its
		// old-page snapshot doesn't stay painted over the new page — the cause
		// of the page appearing "stuck" until a refresh.
		activeTransition?.skipTransition();

		return new Promise((resolve) => {
			activeTransition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			activeTransition.finished.finally(() => {
				activeTransition = null;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-bg font-body text-text">
	<Navbar />

	<main class="flex grow flex-col">
		{@render children()}
	</main>

	<Toast />
</div>
