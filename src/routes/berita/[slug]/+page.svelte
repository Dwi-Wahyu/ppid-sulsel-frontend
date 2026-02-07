<script>
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import * as m from '$lib/paraglide/messages.js';

	// Get slug from URL params
	let slug = $derived($page.params.slug);

	// Mock categories
	let categories = $state([
		{ id_skpd: '1', nm_skpd: 'Pemerintahan', berita_count: 25 },
		{ id_skpd: '2', nm_skpd: 'Kesehatan', berita_count: 18 },
		{ id_skpd: '3', nm_skpd: 'Pendidikan', berita_count: 32 },
		{ id_skpd: '4', nm_skpd: 'Infrastruktur', berita_count: 15 }
	]);

	// Mock news data
	let berita = $state({
		id_berita: 1,
		slug: slug,
		judul: 'Pemerintah Provinsi Sulawesi Selatan Luncurkan Program Transformasi Digital 2026',
		deskripsi: `
			<p>Makassar - Gubernur Sulawesi Selatan resmi meluncurkan Program Transformasi Digital 2026 yang bertujuan untuk meningkatkan kualitas layanan publik melalui pemanfaatan teknologi informasi.</p>
			<p>Dalam sambutannya, Gubernur menekankan pentingnya transformasi digital sebagai upaya meningkatkan efisiensi dan transparansi pemerintahan. "Program ini akan mengintegrasikan seluruh layanan publik ke dalam satu platform digital yang mudah diakses masyarakat," ujarnya.</p>
			<h3>Fitur Utama Program</h3>
			<p>Program Transformasi Digital 2026 mencakup beberapa fitur unggulan:</p>
			<ul>
				<li>Portal layanan publik terintegrasi</li>
				<li>Aplikasi mobile untuk kemudahan akses</li>
				<li>Sistem pelaporan online</li>
				<li>Dashboard monitoring real-time</li>
			</ul>
			<p>Diharapkan program ini dapat memberikan dampak positif bagi masyarakat Sulawesi Selatan dalam mengakses layanan pemerintah dengan lebih mudah dan cepat.</p>
		`,
		img_berita: null,
		tgl_upload: new Date().toISOString(),
		viewers: 523,
		id_skpd: '1',
		skpd: { nm_skpd: 'Pemerintahan' }
	});

	// Mock recent news
	let recent_news = $state(
		Array.from({ length: 5 }, (_, i) => ({
			id_berita: i + 2,
			slug: `berita-${i + 2}`,
			judul: `Berita Populer ${i + 1}: Update Terbaru dari Sulawesi Selatan`,
			tgl_upload: new Date(2024, 0, i + 5).toISOString(),
			skpd: { nm_skpd: categories[i % 4].nm_skpd }
		}))
	);

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
	}

	function formatDateShort(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<Header />

<!-- Breadcrumb Section -->
<div class="bg-gray-50 pt-8 pb-4 font-['Plus_Jakarta_Sans'] dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
			<a
				href="/"
				class="flex items-center gap-1.5 transition-colors hover:text-ppid-primary dark:hover:text-ppid-accent"
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"
					><path
						d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
					></path></svg
				>
				{m['common.home']()}
			</a>
			<svg
				class="h-4 w-4 text-gray-400 dark:text-gray-600"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
				></path></svg
			>
			<a
				href="/berita"
				class="transition-colors hover:text-ppid-primary dark:hover:text-ppid-accent"
				>{m['common.news']()}</a
			>
			<svg
				class="h-4 w-4 text-gray-400 dark:text-gray-600"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
				></path></svg
			>
			<span
				class="max-w-[200px] truncate font-semibold text-ppid-primary md:max-w-none dark:text-ppid-accent"
				>{berita.judul.substring(0, 40)}...</span
			>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="bg-gray-50 pb-16 font-['Plus_Jakarta_Sans'] dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
			<!-- Article Content -->
			<div class="lg:col-span-8">
				<!-- Article Header -->
				<div class="mb-8">
					<div class="mb-4 flex items-center gap-3">
						<a
							href="/berita?category={berita.id_skpd}"
							class="rounded-full bg-ppid-primary px-3 py-1 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-ppid-accent"
						>
							{berita.skpd?.nm_skpd || 'Umum'}
						</a>
						<span class="flex items-center gap-1 text-sm text-gray-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line
									x1="16"
									x2="16"
									y1="2"
									y2="6"
								/><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg
							>
							{formatDate(berita.tgl_upload)}
						</span>
						<span class="flex items-center gap-1 text-sm text-gray-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle
									cx="12"
									cy="12"
									r="3"
								/></svg
							>
							{berita.viewers.toLocaleString()} views
						</span>
					</div>
					<h1
						class="mb-6 text-3xl leading-tight font-bold text-ppid-primary md:text-4xl dark:text-white"
					>
						{berita.judul}
					</h1>

					<div class="mb-6 overflow-hidden rounded-xl shadow-lg">
						{#if berita.img_berita}
							<img
								src="/storage/img_berita/{berita.img_berita}"
								class="h-auto w-full object-cover"
								alt={berita.judul}
							/>
						{:else}
							<div
								class="flex h-64 w-full items-center justify-center rounded-xl bg-gray-100 md:h-96 dark:bg-slate-700"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-20 w-20 text-gray-300 dark:text-slate-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
						{/if}
					</div>
				</div>

				<!-- Article Body -->
				<div
					class="prose prose-lg max-w-none text-justify leading-relaxed text-gray-700 dark:text-gray-300 dark:prose-invert"
				>
					{@html berita.deskripsi}
				</div>

				<!-- Tags & Share -->
				<div class="mt-12 border-t border-gray-100 pt-8 dark:border-slate-700">
					<div class="flex flex-wrap items-center justify-between gap-6">
						<div class="flex flex-wrap gap-2">
							<span class="mr-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
								>{m['common.categories']()}:</span
							>
							<a
								href="/berita?category={berita.id_skpd}"
								class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-ppid-primary hover:text-white dark:bg-slate-700 dark:text-gray-300"
							>
								#{berita.skpd?.nm_skpd?.toLowerCase().replace(/\s+/g, '-') || 'umum'}
							</a>
						</div>
						<div class="flex items-center gap-3">
							<span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
								>{m['news.share']()}:</span
							>
							<a
								href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(
									typeof window !== 'undefined' ? window.location.href : ''
								)}"
								target="_blank"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
									stroke="none"
									><path
										d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
									/></svg
								>
							</a>
							<a
								href="https://twitter.com/intent/tweet?url={encodeURIComponent(
									typeof window !== 'undefined' ? window.location.href : ''
								)}&text={encodeURIComponent(berita.judul)}"
								target="_blank"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-500 transition-colors hover:bg-sky-500 hover:text-white"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
									stroke="none"
									><path
										d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
									/></svg
								>
							</a>
							<a
								href="https://wa.me/?text={encodeURIComponent(
									berita.judul + ' ' + (typeof window !== 'undefined' ? window.location.href : '')
								)}"
								target="_blank"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors hover:bg-green-600 hover:text-white"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
									stroke="none"
									><path
										d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
									/></svg
								>
							</a>
						</div>
					</div>
				</div>
			</div>

			<!-- Sidebar (Right) -->
			<div class="space-y-8 lg:col-span-4">
				<!-- Popular News -->
				<div
					class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h3 class="mb-6 flex items-center gap-2 font-bold text-ppid-primary dark:text-white">
						<span class="h-6 w-1 rounded-full bg-ppid-accent"></span>
						{m['common.popular']()}
					</h3>
					<div class="space-y-6">
						{#each recent_news as recent, index}
							<a href="/berita/{recent.slug}" class="group flex cursor-pointer gap-4">
								<span
									class="-mt-2 text-4xl font-bold text-gray-200 transition-colors group-hover:text-ppid-accent"
									>0{index + 1}</span
								>
								<div>
									<div class="mb-1 text-xs text-gray-500">
										{recent.skpd?.nm_skpd || 'Umum'} • {formatDateShort(recent.tgl_upload)}
									</div>
									<h4
										class="line-clamp-2 text-sm leading-snug font-bold text-gray-900 transition-colors group-hover:text-ppid-primary dark:text-white dark:group-hover:text-ppid-accent"
									>
										{recent.judul}
									</h4>
								</div>
							</a>
						{/each}
					</div>
				</div>

				<!-- Categories -->
				<div
					class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<h3 class="mb-4 flex items-center gap-2 font-bold text-ppid-primary dark:text-white">
						<span class="h-6 w-1 rounded-full bg-ppid-accent"></span>
						{m['common.categories']()}
					</h3>
					<div class="space-y-2">
						{#each categories as cat}
							<a
								href="/berita?category={cat.id_skpd}"
								class="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700"
							>
								<span
									class="line-clamp-1 text-sm font-medium text-gray-700 group-hover:text-ppid-primary dark:text-gray-300 dark:group-hover:text-white"
									>{cat.nm_skpd}</span
								>
								<span
									class="flex-shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 transition-colors group-hover:bg-ppid-primary group-hover:text-white dark:bg-slate-700"
									>{cat.berita_count}</span
								>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<Footer />
