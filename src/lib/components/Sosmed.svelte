<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import type { SosmedItem, SosmedResponse } from '$lib/types/sosmed';

	// State menggunakan Svelte 5 Runes
	let socialLinks = $state<SosmedItem[]>([]);
	let isLoading = $state(true);

	async function fetchSosmed() {
		try {
			const response = await fetch(`${env.PUBLIC_API_URL}/public/sosmed`);
			const result: SosmedResponse = await response.json();
			socialLinks = result.data.sort((a, b) => a.urutan - b.urutan);
		} catch (error) {
			console.error('Gagal mengambil data sosmed:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchSosmed();
	});
</script>

<div class="flex flex-wrap items-center gap-4">
	{#if isLoading}
		{#each Array(4) as _}
			<div class="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
		{/each}
	{:else}
		{#each socialLinks as item (item.id_sosmed)}
			<a
				href={item.link_sosmed}
				target="_blank"
				rel="noopener noreferrer"
				class="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:bg-blue-600 hover:ring-blue-600 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-blue-500"
				aria-label={`Ikuti kami di ${item.sosmed}`}
				title={item.judul}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5 text-slate-600 transition-colors group-hover:text-white dark:text-slate-400"
				>
					{@html item.icon_sosmed}
				</svg>

				<span
					class="absolute -top-10 scale-0 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white transition-all group-hover:scale-100 dark:bg-slate-700"
				>
					{item.sosmed}
				</span>
			</a>
		{/each}
	{/if}
</div>
