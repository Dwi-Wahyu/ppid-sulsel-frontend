<script lang="ts">
	import { type Snippet } from 'svelte';
	import { sidebar } from '$lib/state/sidebar.svelte';
	import './sidebar.css';

	// Interface hanya berisi properti yang benar-benar dikirim dari parent
	interface Props {
		title?: string;
		children: Snippet;
	}

	// Destrukturisasi sekarang sinkron dengan Interface [cite: 3]
	let { title = 'Panel', children }: Props = $props();
</script>

<aside
	class="sidebar-transition absolute inset-y-0 left-0 z-30 flex h-full flex-col border-r border-white/10 bg-ppid-primary text-white shadow-xl md:static md:shadow-none {sidebar.isOpen
		? 'w-72 translate-x-0'
		: 'w-20 translate-x-full md:w-24 md:translate-x-0'}"
>
	<div
		class="flex items-center justify-between {sidebar.isOpen ? 'p-6 pr-4 pb-0' : 'p-5 pb-0 pl-7'}"
	>
		{#if sidebar.isOpen}
			<h1 class="text-xl font-bold">{title}</h1>
		{/if}

		<button
			onclick={() => sidebar.toggle()}
			class="rounded-lg p-2 text-slate-400 hover:bg-white/5 focus:outline-none"
		>
			{#if sidebar.isOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
					/>
					<path d="M9 4v16" />
					<path d="M15 10l-2 2l2 2" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
					/>
					<path d="M9 4v16" />
					<path d="M14 10l2 2l-2 2" />
				</svg>
			{/if}
		</button>
	</div>

	<nav class="no-scrollbar flex-1 overflow-x-hidden overflow-y-auto py-4">
		{@render children()}
	</nav>
</aside>
