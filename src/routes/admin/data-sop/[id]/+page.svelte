<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getImageUrl } from '$lib/get-image-url';

	interface SOP {
		id: number;
		judul: string;
		file: string;
		jumlah_download: number;
		id_skpd: number;
		created_at: string | null;
		updated_at: string | null;
		skpd?: {
			nm_skpd: string;
		};
	}

	let sopId = $state('');
	let sop = $state<SOP | null>(null);
	let isLoading = $state(true);
	let fileUrl = $state('');
	let fileExtension = $state('');

	onMount(async () => {
		sopId = window.location.pathname.split('/')[3];
		await fetchSOP();
	});

	async function fetchSOP() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/data-sop/${sopId}`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				sop = result.data;
				if (sop) {
					fileExtension = sop.file.split('.').pop()?.toLowerCase() || '';
					fileUrl = getImageUrl(`sop/${sop.file}`);
				}
			}
		} catch (error) {
			console.error('Failed to fetch SOP:', error);
		} finally {
			isLoading = false;
		}
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Detail SOP - Admin</title>
</svelte:head>

<div class="mb-6 flex items-center gap-4">
	<a
		href="/admin/data-sop"
		class="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 shadow-sm transition-all hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-300"
		aria-label="Kembali ke daftar SOP"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			/>
		</svg>
	</a>
	<div>
		<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Detail SOP</h1>
		<p class="text-sm text-slate-500 dark:text-slate-400">Pratinjau dan informasi dokumen SOP.</p>
	</div>
</div>

{#if isLoading}
	<div
		class="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="flex flex-col items-center gap-3">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-ppid-primary border-t-transparent"></div>
			<p class="text-sm text-slate-500 dark:text-slate-400">Memuat data...</p>
		</div>
	</div>
{:else if sop}
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Sidebar Information -->
		<div class="space-y-6 lg:col-span-1">
			<div
				class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="bg-slate-50/50 p-6 dark:bg-slate-700/50">
					<h3 class="font-bold text-slate-900 dark:text-slate-100">Informasi Dokumen</h3>
				</div>
				<div class="p-6">
					<dl class="space-y-4">
						<div>
							<dt class="text-xs font-semibold text-slate-400 uppercase">Judul</dt>
							<dd class="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
								{sop.judul}
							</dd>
						</div>
						<div>
							<dt class="text-xs font-semibold text-slate-400 uppercase">Instansi</dt>
							<dd class="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
								{sop.skpd?.nm_skpd || '-'}
							</dd>
						</div>
						<div>
							<dt class="text-xs font-semibold text-slate-400 uppercase">Format File</dt>
							<dd class="mt-1">
								<span
									class="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 uppercase dark:bg-blue-900/30 dark:text-blue-400"
								>
									{fileExtension}
								</span>
							</dd>
						</div>
						<div>
							<dt class="text-xs font-semibold text-slate-400 uppercase">Total Unduhan</dt>
							<dd class="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
								{sop.jumlah_download} kali
							</dd>
						</div>
						<div>
							<dt class="text-xs font-semibold text-slate-400 uppercase">Diunggah Pada</dt>
							<dd class="mt-1 text-sm text-slate-600 dark:text-slate-400">
								{formatDate(sop.created_at)}
							</dd>
						</div>
					</dl>

					<div class="mt-8">
						<a
							href={fileUrl}
							target="_blank"
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-ppid-primary py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-ppid-primary-hover hover:shadow-lg"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							Download Dokumen
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Preview Section -->
		<div class="lg:col-span-2">
			<div
				class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="bg-slate-50/50 p-6 dark:bg-slate-700/50">
					<h3 class="font-bold text-slate-900 dark:text-slate-100">Pratinjau Dokumen</h3>
				</div>
				<div class="bg-slate-100 p-0 dark:bg-slate-900">
					{#if fileExtension === 'pdf'}
						<iframe src={fileUrl} title="Preview PDF" class="h-[800px] w-full border-0"></iframe>
					{:else if ['jpg', 'jpeg', 'png'].includes(fileExtension)}
						<div class="flex items-center justify-center p-8">
							<img src={fileUrl} alt={sop.judul} class="max-w-full rounded-lg shadow-sm" />
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center py-24 text-center">
							<div
								class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-10 w-10 text-slate-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<p class="max-w-xs text-sm text-slate-500">
								Pratinjau tidak tersedia untuk format <strong>.{fileExtension}</strong>. Silakan
								unduh dokumen untuk melihat isi selengkapnya.
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div
		class="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<p class="text-slate-500 dark:text-slate-400">Data SOP tidak ditemukan.</p>
	</div>
{/if}
