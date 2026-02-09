<script lang="ts">
	import { page } from '$app/state';
	import { type Snippet } from 'svelte';
	import { sidebar } from '$lib/state/sidebar.svelte';

	interface Props {
		href: string;
		label: string;
		icon?: Snippet;
		badge?: string | number;
	}

	let { href, label, icon, badge }: Props = $props();

	let isActive = $derived(page.url.pathname === href || page.url.pathname.startsWith(href + '/'));

	// Fungsi untuk menangani klik saat sidebar tertutup
	function handleClick() {
		if (!sidebar.isOpen) {
			sidebar.isOpen = true;
		}
	}
</script>

<li>
	<a
		{href}
		onclick={handleClick}
		class="group relative mx-3 my-1 flex items-center overflow-hidden rounded-xl py-3 font-semibold whitespace-nowrap transition-all duration-200
		{isActive
			? 'bg-ppid-accent text-ppid-primary shadow-lg shadow-ppid-accent/20'
			: 'text-slate-400 hover:bg-white/5 hover:text-white'} 
		{sidebar.isOpen ? 'justify-start px-4' : 'mx-auto h-12 w-12 justify-center px-0'}"
		style={isActive ? 'view-transition-name: active-sidebar-indicator;' : ''}
	>
		<div
			class="h-6 w-6 shrink-0 transition-colors duration-200
			{sidebar.isOpen ? 'mr-3' : 'mr-0'} 
			{isActive ? 'text-ppid-primary' : 'text-slate-400 group-hover:text-white'}"
		>
			{#if icon}
				{@render icon()}
			{/if}
		</div>

		{#if sidebar.isOpen}
			<span class="relative z-10 transition-opacity duration-300">
				{label}
			</span>

			{#if badge}
				<span
					class="ml-auto rounded-full bg-ppid-primary/10 px-2 py-0.5 text-[10px] font-bold text-ppid-primary"
				>
					{badge}
				</span>
			{/if}
		{/if}
	</a>
</li>
