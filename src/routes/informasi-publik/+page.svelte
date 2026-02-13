<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';

	// Mengambil props data dari SvelteKit
	let { data } = $props();

	// State untuk input pencarian
	let searchQuery = $state('');

	// Ini memastikan jika user klik "Back" atau "Clear", input ikut ter-update
	$effect(() => {
		searchQuery = data.matriksData.filters.search || '';
	});

	let matriks = $derived(data.matriksData.data.data);
	let pagination = $derived(data.matriksData.data);
	let filters = $derived(data.matriksData.filters);

	async function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		const params = new URLSearchParams(page.url.searchParams);
		if (searchQuery) {
			params.set('search', searchQuery);
		} else {
			params.delete('search');
		}
		params.set('page', '1');

		await goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	function handlePageChange(url: string | null) {
		if (!url) return;
		const targetUrl = new URL(url);
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', targetUrl.searchParams.get('page') || '1');
		goto(`?${params.toString()}`);
	}
</script>

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<nav class="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
			<a
				href="/"
				title="Kembali ke beranda"
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
				class="h-4 w-4 text-gray-400"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
			<span class="font-medium text-ppid-primary dark:text-white">{m['public_info.title']()}</span>
		</nav>

		<div class="flex items-end justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-ppid-primary md:text-4xl dark:text-white">
					{m['public_info.title']()}
				</h1>
				<p class="text-gray-600 dark:text-gray-300">
					{m['public_info.desc']()}
				</p>
			</div>
			<div class="hidden md:block">
				<div class="h-1 w-20 rounded-full bg-linear-to-r from-ppid-primary to-transparent"></div>
			</div>
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-7xl">
			<form onsubmit={handleSearch} class="mb-6 flex gap-4">
				<div class="relative flex-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
					>
						<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
					</svg>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder={m['public_info.search_placeholder_general']()}
						class="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 focus:ring-2 focus:ring-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
					/>
				</div>
				<div class="flex gap-2">
					<button
						type="submit"
						class="hover:bg-opacity-90 rounded-lg bg-ppid-accent px-6 py-2 font-semibold text-white transition-colors"
					>
						{m['public_info.search_btn'] ? m['public_info.search_btn']() : 'Cari'}
					</button>
					{#if filters.search}
						<a
							href={page.url.pathname}
							class="flex items-center justify-center rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200"
						>
							{m['public_info.clear_btn']()}
						</a>
					{/if}
				</div>
			</form>

			<div
				class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="overflow-x-auto">
					<table class="w-full border-collapse text-left">
						<thead class="bg-ppid-primary text-white">
							<tr>
								<th class="px-4 py-3 text-xs font-semibold tracking-wider uppercase"
									>{m['public_info.table.no']()}</th
								>
								<th class="px-4 py-3 text-xs font-semibold tracking-wider uppercase"
									>{m['public_info.table.info']()}</th
								>
								<th class="px-4 py-3 text-xs font-semibold tracking-wider uppercase"
									>{m['public_info.table.summary']()}</th
								>
								<th class="px-4 py-3 text-xs font-semibold tracking-wider uppercase"
									>{m['public_info.table.official']()}</th
								>
								<th class="px-4 py-3 text-xs font-semibold tracking-wider uppercase"
									>{m['public_info.table.format']()}</th
								>
								<th class="px-4 py-3 text-xs font-semibold tracking-wider uppercase"
									>{m['public_info.table.action']()}</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100 dark:divide-slate-700">
							{#each matriks as item, i (item.id)}
								<tr class="transition-colors hover:bg-ppid-primary/5 dark:hover:bg-slate-700/50">
									<td class="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">
										{(pagination.current_page - 1) * pagination.per_page + i + 1}
									</td>
									<td
										class="min-w-50 px-4 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
										>{item.a}</td
									>
									<td class="min-w-62.5 px-4 py-4 text-sm text-gray-600 dark:text-gray-300"
										>{item.b}</td
									>
									<td class="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{item.c}</td>
									<td class="px-4 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300"
										>{item.f}</td
									>
									<td class="px-4 py-4 text-sm">
										<a
											href={item.h}
											target="_blank"
											class="font-medium text-ppid-primary hover:underline dark:text-blue-400"
										>
											{m['public_info.view']()}
										</a>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="6" class="py-20 text-center text-gray-500">
										{m['public_info.no_data']()}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div
					class="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900"
				>
					<div class="flex flex-wrap justify-center gap-2">
						{#each pagination.links as link}
							<button
								onclick={() => handlePageChange(link.url)}
								disabled={!link.url || link.active}
								class="rounded-md border px-4 py-1.5 text-sm font-medium transition-all
								{link.active
									? 'border-ppid-primary bg-ppid-primary text-white shadow-md'
									: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200'}"
							>
								{@html link.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
