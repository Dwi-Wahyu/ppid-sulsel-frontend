<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state'; // Mengambil parameter URL di Svelte 5 [cite: 19]
	import { api } from '$lib/api'; // Helper Proxy API [cite: 20]
	import { goto } from '$app/navigation';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface DIPForm {
		a: string;
		b: string;
		c: string;
		d: string;
		e: string;
		f: string;
		g: string;
		h: string;
	}

	// Berikan tipe eksplisit pada label agar bisa diindeks dengan kunci dari DIPForm
	const columnLabels: Record<keyof DIPForm, string> = {
		a: 'Jenis Informasi',
		b: 'Ringkasan Isi',
		c: 'Pejabat yang Menguasai',
		d: 'Penanggung Jawab',
		e: 'Waktu Pembuatan',
		f: 'Format',
		g: 'Tahun',
		h: 'Tautan Dokumen'
	};

	// State Management (Svelte 5 Runes)
	let isLoading = $state(true);
	let isSaving = $state(false);
	let showConfirm = $state(false);

	// Gunakan interface DIPForm pada state formData
	let formData = $state<DIPForm>({
		a: '',
		b: '',
		c: '',
		d: '',
		e: '',
		f: '',
		g: '',
		h: ''
	});

	// State untuk error validasi dari Laravel
	let errors = $state<Record<string, string[]>>({});

	// Notification state [cite: 26]
	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	/**
	 * Mengambil data detail DIP berdasarkan ID saat halaman dimuat
	 */
	onMount(async () => {
		const id = page.params.id;
		try {
			const res = await api.get(`/admin/matriks-dip/${id}`);
			if (res.success && res.data) {
				// Pastikan data dipetakan ke state sesuai interface
				formData = {
					a: res.data.a || '',
					b: res.data.b || '',
					c: res.data.c || '',
					d: res.data.d || '',
					e: res.data.e || '',
					f: res.data.f || '',
					g: res.data.g || '',
					h: res.data.h || ''
				};
			}
		} catch (error: any) {
			console.error('Fetch error:', error);
			notification = {
				show: true,
				type: 'error',
				message: error.message || 'Gagal memuat data detail.'
			};
		} finally {
			isLoading = false;
		}
	});

	/**
	 * Mengirim data pembaruan ke backend menggunakan PUT
	 */
	async function handleUpdate() {
		const id = page.params.id;
		isSaving = true;
		errors = {};

		try {
			const res = await api.put(`/admin/matriks-dip/${id}`, formData);
			if (res.success) {
				notification = {
					show: true,
					type: 'success',
					message: 'Data Informasi Publik berhasil diperbarui.'
				};
				setTimeout(() => goto('/admin/daftar-informasi-publik'), 1500);
			}
		} catch (error: any) {
			if (error.errors) {
				errors = error.errors;
				notification = {
					show: true,
					type: 'error',
					message: 'Gagal memperbarui. Periksa kembali form Anda.'
				};
			} else {
				notification = {
					show: true,
					type: 'error',
					message: error.message || 'Terjadi kesalahan sistem.'
				};
			}
		} finally {
			isSaving = false;
			showConfirm = false;
		}
	}
</script>

<svelte:head>
	<title>Edit Matriks DIP - Admin PPID</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-4xl">
		{#if isLoading}
			<div class="flex animate-pulse flex-col items-center justify-center py-20">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-ppid-primary"
				></div>
				<p class="mt-4 text-xs font-bold tracking-widest text-slate-400 uppercase">
					Memuat Data...
				</p>
			</div>
		{:else}
			<div
				class="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
			>
				<header
					class="border-b border-slate-100 bg-slate-50/50 px-10 py-6 dark:border-slate-700 dark:bg-slate-900/50"
				>
					<h1 class="text-xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
						Form Edit Data
					</h1>
				</header>

				<form
					onsubmit={(e) => {
						e.preventDefault();
						showConfirm = true;
					}}
					class="p-10"
				>
					<div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
						{#each ['a', 'b'] as const as key}
							<div class="md:col-span-2">
								<label
									for={key}
									class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
								>
									{columnLabels[key]}
								</label>
								{#if key === 'b'}
									<textarea
										id={key}
										bind:value={formData[key]}
										rows="3"
										class="w-full rounded-2xl border-2 {errors[key]
											? 'border-red-400'
											: 'border-slate-100'} px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:border-slate-800 dark:bg-slate-900"
									></textarea>
								{:else}
									<input
										id={key}
										type="text"
										bind:value={formData[key]}
										class="w-full rounded-2xl border-2 {errors[key]
											? 'border-red-400'
											: 'border-slate-100'} px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:border-slate-800 dark:bg-slate-900"
									/>
								{/if}
								{#if errors[key]}
									<p class="mt-1 text-xs font-bold text-red-500">{errors[key][0]}</p>
								{/if}
							</div>
						{/each}

						{#each ['c', 'd', 'e', 'f', 'g', 'h'] as const as key}
							<div>
								<label
									for={key}
									class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
								>
									{columnLabels[key]}
								</label>
								<input
									id={key}
									type="text"
									bind:value={formData[key]}
									class="w-full rounded-2xl border-2 {errors[key]
										? 'border-red-400'
										: 'border-slate-100'} px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:border-slate-800 dark:bg-slate-900"
								/>
								{#if errors[key]}
									<p class="mt-1 text-xs font-bold text-red-500">{errors[key][0]}</p>
								{/if}
							</div>
						{/each}
					</div>

					<footer
						class="mt-10 flex justify-end gap-4 border-t border-slate-50 pt-10 dark:border-slate-700"
					>
						<a
							href="/admin/daftar-informasi-publik"
							class="px-8 py-4 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-600"
							>Batal</a
						>
						<button
							type="submit"
							disabled={isSaving}
							class="rounded-2xl bg-ppid-primary px-12 py-4 text-xs font-black text-white shadow-xl shadow-ppid-primary/30 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
						>
							{isSaving ? 'MEMPERBARUI...' : 'SIMPAN PERUBAHAN'}
						</button>
					</footer>
				</form>
			</div>
		{/if}
	</div>
</div>

<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Pastikan data yang diperbarui sudah akurat sebelum disimpan ke sistem."
	confirmText="Ya, Perbarui"
	theme="primary"
	onConfirm={handleUpdate}
/>

<NotificationDialog
	bind:show={notification.show}
	theme={notification.type}
	title={notification.type === 'success' ? 'BERHASIL' : 'GAGAL'}
	description={notification.message}
/>
