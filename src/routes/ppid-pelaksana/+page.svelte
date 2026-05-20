<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getImageUrl } from '$lib/get-image-url';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();

	let searchQuery = $state(data.search || '');

	function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		const url = new URL($page.url);
		url.searchParams.set('search', searchQuery);
		url.searchParams.set('page', '1');
		goto(url.toString());
	}

	function changePage(newPage: number) {
		const url = new URL($page.url);
		url.searchParams.set('page', newPage.toString());
		goto(url.toString());
	}
</script>

<svelte:head>
	<title>{m['ppid_pel.title']()} - PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 dark:bg-slate-900">
	<!-- Hero Section -->
	<div class="relative overflow-hidden bg-ppid-primary py-24 text-white">
		<div class="container relative z-10 mx-auto px-4">
			<div class="max-w-3xl">
				<h1 class="mb-6 text-4xl font-black md:text-6xl">
					{m['ppid_pel.hero_title']()}
				</h1>
				<p class="text-lg text-white/80 md:text-xl">
					{m['ppid_pel.hero_desc']()}
				</p>
			</div>
		</div>

		<!-- Decorative Elements -->
		<div
			class="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-ppid-accent/20 blur-3xl"
			aria-hidden="true"
		></div>
		<div
			class="absolute top-10 right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
			aria-hidden="true"
		></div>
	</div>

	<!-- Content Section -->
	<div class="container mx-auto -mt-12 px-4 pb-20">
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-800">
			<!-- Search & Filter -->
			<div class="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div class="flex-1">
					<form onsubmit={handleSearch} class="relative max-w-md">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder={m['ppid_pel.search_placeholder']()}
							class="w-full rounded-2xl border-none bg-slate-50 py-4 pr-12 pl-6 shadow-inner ring-2 ring-transparent transition-all focus:ring-ppid-primary/20 dark:bg-slate-900 dark:text-white"
						/>
						<button
							type="submit"
							class="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-ppid-primary"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>
					</form>
				</div>

				<div class="text-sm font-bold text-slate-400 uppercase tracking-widest">
					Total: {data.pagination.total} {m['ppid_pel.total_instansi']()}
				</div>
			</div>

			<!-- SKPD Grid -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each data.skpds as skpd}
					<a
						href="/ppid-pelaksana/{skpd.id_skpd}"
						class="group flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-6 text-center transition-all duration-300 hover:border-ppid-primary/20 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/50"
					>
						<div class="relative mb-6 h-24 w-24">
							<div
								class="absolute inset-0 animate-pulse rounded-full bg-ppid-primary/5 group-hover:scale-110 group-hover:bg-ppid-primary/10 transition-all duration-300"
							></div>
							<div
								class="relative flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-white shadow-lg transition-colors duration-300 group-hover:border-ppid-accent/30 dark:border-slate-600 dark:bg-slate-700"
							>
								<img
									src={skpd.logo
										? getImageUrl(`logo-skpd/${skpd.logo}`)
										: '/images/logo-sulsel.png'}
									alt="Logo {skpd.nm_skpd}"
									class="h-14 w-14 object-contain"
								/>
							</div>
						</div>

						<h3
							class="mb-2 line-clamp-2 text-lg font-bold text-slate-800 transition-colors group-hover:text-ppid-primary dark:text-white"
						>
							{skpd.nm_skpd}
						</h3>

						<div
							class="mt-auto flex items-center text-xs font-bold text-slate-400 uppercase tracking-tighter"
						>
							<span>{m['ppid_pel.view_profile']()}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								/>
							</svg>
						</div>
					</a>
				{/each}
			</div>

			<!-- Empty State -->
			{#if data.skpds.length === 0}
				<div class="py-20 text-center">
					<div
						class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-10 w-10 text-slate-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8h4m-4 4h4m-4 4h4"
							/>
						</svg>
					</div>
					<p class="text-xl font-medium text-slate-400">{m['ppid_pel.no_data']()}</p>
				</div>
			{/if}

			<!-- Pagination -->
			{#if data.pagination.last_page > 1}
				<div class="mt-12 flex items-center justify-center gap-2">
					<button
						onclick={() => changePage(data.pagination.current_page - 1)}
						disabled={data.pagination.current_page === 1}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
					>
						&laquo; {m['common.previous']()}
					</button>

					<span class="px-4 py-2 text-gray-600 dark:text-gray-300">
						{m['ppid_pel.page']()}
						{data.pagination.current_page}
						{m['common.from']()}
						{data.pagination.last_page}
					</span>

					<button
						onclick={() => changePage(data.pagination.current_page + 1)}
						disabled={data.pagination.current_page === data.pagination.last_page}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
					>
						{m['common.next']()} &raquo;
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>
