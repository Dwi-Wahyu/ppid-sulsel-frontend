<script lang="ts">
	import { type Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		label: string;
		active: boolean;
		sidebarOpen: boolean;
		activeDropdown: string | null;
		setActiveDropdown: (label: string | null) => void;
		icon: Snippet;
		children: Snippet;
	}

	let { label, active, sidebarOpen, activeDropdown, setActiveDropdown, icon, children }: Props =
		$props();

	let isOpen = $derived(activeDropdown === label);

	function toggle() {
		if (!sidebarOpen) {
			// If closed, open sidebar and this dropdown
			setActiveDropdown(label);
			// Ideally this would trigger sidebar open too, but that's managed by parent
		} else {
			setActiveDropdown(isOpen ? null : label);
		}
	}
</script>

<li class="relative">
	<button
		onclick={toggle}
		class="group mx-3 flex items-center rounded-xl py-3 text-sm font-semibold transition-all duration-200 {sidebarOpen
			? 'w-[calc(100%-1.5rem)] justify-between px-4'
			: 'mx-auto h-12 w-12 justify-center px-0'} {isOpen && sidebarOpen
			? 'bg-white/10 text-white'
			: 'text-slate-400 hover:bg-white/5 hover:text-white'}"
	>
		<div class="flex min-w-0 items-center">
			<div
				class="h-6 w-6 shrink-0 transition-colors duration-200 {sidebarOpen
					? 'mr-3'
					: 'mr-0'} {(isOpen || active) && sidebarOpen
					? 'text-white'
					: 'text-slate-400'} group-hover:text-white"
			>
				{@render icon()}
			</div>
			{#if sidebarOpen}
				<span class="overflow-hidden text-ellipsis whitespace-nowrap">
					{label}
				</span>
			{/if}
		</div>

		{#if sidebarOpen}
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

	{#if isOpen && sidebarOpen}
		<ul transition:slide={{ duration: 300 }} class="mt-1 space-y-1 overflow-hidden transition-all">
			{@render children()}
		</ul>
	{/if}
</li>
