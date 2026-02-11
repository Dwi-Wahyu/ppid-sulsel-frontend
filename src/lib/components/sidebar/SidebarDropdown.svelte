<script lang="ts">
	import { type Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { sidebar } from '$lib/state/sidebar.svelte';

	interface Props {
		label: string;
		active: boolean;
		activeDropdown: string | null;
		setActiveDropdown: (label: string | null) => void;
		icon: Snippet;
		children: Snippet;
	}

	let { label, active, activeDropdown, setActiveDropdown, icon, children }: Props = $props();

	// Dropdown hanya terbuka jika state activeDropdown cocok DAN sidebar sedang terbuka
	let isOpen = $derived(activeDropdown === label && sidebar.isOpen);

	// Efek untuk memastikan dropdown terbuka jika URL aktif berada di bawah menu ini (saat refresh)
	$effect(() => {
		if (active && !activeDropdown) {
			setActiveDropdown(label);
		}
	});

	function toggle() {
		if (!sidebar.isOpen) {
			// Jika sidebar tertutup, buka sidebar DAN buka dropdown ini
			sidebar.isOpen = true;
			setActiveDropdown(label);
		} else {
			// Jika sidebar sudah terbuka, toggle dropdown biasa
			setActiveDropdown(isOpen ? null : label);
		}
	}
</script>

<li class="relative">
	<button
		onclick={toggle}
		class="group mx-3 flex items-center rounded-xl py-3 text-sm font-semibold transition-all duration-200 {sidebar.isOpen
			? 'w-[calc(100%-1.5rem)] justify-between px-4'
			: 'mx-auto h-12 w-12 justify-center px-0'} {isOpen
			? 'bg-white/10 text-white'
			: 'text-slate-400 hover:bg-white/5 hover:text-white'}"
	>
		<div class="flex min-w-0 items-center">
			<div
				class="h-6 w-6 shrink-0 transition-colors duration-200 {sidebar.isOpen
					? 'mr-3'
					: 'mr-0'} {(isOpen || active) && sidebar.isOpen
					? 'text-white'
					: 'text-slate-400'} group-hover:text-white"
			>
				{@render icon()}
			</div>
			{#if sidebar.isOpen}
				<span class="overflow-hidden text-ellipsis whitespace-nowrap">
					{label}
				</span>
			{/if}
		</div>

		{#if sidebar.isOpen}
			<svg
				class="h-4 w-4 shrink-0 transition-transform duration-200"
				class:rotate-180={isOpen}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		{/if}
	</button>

	{#if isOpen && sidebar.isOpen}
		<ul transition:slide={{ duration: 300 }} class="mt-1 space-y-1 overflow-hidden transition-all">
			{@render children()}
		</ul>
	{/if}
</li>
