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
	class="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
>
	<!-- Home Icon -->
	<a
		title={m['breadcrumb.home']()}
		href="/"
		class="transition-colors hover:text-ppid-primary dark:text-white"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-4 w-4"
		>
			<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline
				points="9 22 9 12 15 12 15 22"
			/>
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
