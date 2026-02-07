<div
	class="content container mx-auto space-y-8 p-8 transition-colors duration-300 dark:bg-page-bg-dark dark:text-white"
>
	<h1 class="text-4xl font-bold text-ppid-primary dark:text-ppid-accent">Welcome to SvelteKit</h1>
	<p class="text-lg">
		Visit <a
			href="https://svelte.dev/docs/kit"
			class="font-semibold text-ppid-primary underline hover:text-ppid-primary-hover dark:text-ppid-accent"
			>svelte.dev/docs/kit</a
		> to read the documentation
	</p>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="rounded-2xl border border-gray-200 p-6 shadow-sm dark:border-ppid-primary-light">
			<h2 class="mb-4 text-2xl font-semibold text-ppid-primary dark:text-ppid-accent">
				Accessibility Test Area
			</h2>
			<p class="text-ppid-text-light dark:text-gray-300">
				This paragraph can be used to test text alignment, contrast, and font changes. The
				accessibility menu allows you to modify the look and feel of the site to suit your needs.
			</p>
			<h3 class="mt-4 mb-2 text-xl font-medium">Sample List</h3>
			<ul class="list-disc space-y-2 pl-5">
				<li>First item to talk about</li>
				<li>Second item with more text</li>
				<li>Third item for speech mode</li>
			</ul>
			<a
				href="/demo/paraglide"
				class="mt-4 inline-block rounded bg-ppid-primary px-4 py-2 text-white transition-colors hover:bg-ppid-primary-hover"
			>
				Paraglide Demo
			</a>
		</div>

		<div class="rounded-2xl border border-gray-200 p-6 shadow-sm dark:border-ppid-primary-light">
			<h2 class="mb-4 text-2xl font-semibold text-ppid-primary dark:text-ppid-accent">
				Image Visibility Test
			</h2>
			<img
				src="https://picsum.photos/600/400"
				alt="Random placeholder"
				class="rounded-lg shadow-md"
			/>
			<p class="mt-2 text-sm text-gray-600 italic dark:text-gray-400">
				This image should hide when "Hide Images" is enabled.
			</p>
		</div>
	</div>
</div>
