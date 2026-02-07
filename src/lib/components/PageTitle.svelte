<script>
	/**
	 * @typedef {Object} PageTitleProps
	 * @property {string} title - Main title text
	 * @property {string} [subtitle] - Optional subtitle text
	 */

	/** @type {PageTitleProps} */
	let { title, subtitle = '' } = $props();
</script>

<div class="flex items-end justify-between">
	<div>
		<h1
			class="mb-2 text-3xl leading-tight font-extrabold text-ppid-primary md:text-4xl dark:text-white"
		>
			{title}
		</h1>
		{#if subtitle}
			<p class="mt-2 text-base text-gray-600 md:text-lg dark:text-gray-300">
				{subtitle}
			</p>
		{/if}
	</div>
	<div class="hidden md:block">
		<div class="h-1 w-20 rounded-full bg-gradient-to-r from-ppid-primary to-transparent"></div>
	</div>
</div>
