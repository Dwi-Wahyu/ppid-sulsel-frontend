<script lang="ts">
	import { api } from '$lib/api'; // Helper Proxy API
	import { goto } from '$app/navigation';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	// 1. Definisikan Interface untuk keamanan tipe data
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

	// 2. Berikan tipe eksplisit pada columnLabels agar bisa diindeks string
	const columnLabels: Record<string, string> = {
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
	let isSaving = $state(false);
	let showConfirm = $state(false);

	// Gunakan interface pada state formData
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

	let errors = $state<Record<string, string[]>>({});

	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	async function handleSave() {
		isSaving = true;
		errors = {};

		try {
			const res = await api.post('/admin/daftar-informasi-publik', formData);
			if (res.success) {
				notification = {
					show: true,
					type: 'success',
					message: 'Data Informasi Publik berhasil ditambahkan.'
				};
				setTimeout(() => goto('/admin/daftar-informasi-publik'), 1500);
			}
		} catch (error: any) {
			if (error.errors) {
				errors = error.errors;
				notification = { show: true, type: 'error', message: 'Validasi gagal.' };
			} else {
				notification = { show: true, type: 'error', message: error.message || 'Error sistem.' };
			}
		} finally {
			isSaving = false;
			showConfirm = false;
		}
	}
</script>

<svelte:head>
	<title>Tambah Matriks DIP - Admin PPID</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-4xl">
		<div
			class="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
		>
			<header
				class="border-b border-slate-100 bg-slate-50/50 px-10 py-6 dark:border-slate-700 dark:bg-slate-900/50"
			>
				<h1 class="text-xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
					Form Tambah Data
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
								placeholder={key === 'g' ? 'Misal: 2024' : ''}
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
						{isSaving ? 'MEMPROSES...' : 'SIMPAN DATA'}
					</button>
				</footer>
			</form>
		</div>
	</div>
</div>

<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Data DIP?"
	description="Pastikan informasi yang Anda masukkan sudah sesuai dengan dokumen asli."
	confirmText="Ya, Simpan"
	theme="primary"
	onConfirm={handleSave}
/>

<NotificationDialog
	bind:show={notification.show}
	theme={notification.type}
	title={notification.type === 'success' ? 'BERHASIL' : 'GAGAL'}
	description={notification.message}
/>
