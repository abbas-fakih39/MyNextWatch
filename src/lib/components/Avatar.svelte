<script lang="ts">
	interface Props {
		/** Avatar image URL. When null/undefined, initials are shown instead. */
		src?: string | null;
		/** Display name, used to derive the initials fallback and the alt text. */
		name?: string | null;
		/** Override the computed alt / aria-label text. */
		alt?: string;
		/** Extra classes for sizing/border, e.g. "h-7 w-7 text-xs". */
		class?: string;
	}

	let { src, name = null, alt, class: className = '' }: Props = $props();

	const initials = $derived(
		name && name.trim().length >= 1 ? name.trim().slice(0, 2).toUpperCase() : '?'
	);
	const label = $derived(alt ?? `Avatar de ${name?.trim() || 'utilisateur'}`);
</script>

{#if src}
	<img {src} alt={label} class="rounded-full object-cover {className}" />
{:else}
	<div
		role="img"
		aria-label={label}
		class="flex items-center justify-center rounded-full bg-accent font-display font-bold text-bg select-none {className}"
	>
		{initials}
	</div>
{/if}
