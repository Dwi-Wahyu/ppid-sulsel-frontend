<script>
	import * as m from '$lib/paraglide/messages.js';

	/**
	 * @typedef {Object} BreadcrumbItem
	 * @property {string} label - Translation key or direct label
	 * @property {string} [href] - Optional link, if omitted item is treated as current page
	 */

	/** @type {{ items: BreadcrumbItem[] }} */
	let { items = [] } = $props();
</script>

<nav
	aria-label="Breadcrumb"
	class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
>
	<!-- Home Icon -->
	<a href="/" class="transition-colors hover:text-ppid-primary dark:text-white" aria-label="Home">
		<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
			<path
				d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
			></path>
		</svg>
	</a>

	{#each items as item, index}
		<!-- Separator -->
		<svg
			class="h-4 w-4 text-gray-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
		</svg>

		{#if item.href}
			<!-- Link Item -->
			<a href={item.href} class="transition-colors hover:text-ppid-primary dark:text-white">
				{m[item.label] ? m[item.label]() : item.label}
			</a>
		{:else}
			<!-- Current Page -->
			<span class="font-medium text-ppid-primary dark:text-white">
				{m[item.label] ? m[item.label]() : item.label}
			</span>
		{/if}
	{/each}
</nav>
