<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state'; // Menggunakan state di Svelte 5
	import { PUBLIC_API_URL } from '$env/static/public';
	import * as m from '$lib/paraglide/messages.js';

	// --- Type Definitions ---
	interface Skpd {
		id: string;
		name: string;
	}

	interface NewsDetail {
		id: number;
		title: string;
		slug: string;
		content: string;
		image: string | null;
		viewers: number;
		date: string;
		category: Skpd | null;
	}

	interface RecentNews {
		id: number;
		title: string;
		slug: string;
		date: string;
		category: string | null;
	}

	// --- States (Svelte 5) ---
	let loading = $state(true);
	let error = $state<string | null>(null);
	let news = $state<NewsDetail | null>(null);
	let recent_news = $state<RecentNews[]>([]);
	let categories = $state<{ id: string; name: string; count: number }[]>([]);

	// Ambil slug secara reaktif dari URL
	const slug = $derived(page.params.slug);

	// --- Actions ---
	async function fetchDetail() {
		loading = true;
		error = null;
		try {
			// Fetch detail berita berdasarkan slug
			const response = await fetch(`${PUBLIC_API_URL}/public/berita/${slug}`);
			if (!response.ok) throw new Error('Berita tidak ditemukan');

			const res = await response.json();
			if (res.success) {
				news = res.data;
				// Jika API mengirimkan data tambahan di response yang sama
				recent_news = res.recent || [];
				categories = res.categories || [];
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	// Reload data jika slug berubah (navigasi antar berita)
	$effect(() => {
		if (slug) fetchDetail();
	});
</script>

<nav aria-label="Breadcrumb" class="bg-slate-50 pt-8 pb-4 transition-colors dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
			<a
				href="/"
				class="flex items-center gap-1.5 hover:text-ppid-primary dark:hover:text-ppid-accent"
			>
				{m['common.home']()}
			</a>
			<span class="text-slate-400" aria-hidden="true">/</span>
			<a href="/berita" class="hover:text-ppid-primary dark:hover:text-ppid-accent"
				>{m['common.news']()}</a
			>
			<span class="text-slate-400" aria-hidden="true">/</span>
			<span
				class="max-w-[200px] truncate font-semibold text-ppid-primary md:max-w-none dark:text-ppid-accent"
				aria-current="page"
			>
				{news?.title || 'Loading...'}
			</span>
		</div>
	</div>
</nav>

<div class="min-h-screen bg-slate-50 pb-16 font-sans transition-colors dark:bg-slate-900">
	<div class="container mx-auto px-4">
		{#if loading}
			<div class="flex animate-pulse flex-col gap-8 lg:flex-row">
				<div class="lg:w-2/3">
					<div class="mb-6 h-12 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
					<div class="mb-8 h-96 w-full rounded-xl bg-slate-200 dark:bg-slate-800"></div>
					<div class="space-y-4">
						<div class="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
						<div class="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
						<div class="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800"></div>
					</div>
				</div>
			</div>
		{:else if error || !news}
			<div class="py-20 text-center">
				<h1 class="mb-4 text-2xl font-bold text-slate-800 dark:text-white">
					Oops! Berita tidak ditemukan.
				</h1>
				<a href="/berita" class="font-bold text-ppid-accent hover:underline"
					>Kembali ke daftar berita</a
				>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
				<main class="lg:col-span-8">
					<article>
						<header class="mb-8">
							<div class="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
								<a
									href="/berita?category={news.category?.id}"
									class="rounded-full bg-ppid-primary px-4 py-1 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-ppid-accent"
								>
									{news.category?.name || 'Umum'}
								</a>
								<time datetime={news.date} class="flex items-center gap-1">
									<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/></svg
									>
									{formatDate(news.date)}
								</time>
								<span class="flex items-center gap-1">
									<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/></svg
									>
									{news.viewers.toLocaleString()} views
								</span>
							</div>

							<h1
								class="mb-8 text-3xl leading-tight font-extrabold text-slate-900 md:text-4xl lg:text-5xl dark:text-white"
							>
								{news.title}
							</h1>

							<figure
								class="mb-8 overflow-hidden rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none"
							>
								{#if news.image}
									<img src={news.image} class="aspect-video w-full object-cover" alt={news.title} />
								{:else}
									<div
										class="flex aspect-video w-full items-center justify-center bg-slate-200 dark:bg-slate-800"
									>
										<svg
											class="size-20 text-slate-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="1.5"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/></svg
										>
									</div>
								{/if}
							</figure>
						</header>

						<section
							class="prose prose-lg max-w-none text-justify leading-relaxed prose-slate dark:prose-invert prose-headings:text-ppid-primary prose-a:text-ppid-accent"
						>
							{@html news.content}
						</section>

						<footer class="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
							<div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
								<div class="flex items-center gap-2">
									<span class="text-sm font-bold text-slate-700 dark:text-slate-300">Share:</span>
									<div class="flex gap-2">
										<button
											class="flex size-9 items-center justify-center rounded-full bg-blue-600 text-white transition-opacity hover:opacity-90"
											aria-label="Share on Facebook"
										>
											<svg class="size-5" fill="currentColor" viewBox="0 0 24 24"
												><path
													d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
												/></svg
											>
										</button>
										<button
											class="flex size-9 items-center justify-center rounded-full bg-green-500 text-white transition-opacity hover:opacity-90"
											aria-label="Share on WhatsApp"
										>
											<svg class="size-5" fill="currentColor" viewBox="0 0 24 24"
												><path
													d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
												/></svg
											>
										</button>
									</div>
								</div>
								<a
									href="/berita"
									class="flex items-center gap-1 text-sm font-bold text-ppid-primary hover:underline dark:text-ppid-accent"
								>
									<svg
										class="size-4 rotate-180"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg
									>
									Lihat Berita Lainnya
								</a>
							</div>
						</footer>
					</article>
				</main>

				<aside class="space-y-8 lg:col-span-4">
					<section
						class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800"
						aria-labelledby="recent-title"
					>
						<h2
							id="recent-title"
							class="mb-6 flex items-center gap-2 text-lg font-bold text-ppid-primary dark:text-white"
						>
							<span class="h-6 w-1 rounded-full bg-ppid-accent" aria-hidden="true"></span>
							Berita Terbaru
						</h2>
						<div class="space-y-6">
							{#each recent_news as item}
								<a href="/berita/{item.slug}" class="group block">
									<p class="mb-1 text-[10px] font-bold text-ppid-accent uppercase">
										{item.category || 'Berita'}
									</p>
									<h3
										class="line-clamp-2 text-sm leading-snug font-bold transition-colors group-hover:text-ppid-primary dark:text-slate-200 dark:group-hover:text-ppid-accent"
									>
										{item.title}
									</h3>
									<p class="mt-2 text-xs text-slate-400">{formatDate(item.date)}</p>
								</a>
							{/each}
						</div>
					</section>

					<section
						class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800"
						aria-labelledby="cat-title"
					>
						<h2
							id="cat-title"
							class="mb-5 flex items-center gap-2 text-lg font-bold text-ppid-primary dark:text-white"
						>
							<span class="h-6 w-1 rounded-full bg-ppid-accent" aria-hidden="true"></span>
							Kategori
						</h2>
						<div class="flex flex-wrap gap-2">
							{#each categories as cat}
								<a
									href="/berita?category={cat.id}"
									class="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:bg-ppid-primary hover:text-white dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-700"
								>
									{cat.name} ({cat.count})
								</a>
							{/each}
						</div>
					</section>
				</aside>
			</div>
		{/if}
	</div>
</div>
