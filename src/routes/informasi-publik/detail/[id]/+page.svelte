<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { env } from '$env/dynamic/public';
	import { getImageUrl } from '$lib/get-image-url';
	import { api } from '$lib/api';
	import Footer from '$lib/components/Footer.svelte';

	interface DokumenDetail {
		id_informasi: number;
		judul: string;
		ket: string | null;
		file: string;
		tgl_upload: string;
		id_kat_info: number;
		id_skpd: number;
		viewers: number;
		download: number;
		jumlah_download: number;
		size: string | null;
		ext: string | null;
		category: {
			id_kat_info: number;
			nm_kat_info: string;
		};
		skpd: {
			id_skpd: number;
			nm_skpd: string;
		};
	}

	let { data } = $props();

	// State untuk data dan status fetch
	let doc = $state<DokumenDetail | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	async function fetchData() {
		isLoading = true;
		error = null;
		try {
			const id = page.params.id;
			const response = await api.get(`/public/informasi/detail/${id}`);

			if (response && response.data) {
				doc = response.data;
			} else {
				throw new Error('Dokumen tidak ditemukan');
			}
		} catch (err: any) {
			console.error('Fetch Error:', err);
			error = err.message || 'Gagal memuat detail dokumen';
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		const _trigger = page.params.id;
		fetchData();
	});

	function getFileUrl(file: string): string {
		if (file.startsWith('http')) {
			return file;
		}
		return getImageUrl(`informasi/${encodeURIComponent(file)}`);
	}

	function getDownloadUrl(file: string): string {
		return getImageUrl(`informasi/${file}`);
	}

	function formatDate(dateStr: string) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{doc?.judul || 'Detail Dokumen'} - PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 py-12 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-5xl">
			{#if isLoading}
				<div class="animate-pulse space-y-8">
					<div class="flex flex-col gap-4 md:flex-row md:items-center">
						<div class="flex-1">
							<div class="mb-2 h-6 w-32 rounded-full bg-gray-200 dark:bg-slate-800"></div>
							<div class="h-10 w-full rounded-lg bg-gray-200 dark:bg-slate-800"></div>
						</div>
					</div>
					<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
						<div class="h-150 rounded-3xl bg-gray-200 lg:col-span-2 dark:bg-slate-800"></div>
						<div class="h-96 rounded-3xl bg-gray-200 dark:bg-slate-800"></div>
					</div>
				</div>
			{:else if error}
				<div
					class="rounded-3xl border border-slate-200 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-800"
				>
					<p class="mb-4 text-lg font-medium text-red-600 dark:text-red-400">
						{error}
					</p>
					<button
						onclick={fetchData}
						class="rounded-xl bg-ppid-primary px-6 py-2 font-bold text-white transition-all hover:bg-ppid-primary/90"
					>
						Coba Lagi
					</button>
				</div>
			{:else if doc}
				<!-- Header & Action -->
				<div
					class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
				>
					<div class="flex-1">
						<div class="mb-2 flex flex-wrap items-center gap-2">
							<span
								class="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
							>
								{doc.category?.nm_kat_info || 'Informasi Publik'}
							</span>
							<span class="text-sm text-slate-500">
								Terakhir diperbarui: {formatDate(doc.tgl_upload)}
							</span>
						</div>
						<h1 class="text-2xl font-black text-slate-900 md:text-3xl dark:text-white">
							{doc.judul}
						</h1>
					</div>

					<div class="flex w-full flex-wrap gap-3 md:w-auto">
						<a
							href={getDownloadUrl(doc.file)}
							download
							target="_blank"
							class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ppid-primary px-6 py-3 font-bold text-white shadow-lg shadow-ppid-primary/20 transition-all hover:bg-ppid-primary/90 md:flex-none"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							{m['public_info.download']()}
						</a>
					</div>
				</div>

				<!-- Main Content -->
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<!-- Document Preview -->
					<div class="lg:col-span-2">
						<div
							class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800"
						>
							<div
								class="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-700"
							>
								<h2 class="font-bold text-slate-900 dark:text-white">Pratinjau Dokumen</h2>
								<div
									class="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase"
								>
									<span class="rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-900"
										>{doc.ext || 'PDF'}</span
									>
									<span>{doc.size || 'Unknown Size'}</span>
								</div>
							</div>

							<div class="bg-slate-100 dark:bg-slate-900">
								{#if doc.ext?.toLowerCase() === 'pdf'}
									<iframe
										src={getFileUrl(doc.file)}
										title="Preview Dokumen"
										class="h-200 w-full border-0"
									></iframe>
								{:else if ['jpg', 'jpeg', 'png', 'webp'].includes(doc.ext?.toLowerCase() || '')}
									<div class="flex items-center justify-center p-8">
										<img
											src={getFileUrl(doc.file)}
											alt={doc.judul}
											class="max-w-full rounded-xl shadow-sm"
										/>
									</div>
								{:else}
									<div class="flex flex-col items-center justify-center py-32 text-center">
										<div
											class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-slate-800"
										>
											<svg
												class="h-10 w-10 text-slate-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
										</div>
										<h3 class="text-lg font-bold text-slate-900 dark:text-white">
											Pratinjau Tidak Tersedia
										</h3>
										<p class="mt-1 text-slate-500">
											Format file ini tidak mendukung pratinjau langsung.
										</p>
										<a
											href={getDownloadUrl(doc.file)}
											class="mt-6 text-sm font-bold text-ppid-primary hover:underline"
										>
											Unduh untuk melihat dokumen &rarr;
										</a>
									</div>
								{/if}
							</div>
						</div>
					</div>

					<!-- Sidebar Info -->
					<div class="space-y-6">
						<div
							class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800"
						>
							<h3
								class="mb-6 border-l-4 border-ppid-accent pl-4 text-lg font-bold text-slate-900 dark:text-white"
							>
								Detail Informasi
							</h3>

							<div class="space-y-6">
								<div>
									<span class="mb-1 block text-xs font-bold tracking-wider text-slate-400 uppercase"
										>Sumber Informasi</span
									>
									<p class="font-bold text-slate-900 dark:text-white">{doc.skpd?.nm_skpd || '-'}</p>
								</div>

								<div>
									<span class="mb-1 block text-xs font-bold tracking-wider text-slate-400 uppercase"
										>Keterangan</span
									>
									<p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
										{doc.ket || 'Tidak ada keterangan tambahan.'}
									</p>
								</div>

								<div class="grid grid-cols-2 gap-4">
									<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
										<span class="mb-1 block text-[10px] font-bold text-slate-400 uppercase"
											>Jumlah Download</span
										>
										<span class="text-lg font-black text-slate-900 dark:text-white"
											>{doc.jumlah_download}</span
										>
									</div>
									<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
										<span class="mb-1 block text-[10px] font-bold text-slate-400 uppercase"
											>File</span
										>
										<span class="text-lg font-black text-slate-900 dark:text-white"
											>{doc.ext?.toUpperCase() || 'PDF'}</span
										>
									</div>
								</div>
							</div>
						</div>

						<!-- Social Share -->
						<div
							class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800"
						>
							<h4 class="mb-4 text-sm font-bold text-slate-900 dark:text-white">
								Bagikan Informasi
							</h4>
							<div class="flex gap-2">
								<button
									aria-label="Bagikan ke Facebook"
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-ppid-primary hover:text-white dark:bg-slate-900 dark:text-slate-400"
								>
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
										><path
											d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
										/></svg
									>
								</button>
								<button
									aria-label="Bagikan ke Twitter/X"
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-ppid-primary hover:text-white dark:bg-slate-900 dark:text-slate-400"
								>
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
										><path
											d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.92 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
										/></svg
									>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-8">
					<button
						onclick={() => history.back()}
						class="group flex items-center gap-2 font-bold text-slate-500 transition-colors hover:text-ppid-primary"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="transition-transform group-hover:-translate-x-1"
						>
							<line x1="19" y1="12" x2="5" y2="12" />
							<polyline points="12 19 5 12 12 5" />
						</svg>
						{m['public_info.detail.back']()}
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>

<Footer />
