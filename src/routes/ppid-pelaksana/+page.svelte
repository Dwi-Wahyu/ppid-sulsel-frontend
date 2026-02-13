<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();

	let searchQuery = $state(data.search || '');
	let loading = $state(false);

	async function performSearch() {
		const params = new URLSearchParams();
		if (searchQuery) params.append('search', searchQuery);
		goto(`?${params.toString()}`, { noScroll: true });
	}

	function changePage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`?${params.toString()}`, { noScroll: true });
	}
</script>

<svelte:head>
	<title>{m['ppid_pel.title_meta']()}</title>
</svelte:head>

<!-- Breadcrumb + Title Section -->
<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-8">
		<!-- Breadcrumb -->
		<div class="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
			<a href="/" class="transition-colors hover:text-ppid-primary dark:hover:text-white">
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
					<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					<polyline points="9 22 9 12 15 12 15 22" />
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
			<span class="font-medium text-ppid-primary dark:text-white"
				>{m['menu.profile_dropdown']()}</span
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
				class="h-4 w-4 text-gray-400"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
			<span class="font-bold text-ppid-primary dark:text-white"
				>{m['breadcrumb.ppid_pelaksana']()}</span
			>
		</div>

		<!-- Title -->
		<div class="flex items-end justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-ppid-primary md:text-4xl dark:text-white">
					{m['ppid_pelaksana.title']()}
				</h1>
				<p class="text-gray-600 dark:text-gray-300">
					{m['ppid_pel.subtitle']()}
				</p>
			</div>
			<div class="hidden md:block">
				<div class="h-1.5 w-24 rounded-full bg-linear-to-r from-ppid-primary to-ppid-accent"></div>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<main class="bg-gray-50 py-12 font-['Plus_Jakarta_Sans'] md:py-20 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-7xl">
			<!-- Search Bar -->
			<div class="mb-12">
				<form
					onsubmit={(e) => {
						e.preventDefault();
						performSearch();
					}}
					class="mx-auto max-w-2xl"
				>
					<div
						class="relative rounded-xl border-2 border-ppid-primary/20 bg-white shadow-lg transition-all duration-300 hover:border-ppid-accent/50 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
					>
						<div class="flex items-center gap-2 p-2">
							<input
								type="text"
								bind:value={searchQuery}
								placeholder={m['ppid_pel.search_placeholder']()}
								class="flex-1 border-0 bg-transparent px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-500"
							/>
							<button
								type="submit"
								disabled={loading}
								class="flex items-center gap-2 rounded-lg bg-ppid-primary px-5 py-3 font-medium text-white shadow-md transition-all duration-300 hover:bg-ppid-accent hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
							>
								{#if loading}
									<span>...</span>
									<div
										class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
								{:else}
									<span>{m['public_info.search_btn']()}</span>
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
									>
										<circle cx="11" cy="11" r="8" />
										<path d="m21 21-4.3-4.3" />
									</svg>
								{/if}
							</button>
						</div>
					</div>
				</form>
			</div>

			<!-- Empty State -->
			{#if data.skpds.length === 0}
				<div
					class="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-slate-600 dark:bg-slate-700/50"
				>
					<p class="mb-4 text-5xl">🔍</p>
					<p class="mb-1 font-medium text-gray-700 dark:text-gray-300">
						{m['ppid_pel.no_result']()}
					</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{m['ppid_pel.try_other_keyword']()}
					</p>
				</div>
			{/if}

			<!-- SKPD Cards Grid -->
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each data.skpds as skpd}
					<a
						href="/ppid-pelaksana/{skpd.id_skpd}"
						class="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-ppid-accent hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800"
					>
						<!-- Gradient Overlay on Hover -->
						<div
							class="pointer-events-none absolute inset-0 bg-linear-to-br from-ppid-primary/0 via-transparent to-ppid-accent/0 transition-all duration-500 group-hover:from-ppid-primary/5 group-hover:to-ppid-accent/5"
						></div>

						<!-- Top Accent Line -->
						<div
							class="absolute top-0 right-0 left-0 h-1.5 origin-center scale-x-0 transform bg-linear-to-r from-ppid-primary via-ppid-accent to-ppid-primary transition-transform duration-500 group-hover:scale-x-100"
						></div>

						<!-- Logo with Animated Ring -->
						<div
							class="relative mx-auto mb-6 h-24 w-24 shrink-0 transform transition-transform duration-500 group-hover:scale-105"
						>
							<div
								class="absolute inset-0 rounded-full bg-linear-to-br from-ppid-primary to-ppid-accent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10 dark:group-hover:opacity-30"
							></div>
							<div
								class="relative flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-white shadow-lg transition-colors duration-300 group-hover:border-ppid-accent/30 dark:border-slate-600 dark:bg-slate-700"
							>
								<img
									src={skpd.logo
										? `${PUBLIC_API_URL}/storage/logo-skpd/${skpd.logo}`
										: '/images/logo-sulsel.png'}
									alt="Logo {skpd.nm_skpd}"
									class="h-14 w-14 object-contain"
								/>
							</div>
						</div>

						<!-- Content -->
						<div class="flex flex-grow flex-col space-y-4 text-center">
							<!-- Name -->
							<div class="flex min-h-[3.5rem] items-center justify-center">
								<h3
									class="text-lg leading-tight font-bold text-ppid-primary transition-colors duration-300 group-hover:text-ppid-accent md:text-xl dark:text-white"
								>
									{skpd.nm_skpd}
								</h3>
							</div>

							<!-- Divider -->
							<div
								class="mx-auto h-1 w-12 shrink-0 rounded-full bg-linear-to-r from-ppid-primary to-ppid-accent opacity-50 transition-opacity group-hover:opacity-100"
							></div>

							<!-- Info Grid -->
							<div class="grid flex-grow grid-cols-1 gap-3 pt-2">
								<!-- Address -->
								<div
									class="flex items-start justify-center gap-2 text-sm text-gray-600 dark:text-gray-300"
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
										class="mt-0.5 shrink-0 text-ppid-accent"
									>
										<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
										<circle cx="12" cy="10" r="3" />
									</svg>
									<span class="line-clamp-2 text-left">
										{skpd.alamat || m['ppid_pel.address_unavailable']()}
									</span>
								</div>
							</div>

							<!-- Actions -->
							<div class="mt-auto pt-4">
								<div
									class="inline-flex items-center gap-2 rounded-full bg-ppid-primary/5 px-4 py-2 text-sm font-bold text-ppid-primary transition-all duration-300 group-hover:bg-ppid-primary group-hover:text-white dark:bg-ppid-accent/10 dark:text-ppid-accent dark:group-hover:text-white"
								>
									{m['common.view_detail']()}
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
										class="transition-transform group-hover:translate-x-1"
									>
										<path d="M5 12h14" />
										<path d="m12 5 7 7-7 7" />
									</svg>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Pagination Buttons -->
			{#if data.pagination.last_page > 1}
				<div class="mt-12 flex justify-center gap-4">
					<button
						onclick={() => changePage(data.pagination.current_page - 1)}
						disabled={data.pagination.current_page === 1}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
					>
						&laquo; {m['common.prev']()}
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
