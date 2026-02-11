<script lang="ts">
	import { api } from '$lib/api';
	import { goto } from '$app/navigation';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import SearchableSelect from '$lib/components/SearchableSelect.svelte';

	let { data }: { data: PageData } = $props();

	// State untuk data list yang di-fetch di frontend
	let kategoriList = $state<any[]>([]);
	let skpdList = $state<any[]>([]);
	let isLoadingData = $state(true);

	// Get user dari data load
	const user = data.user;
	const isAdmin = user && user.id_skpd === null;

	// Form state
	let judul = $state('');
	let id_kat_info = $state('');
	let id_skpd = $state(user?.id_skpd || '');
	let ket = $state('');
	let verify = $state('n');
	let uploadedFile: any = $state(null);
	let isSubmitting = $state(false);

	// Notification state
	let notification = $state({
		show: false,
		theme: 'success' as 'success' | 'error',
		title: '',
		description: ''
	});

	let errors = $state<Record<string, string[]>>({});

	function triggerNotify(theme: 'success' | 'error', title: string, description: string) {
		notification = { show: true, theme, title, description };
	}

	// Fetch data tambahan di frontend untuk mengatasi error property missing
	onMount(async () => {
		try {
			const [resKat, resSkpd] = await Promise.all([
				api.get('/admin/master-data/kategori-informasi'),
				api.get('/admin/skpd')
			]);

			if (resKat.success) {
				kategoriList = resKat.data?.data || resKat.data || [];
			}
			if (resSkpd.success) {
				skpdList = resSkpd.data || [];
			}
		} catch (e) {
			console.error('Gagal memuat data referensi:', e);
		} finally {
			isLoadingData = false;
		}
	});

	async function handleSubmit() {
		isSubmitting = true;
		errors = {};

		try {
			const formData = new FormData();
			formData.append('judul', judul);
			formData.append('id_kat_info', id_kat_info);
			formData.append('id_skpd', id_skpd);
			formData.append('ket', ket);
			formData.append('verify', verify);

			if (uploadedFile) {
				const fileToUpload = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
				formData.append('file', fileToUpload.file || fileToUpload);
			}

			const result = await api.post('/admin/dokumen-publik', formData);

			if (result.success) {
				triggerNotify('success', 'Berhasil!', 'Dokumen publik berhasil disimpan.');
				setTimeout(() => goto('/admin/dokumen-publik'), 1500);
			}
		} catch (error: any) {
			if (error.errors) {
				errors = error.errors;
				triggerNotify('error', 'Gagal!', 'Mohon periksa kembali inputan Anda.');
			} else {
				triggerNotify('error', 'Error!', error.message || 'Terjadi kesalahan sistem.');
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Tambah Informasi Publik - Admin</title>
</svelte:head>

<div class="mb-6">
	<div class="mb-2 flex items-center gap-3">
		<a
			href="/admin/dokumen-publik"
			class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
			aria-label="Kembali ke daftar dokumen"
		>
			<svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</a>
		<h2 class="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
			Tambah Informasi Publik
		</h2>
	</div>

	<p class="ml-12 text-sm text-slate-600 dark:text-slate-400">
		Lengkapi formulir di bawah untuk menambahkan dokumen baru.
	</p>
</div>

<div
	class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
>
	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6 p-6"
	>
		<div class="space-y-2">
			<label for="judul" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
				Judul Informasi <span class="text-red-500" aria-hidden="true">*</span>
			</label>
			<input
				id="judul"
				type="text"
				bind:value={judul}
				required
				aria-invalid={errors.judul ? 'true' : 'false'}
				aria-describedby={errors.judul ? 'judul-error' : undefined}
				class="w-full rounded-lg border px-4 py-2.5 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-white {errors.judul
					? 'border-red-500'
					: 'border-slate-300 dark:border-slate-600'}"
				placeholder="Contoh: Laporan Keuangan Kuartal I"
			/>
			{#if errors.judul}
				<p id="judul-error" class="text-xs text-red-600">{errors.judul[0]}</p>
			{/if}
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="space-y-2">
				<label for="id_kat_info" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
					Kategori <span class="text-red-500" aria-hidden="true">*</span>
				</label>
				<select
					id="id_kat_info"
					bind:value={id_kat_info}
					required
					class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700"
				>
					<option value="">{isLoadingData ? 'Memuat...' : 'Pilih Kategori'}</option>
					{#each kategoriList as kategori}
						<option value={kategori.id_kat_info}>{kategori.nm_kat_info}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-2">
				<label for="skpd-select" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
					SKPD Pelaksana <span class="text-red-500" aria-hidden="true">*</span>
				</label>
				{#if isAdmin}
					<SearchableSelect
						options={skpdList}
						bind:value={id_skpd}
						idKey="id_skpd"
						labelKey="nm_skpd"
						placeholder={isLoadingData ? 'Memuat SKPD...' : 'Cari SKPD...'}
					/>
				{:else}
					<input
						id="skpd-display"
						type="text"
						value={skpdList.find((s) => s.id_skpd === id_skpd)?.nm_skpd || 'Memuat...'}
						disabled
						class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900"
					/>
				{/if}
				{#if errors.id_skpd}<p class="text-xs text-red-600">{errors.id_skpd[0]}</p>{/if}
			</div>
		</div>

		<div class="space-y-2">
			<span class="text-sm font-semibold text-slate-700 dark:text-slate-300">
				Berkas Dokumen <span class="text-red-500" aria-hidden="true">*</span>
			</span>
			<FilePond
				bind:value={uploadedFile}
				acceptedFileTypes={['application/pdf', 'image/jpeg', 'image/png']}
			/>
			<p class="text-[11px] tracking-wider text-slate-500 uppercase">
				Format: PDF, JPG, PNG (Maks. 5MB)
			</p>
			{#if errors.file}<p class="text-xs text-red-600">{errors.file[0]}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="ket" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
				Ringkasan / Keterangan <span class="text-red-500" aria-hidden="true">*</span>
			</label>
			<textarea
				id="ket"
				bind:value={ket}
				rows="4"
				required
				placeholder="Berikan penjelasan singkat mengenai isi dokumen..."
				class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700"
			></textarea>
		</div>

		<div
			class="flex items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700"
		>
			<a
				href="/admin/dokumen-publik"
				class="rounded-lg px-6 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
			>
				Batal
			</a>
			<button
				type="submit"
				disabled={isSubmitting}
				class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isSubmitting}
					<svg class="size-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Menyimpan...
				{:else}
					Simpan Dokumen
				{/if}
			</button>
		</div>
	</form>
</div>

<NotificationDialog
	bind:show={notification.show}
	theme={notification.theme}
	title={notification.title}
	description={notification.description}
/>
