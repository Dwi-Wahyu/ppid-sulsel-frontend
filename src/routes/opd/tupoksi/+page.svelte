<script lang="ts">
	import { api } from '$lib/api';
	import { invalidateAll } from '$app/navigation';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	let { data } = $props();

	// State management
	let loading = $state(false);
	let fetching = $state(true);
	let nm_skpd = $state('');

	let tupoksiType = $state<'file' | 'text'>('file');
	let tupoksi_text = $state('');
	let uploadedTupoksi: any = $state(null);
	let currentTupoksi = $state(''); // The raw value from DB

	let notification = $state({
		show: false,
		title: '',
		description: '',
		theme: 'success' as 'success' | 'error' | 'warning' | 'info'
	});

	function triggerNotify(theme: 'success' | 'error', title: string, description: string) {
		notification.theme = theme;
		notification.title = title;
		notification.description = description;
		notification.show = true;
	}

	async function loadTupoksi() {
		fetching = true;
		try {
			const response = await api.get(`/admin/skpd/${data.user?.id_skpd}/tupoksi`);
			if (response.success) {
				currentTupoksi = response.data.tupoksi || '';
				nm_skpd = response.data.nm_skpd || '';

				if (currentTupoksi && !currentTupoksi.toLowerCase().endsWith('.pdf')) {
					tupoksiType = 'text';
					tupoksi_text = currentTupoksi;
				} else {
					tupoksiType = 'file';
				}
			}
		} catch (error: any) {
			triggerNotify('error', 'Gagal Memuat', error.message || 'Data tupoksi tidak dapat diambil');
		} finally {
			fetching = false;
		}
	}

	async function handleUpdate() {
		loading = true;
		try {
			const submitFormData = new FormData();

			if (tupoksiType === 'file') {
				if (uploadedTupoksi) {
					const file = Array.isArray(uploadedTupoksi) ? uploadedTupoksi[0] : uploadedTupoksi;
					submitFormData.append('tupoksi', file.file || file);
				}
			} else {
				submitFormData.append('tupoksi', tupoksi_text);
			}

			submitFormData.append('_method', 'PUT');

			const result = await api.post(`/admin/skpd/${data.user?.id_skpd}/tupoksi`, submitFormData);

			if (result.success) {
				triggerNotify(
					'success',
					'Berhasil Diperbarui',
					result.message || 'Konten tupoksi telah disimpan.'
				);
				// Update current reference to uploaded file/text to reflect changes
				currentTupoksi = result.data.tupoksi || '';
				uploadedTupoksi = null; // reset filepond
				await invalidateAll();
			}
		} catch (error: any) {
			triggerNotify(
				'error',
				'Pembaruan Gagal',
				error.message || 'Terjadi kesalahan saat menyimpan data.'
			);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadTupoksi();
	});
</script>

<svelte:head>
	<title>Update Tugas Pokok & Fungsi - {nm_skpd || 'SKPD'}</title>
</svelte:head>

<NotificationDialog
	bind:show={notification.show}
	theme={notification.theme}
	title={notification.title}
	description={notification.description}
	autoClose={true}
	duration={5000}
/>

<div class="mb-6">
	<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">Tugas Pokok & Fungsi</h2>
	<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
		Sesuaikan tugas pokok dan fungsi untuk SKPD <strong>{nm_skpd}</strong>
	</p>
</div>

<div>
	{#if fetching}
		<div class="flex flex-col items-center justify-center py-12">
			<div class="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
			<p class="mt-4 text-sm text-slate-500">Memuat data...</p>
		</div>
	{:else}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleUpdate();
			}}
		>
			<div class="mb-6 space-y-4">
				<div class="flex items-center justify-end">
					<div class="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
						<button
							type="button"
							class="rounded-md px-3 py-1 text-[10px] font-bold transition-all {tupoksiType ===
							'file'
								? 'bg-white text-blue-600 shadow-sm'
								: 'text-slate-500'}"
							onclick={() => (tupoksiType = 'file')}>FILE PDF</button
						>
						<button
							type="button"
							class="rounded-md px-3 py-1 text-[10px] font-bold transition-all {tupoksiType ===
							'text'
								? 'bg-white text-blue-600 shadow-sm'
								: 'text-slate-500'}"
							onclick={() => (tupoksiType = 'text')}>TEKS HTML</button
						>
					</div>
				</div>

				{#if tupoksiType === 'file'}
					<FilePond
						name="tupoksi"
						allowMultiple={false}
						acceptedFileTypes={['application/pdf']}
						bind:value={uploadedTupoksi}
						label={'Seret PDF tupoksi atau <span class="filepond--label-action">Telusuri</span>'}
					/>
					{#if currentTupoksi && currentTupoksi.toLowerCase().endsWith('.pdf') && !uploadedTupoksi}
						<p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
							<a
								href="{PUBLIC_BACKEND_URL}/uploads/{currentTupoksi}"
								target="_blank"
								class="text-blue-600 hover:underline">Lihat PDF saat ini</a
							>
						</p>
					{/if}
				{:else}
					<TinyMCE bind:value={tupoksi_text} height={500} />
				{/if}
			</div>

			<div
				class="flex items-center justify-end border-t border-slate-100 pt-6 dark:border-slate-700"
			>
				<button
					type="submit"
					disabled={loading}
					class="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95 disabled:bg-slate-400"
				>
					{#if loading}
						<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Menyimpan...
					{:else}
						Simpan Perubahan
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>
