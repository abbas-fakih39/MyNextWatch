<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { toast } from '$lib/stores/toast.svelte';
</script>

{#if toast.items.length > 0}
	<div
		class="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col-reverse items-end gap-2"
		aria-live="polite"
		aria-atomic="false"
	>
		{#each toast.items as item (item.id)}
			<div
				in:fly={{ y: 16, duration: 200 }}
				out:fade={{ duration: 150 }}
				class="pointer-events-auto flex max-w-xs items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg {item.type ===
				'success'
					? 'border-emerald-500/30 bg-surface text-emerald-400'
					: 'border-red-500/30 bg-surface text-red-400'}"
			>
				{#if item.type === 'success'}
					<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				{:else}
					<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{/if}
				<span class="flex-1">{item.message}</span>
				<button
					onclick={() => toast.remove(item.id)}
					aria-label="Fermer"
					class="-mr-1 flex size-9 shrink-0 items-center justify-center rounded text-current opacity-60 transition-opacity hover:opacity-100"
				>
					<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}
