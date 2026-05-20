<script lang="ts">
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { fade } from 'svelte/transition';
	import { getImageUrl } from '$lib/get-image-url';
	import { api } from '$lib/api';

	// Types
	interface NewsItem {
		id: number;
		title: string;
		slug: string;
		image: string | null;
		date: string;
		category: string;
	}

	// State using Svelte 5 Runes
	let news = $state<NewsItem[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			const res = await api.get('/public/berita/latest');
			if (res.success) {
				news = res.data;
			}
		} catch (error) {
			console.error('Failed to fetch news:', error);
		} finally {
			isLoading = false;
		}
	});

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};
</script>

<section class="bg-white py-24 transition-colors dark:bg-slate-900" id="latest-news">
	<div class="container mx-auto px-4">
		<!-- Section Header -->
		<div class="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
			<div class="max-w-2xl text-center md:text-left">
				<span
					class="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-widest text-blue-600 uppercase dark:bg-blue-900/30 dark:text-blue-400"
				>
					{m['news.badge']()}
				</span>
				<h2 class="text-4xl font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">
					{m['news.title']()}
				</h2>
				<p class="mt-4 text-lg text-slate-600 dark:text-slate-400">
					{m['news.description']()}
				</p>
			</div>

			<div class="hidden md:block">
				<a
					href="/berita"
					class="group flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-ppid-primary hover:shadow-xl hover:shadow-ppid-primary/20 dark:bg-slate-800"
				>
					{m['news.view_all_button']()}
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						class="transition-transform group-hover:translate-x-1"
					>
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
				</a>
			</div>
		</div>

		<!-- News Grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#if isLoading}
				{#each Array(3) as _}
					<div class="animate-pulse space-y-4">
						<div class="aspect-video rounded-4xl bg-slate-100 dark:bg-slate-800"></div>
						<div class="h-6 w-3/4 rounded bg-slate-100 dark:bg-slate-800"></div>
						<div class="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-800"></div>
					</div>
				{/each}
			{:else}
				{#each news as item, i}
					<div in:fade={{ delay: i * 100, duration: 800 }}>
						<a
							href="/berita/{item.slug}"
							class="group flex h-full flex-col overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-xs transition-all hover:border-blue-100 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-800"
						>
							<div class="relative aspect-video overflow-hidden">
								<img
									src={item.image ? getImageUrl(`berita/${item.image}`) : '/img/placeholder-news.jpg'}
									alt={item.title}
									class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								<div
									class="absolute top-4 left-4 rounded-xl bg-white/90 px-3 py-1 text-[10px] font-black tracking-widest text-slate-900 uppercase backdrop-blur-md dark:bg-slate-900/90 dark:text-white"
								>
									{item.category}
								</div>
							</div>

							<div class="flex flex-1 flex-col p-8">
								<time class="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">
									{formatDate(item.date)}
								</time>
								<h3
									class="mb-4 line-clamp-2 text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white"
								>
									{item.title}
								</h3>
								<div
									class="mt-auto flex items-center gap-2 text-sm font-black tracking-widest text-ppid-accent uppercase group-hover:underline"
								>
									{m['news.read_more']()}
									<svg
										class="h-4 w-4 transition-transform group-hover:translate-x-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="3"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</div>
						</a>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Mobile View All Button -->
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
