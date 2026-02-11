<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface SOP {
		id: number;
		judul: string;
		file: string;
		jumlah_download: number;
		id_skpd: string | null;
		created_at: string;
		updated_at: string;
	}

	let sopId = $state('');
	let sop = $state<SOP | null>(null);
	let isLoading = $state(true);
	let fileExtension = $state('');
	let fileUrl = $state('');

	onMount(async () => {
		sopId = window.location.pathname.split('/')[3]; // Extract ID from URL
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
					fileUrl = `${PUBLIC_API_URL.replace('/api', '')}/storage/sop/${sop.file}`;
				}
			}
		} catch (error) {
			console.error('Failed to fetch SOP:', error);
		} finally {
			isLoading = false;
		}
	}

	function formatDate(dateStr: string): string {
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
	<title>Detail SOP - Admin PPID</title>
</svelte:head>

<div class="mb-6 flex items-center gap-4">
	<a
		href="/admin/data-sop"
		class="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-300"
		aria-label="Kembali ke daftar SOP"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			/>
		</svg>
	</a>
	<h3 class="text-lg font-bold text-ppid-primary dark:text-white">
		{sop?.judul || 'Loading...'}
	</h3>
</div>

{#if isLoading}
	<div
		class="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="flex flex-col items-center gap-3">
			<svg
				class="h-8 w-8 animate-spin text-ppid-primary"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<p class="text-sm text-slate-500 dark:text-slate-400">Memuat data...</p>
		</div>
	</div>
{:else if sop}
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Main Content - Document Preview -->
		<div class="space-y-6 lg:col-span-2">
			<div
				class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<h4
					class="mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500"
				>
					Pratinjau Dokumen
				</h4>

				{#if ['jpg', 'jpeg', 'png'].includes(fileExtension)}
					<img
						src={fileUrl}
						alt={sop.judul}
						class="w-full rounded-lg border border-slate-200 dark:border-slate-600"
					/>
				{:else if fileExtension === 'pdf'}
					<iframe
						src={fileUrl}
						class="h-[600px] w-full rounded-lg border border-slate-200 dark:border-slate-600"
						title="PDF Preview"
					></iframe>
				{:else}
					<div
						class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-600 dark:bg-slate-700/50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mx-auto mb-4 h-16 w-16 text-slate-400 dark:text-slate-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						<p class="mb-4 text-slate-500 dark:text-slate-400">
							Format file tidak mendukung pratinjau langsung.
						</p>
						<a
							href={fileUrl}
							download
							class="hover:bg-ppid-dark inline-block rounded-lg bg-ppid-primary px-4 py-2 text-white transition-colors"
						>
							Download untuk Melihat
						</a>
					</div>
				{/if}
			</div>
		</div>

		<!-- Sidebar - Document Info -->
		<div class="space-y-6">
			<div
				class="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<h4
					class="mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500"
				>
					Informasi Dokumen
				</h4>
				<div class="space-y-4">
					<div>
						<p class="text-xs text-slate-400 dark:text-slate-500">ID SKPD Pemilik</p>
						<p class="font-medium text-ppid-primary dark:text-white">
							{sop.id_skpd || 'Tidak Diketahui'}
						</p>
					</div>
					<div>
						<p class="text-xs text-slate-400 dark:text-slate-500">Total Unduhan</p>
						<p class="font-medium text-ppid-primary dark:text-white">
							{sop.jumlah_download} kali
						</p>
					</div>
					<div>
						<p class="text-xs text-slate-400 dark:text-slate-500">Terakhir Diperbarui</p>
						<p class="text-sm font-medium text-ppid-primary dark:text-white">
							{formatDate(sop.updated_at)}
						</p>
					</div>
				</div>

				<hr class="my-6 border-slate-100 dark:border-slate-700" />

				<div class="flex flex-col gap-3">
					<a
						href={fileUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="w-full rounded-lg bg-blue-50 py-2 text-center font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
					>
						Buka di Tab Baru
					</a>
					<a
						href="/admin/data-sop/{sop.id}/edit"
						class="w-full rounded-lg bg-amber-50 py-2 text-center font-medium text-amber-600 transition hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
					>
						Edit Data
					</a>
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
