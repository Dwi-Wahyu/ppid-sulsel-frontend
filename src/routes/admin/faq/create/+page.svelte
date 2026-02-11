<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api'; // Gunakan helper proxy
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	// State Management (Svelte 5 Runes)
	let pertanyaan = $state('');
	let jawaban = $state('');
	let is_active = $state('1');
	let urutan = $state<number | null>(null);
	let isSaving = $state(false);
	let showConfirm = $state(false);

	// State untuk error validasi dari backend
	let errors = $state<Record<string, string[]>>({});

	// Objek notification terpadu untuk menghindari error "Cannot find name notificationType"
	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	/**
	 * Mengirim data FAQ ke backend menggunakan helper api.post.
	 * Endpoint: /admin/faq [cite: 1, 24]
	 */
	async function handleSubmit() {
		isSaving = true;
		showConfirm = false;
		errors = {};

		try {
			// Kirim data sebagai JSON melalui proxy
			const result = await api.post('/admin/faq', {
				pertanyaan,
				jawaban,
				is_active: parseInt(is_active),
				urutan
			});

			if (result.success) {
				notification = {
					show: true,
					type: 'success',
					message: 'FAQ berhasil ditambahkan ke sistem.'
				};

				// Redirect ke halaman daftar setelah sukses [cite: 25]
				setTimeout(() => {
					goto('/admin/faq');
				}, 1500);
			}
		} catch (error: any) {
			console.error('Submit error:', error);

			// Tangani error validasi (422)
			if (error.errors) {
				errors = error.errors;
				notification = {
					show: true,
					type: 'error',
					message: 'Validasi gagal. Silakan periksa kembali input Anda.'
				};
			} else {
				notification = {
					show: true,
					type: 'error',
					message: error.message || 'Terjadi kesalahan saat menyimpan data.'
				};
			}
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Tambah FAQ - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<header class="mb-8 flex items-center gap-4">
		<a
			href="/admin/faq"
			class="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 transition-all hover:text-ppid-primary dark:border-slate-700 dark:bg-slate-800 dark:hover:text-white"
			aria-label="Kembali ke daftar FAQ"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2.5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
		</a>
		<div>
			<h1 class="text-3xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
				Tambah FAQ
			</h1>
			<p class="text-sm font-medium text-slate-500 dark:text-slate-400">
				Tambahkan pertanyaan bantuan untuk publik
			</p>
		</div>
	</header>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			showConfirm = true;
		}}
		class="space-y-6"
	>
		<div
			class="space-y-6 rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
		>
			<div>
				<label
					for="pertanyaan"
					class="mb-3 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
				>
					Pertanyaan <span class="text-rose-500">*</span>
				</label>
				<input
					type="text"
					id="pertanyaan"
					bind:value={pertanyaan}
					required
					placeholder="Masukkan kalimat pertanyaan..."
					class="w-full rounded-2xl border-2 {errors.pertanyaan
						? 'border-red-400'
						: 'border-slate-100'} px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
				/>
				{#if errors.pertanyaan}
					<p class="mt-2 text-xs font-bold text-red-500">{errors.pertanyaan[0]}</p>
				{/if}
			</div>

			<div>
				<label
					for="jawaban"
					class="mb-3 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
				>
					Jawaban Lengkap <span class="text-rose-500">*</span>
				</label>
				<textarea
					id="jawaban"
					bind:value={jawaban}
					required
					rows="6"
					placeholder="Masukkan penjelasan jawaban..."
					class="w-full rounded-2xl border-2 {errors.jawaban
						? 'border-red-400'
						: 'border-slate-100'} px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
				></textarea>
				{#if errors.jawaban}
					<p class="mt-2 text-xs font-bold text-red-500">{errors.jawaban[0]}</p>
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div>
					<label
						for="is_active"
						class="mb-3 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
						>Status Publikasi</label
					>
					<select
						id="is_active"
						bind:value={is_active}
						class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
					>
						<option value="1">Tampilkan (Aktif)</option>
						<option value="0">Sembunyikan (Draf)</option>
					</select>
				</div>

				<div>
					<label
						for="urutan"
						class="mb-3 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
						>Urutan Tampil</label
					>
					<input
						type="number"
						id="urutan"
						bind:value={urutan}
						placeholder="Contoh: 1"
						class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
					/>
				</div>
			</div>
		</div>

		<footer
			class="flex items-center justify-end gap-4 border-t border-slate-50 pt-8 dark:border-slate-700"
		>
			<a
				href="/admin/faq"
				class="px-8 py-4 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-600"
			>
				Batal
			</a>
			<button
				type="submit"
				disabled={isSaving}
				class="rounded-2xl bg-ppid-primary px-12 py-4 text-xs font-black text-white shadow-xl shadow-ppid-primary/30 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
			>
				{isSaving ? 'MEMPROSES...' : 'SIMPAN FAQ'}
			</button>
		</footer>
	</form>
</div>

<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan FAQ?"
	description="Pastikan data yang dimasukkan sudah benar sebelum dipublikasikan ke website."
	confirmText="Ya, Simpan"
	theme="primary"
	onConfirm={handleSubmit}
	isLoading={isSaving}
/>

<NotificationDialog
	bind:show={notification.show}
	theme={notification.type}
	title={notification.type === 'success' ? 'BERHASIL' : 'GAGAL'}
	description={notification.message}
/>
