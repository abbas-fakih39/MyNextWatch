<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import MediaGrid from '$lib/components/MediaGrid.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>MyNextWatch — Votre Watchlist de Films & Séries</title>
	<meta
		name="description"
		content="Découvrez les films et séries du moment, gérez votre watchlist personnelle sur MyNextWatch."
	/>
</svelte:head>

{#if data.hero}
	<Hero item={data.hero} />
{/if}

<div class="bg-gray-900 pb-12">
	{#if data.trending?.length}
		<MediaGrid title="📈 Tendances du jour" items={data.trending} carousel={true} />
	{/if}

	{#if data.popularMovies?.length}
		<MediaGrid
			title="🎬 Films Populaires"
			items={data.popularMovies}
			viewAllHref="/movies"
			carousel={true}
		/>
	{/if}

	{#if data.popularTV?.length}
		<MediaGrid
			title="📺 Séries Populaires"
			items={data.popularTV}
			viewAllHref="/tv"
			carousel={true}
		/>
	{/if}
</div>
