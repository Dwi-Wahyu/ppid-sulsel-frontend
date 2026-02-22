<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		options?: any[];
		value?: string | number;
		placeholder?: string;
		name?: string;
		required?: boolean;
		idKey?: string;
		labelKey?: string;
		extraClass?: string;
	}

	let {
		options = [],
		value = $bindable(''),
		placeholder = 'Pilih...',
		name = '',
		required = false,
		idKey = 'id',
		labelKey = 'label',
		extraClass = ''
	}: Props = $props();

	let isOpen = $state(false);
	let searchTerm = $state('');
	let highlightedIndex = $state(0);

	// Perbaikan tipe data untuk bind:this
	let buttonRef = $state<HTMLButtonElement | null>(null);
	let dropdownRef = $state<HTMLDivElement | null>(null);

	const dispatch = createEventDispatcher();

	// Svelte 5: $derived tidak butuh fungsi pembungkus () => jika ingin langsung diakses
	let filteredOptions = $derived(
		searchTerm
			? options.filter((opt) => opt[labelKey].toLowerCase().includes(searchTerm.toLowerCase()))
			: options
	);

	let selectedLabel = $derived(() => {
		const selected = options.find((opt) => opt[idKey] === value);
		return selected ? selected[labelKey] : placeholder;
	});

	function toggleDropdown() {
		isOpen = !isOpen;
		if (isOpen) {
			searchTerm = '';
			highlightedIndex = 0;
		}
	}

	function selectOption(option: any) {
		value = option[idKey];
		isOpen = false;
		dispatch('change', { value: option[idKey], option });
	}

	// Perbaikan tipe data event KeyboardEvent
	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				highlightedIndex = Math.max(highlightedIndex - 1, 0);
				break;
			case 'Enter':
				e.preventDefault();
				if (filteredOptions[highlightedIndex]) {
					selectOption(filteredOptions[highlightedIndex]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				isOpen = false;
				break;
		}
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as Node;
		if (buttonRef && dropdownRef && !buttonRef.contains(target) && !dropdownRef.contains(target)) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<div class="relative" onkeydown={handleKeydown} role="none">
	<input type="hidden" {name} {value} {required} />

	<button
		type="button"
		bind:this={buttonRef}
		onclick={toggleDropdown}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		class={`flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-gray-700 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-gray-300 ${extraClass}`}
	>
		<span class:text-gray-400={!value}>{selectedLabel()}</span>
		<svg
			class="h-5 w-5 transition-transform"
			class:rotate-180={isOpen}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			bind:this={dropdownRef}
			class="absolute z-50 mt-2 max-h-80 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="border-b border-gray-200 p-2 dark:border-slate-700">
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Cari..."
					class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
				/>
			</div>

			<div class="max-h-64 overflow-y-auto" role="listbox">
				{#each filteredOptions as option, index (option[idKey])}
					<button
						type="button"
						role="option"
						aria-selected={value === option[idKey]}
						onclick={() => selectOption(option)}
						class="w-full px-4 py-2.5 text-left transition-colors hover:bg-ppid-primary/10 dark:hover:bg-ppid-primary/20 {index ===
						highlightedIndex
							? 'bg-ppid-primary/5'
							: ''} {value === option[idKey] ? 'font-semibold text-ppid-primary' : ''}"
					>
						{option[labelKey]}
					</button>
				{:else}
					<div class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
						Tidak ada hasil ditemukan
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
