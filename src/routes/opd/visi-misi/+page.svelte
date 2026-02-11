<script lang="ts">
	import { api } from '$lib/api';
	import { invalidateAll } from '$app/navigation';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte'; //

	let { data } = $props();

	// State management
	let loading = $state(false);
	let fetching = $state(true);
	let nm_skpd = $state('');
	let visimisi = $state('');

	// Notification state disesuaikan dengan props NotificationDialog [cite: 22]
	let notification = $state({
		show: false,
		title: '',
		description: '',
		theme: 'success' as 'success' | 'error' | 'warning' | 'info'
	});

	/**
	 * Menampilkan dialog notifikasi menggunakan komponen NotificationDialog
	 */
	function triggerNotify(theme: 'success' | 'error', title: string, description: string) {
		notification.theme = theme; //
		notification.title = title; // [cite: 22]
		notification.description = description; // [cite: 22]
		notification.show = true; // Memicu transisi fly & fade [cite: 26]
	}

	async function loadVisiMisi() {
		fetching = true;
		try {
			const response = await api.get(`/admin/skpd/${data.user?.id_skpd}/visi-misi`);
			if (response.success) {
				visimisi = response.data.visimisi || '';
				nm_skpd = response.data.nm_skpd || '';
			}
		} catch (error: any) {
			triggerNotify('error', 'Gagal Memuat', error.message || 'Data visi misi tidak dapat diambil');
		} finally {
			fetching = false;
		}
	}

	async function handleUpdate() {
		loading = true;
		try {
			const result = await api.put(`/admin/skpd/${data.user?.id_skpd}/visi-misi`, {
				visimisi: visimisi
			});

			if (result.success) {
				triggerNotify(
					'success',
					'Berhasil Diperbarui',
					result.message || 'Konten visi misi telah disimpan.'
				);
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
		loadVisiMisi();
	});
</script>

<svelte:head>
	<title>Update Visi Misi - {nm_skpd || 'SKPD'}</title>
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
	<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">Visi & Misi</h2>
	<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
		Sesuaikan visi dan misi untuk SKPD <strong>{nm_skpd}</strong>
	</p>
</div>

<div>
	{#if fetching}
		<div class="flex flex-col items-center justify-center py-12">
			<div class="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
			<p class="mt-4 text-sm text-slate-500">Memuat editor...</p>
		</div>
	{:else}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleUpdate();
			}}
		>
			<div class="mb-4">
				<TinyMCE bind:value={visimisi} id="visimisi" height={500} />
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
