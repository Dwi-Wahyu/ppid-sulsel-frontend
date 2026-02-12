<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import * as m from '$lib/paraglide/messages.js';
	import { fade } from 'svelte/transition';

	// Types
	interface NewsItem {
		id: number;
		title: string;
		image: string | null;
		slug: string;
		date: string;
		category: string | null;
	}

	// State (Svelte 5 Runes)
	let news = $state<NewsItem[]>([]);
	let isLoading = $state(true);

	// Fetch Data
	async function fetchLatestNews() {
		try {
			const response = await fetch(`${env.PUBLIC_API_URL}/public/berita/latest`);
			const result = await response.json();

			console.log('Data diterima:', result);

			/** * PERBAIKAN:
			 * Contoh output Anda tidak memiliki properti 'success'.
			 * Langsung cek keberadaan 'result.data'
			 */
			if (result && result.data) {
				news = result.data;
			}
		} catch (error) {
			console.error('Gagal memuat berita:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchLatestNews();
	});

	function formatDate(dateString: string) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<section class="bg-white py-16 font-['Plus_Jakarta_Sans'] dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mb-12 flex items-end justify-between">
			<div>
				<h2
					class="text-3xl font-black tracking-tight text-slate-800 uppercase md:text-4xl dark:text-white"
				>
					{m['news.latest_title']()}
				</h2>
				<p class="mt-2 font-medium text-slate-500 dark:text-slate-400">
					{m['news.latest_desc']()}
				</p>
			</div>
			<a
				href="/berita"
				class="hidden text-sm font-black tracking-widest text-blue-700 uppercase hover:underline md:block dark:text-blue-400"
			>
				{m['news.view_all_news']()}
			</a>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#if isLoading}
				{#each Array(3) as _}
					<div class="h-96 animate-pulse rounded-4xl bg-slate-100 dark:bg-slate-800"></div>
				{/each}
			{:else if news.length > 0}
				{#each news as item, index (item.id)}
					<article
						in:fade
						class="group flex flex-col overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-xs transition-all hover:border-blue-100 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-800"
					>
						<div class="relative aspect-video overflow-hidden">
							<img
								src={item.image
									? `${env.PUBLIC_API_URL.replace('/api', '')}/storage/berita/${item.image}`
									: '/img/placeholder-news.jpg'}
								alt={item.title}
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>
							{#if item.category}
								<div class="absolute top-4 left-4">
									<span
										class="rounded-xl bg-blue-700/90 px-4 py-1.5 text-[10px] font-black tracking-widest text-white uppercase shadow-lg backdrop-blur-sm"
									>
										{item.category}
									</span>
								</div>
							{/if}
						</div>

						<div class="flex flex-1 flex-col p-8">
							<time class="mb-3 text-xs font-black tracking-widest text-slate-400 uppercase">
								{formatDate(item.date)}
							</time>
							<h3
								class="mb-6 line-clamp-2 text-xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400"
							>
								<a href="/berita/{item.slug}">{item.title}</a>
							</h3>

							<div class="mt-auto">
								<a
									href="/berita/{item.slug}"
									class="group/link inline-flex items-center gap-2 text-xs font-black tracking-widest text-blue-700 uppercase dark:text-blue-400"
								>
									<span>{m['news.read_more']()}</span>
									<svg
										class="h-4 w-4 transition-transform group-hover/link:translate-x-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="3"
									>
										<path d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</a>
							</div>
						</div>
					</article>
				{/each}
			{:else}
				<div class="col-span-full py-20 text-center">
					<p class="font-medium text-slate-400 italic">
						Belum ada berita terbaru untuk ditampilkan.
					</p>
				</div>
			{/if}
		</div>

		<div class="mt-12 text-center md:hidden">
			<a
				href="/berita"
				class="inline-block rounded-2xl bg-blue-700 px-10 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-blue-700/30"
			>
				{m['news.view_all_button']()}
			</a>
		</div>
	</div>
</section>
