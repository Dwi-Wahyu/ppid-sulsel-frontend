<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { api } from '$lib/api';
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import type { PageProps } from './$types';

	let { data, params }: PageProps = $props();

	let user = $derived(data.user);

	// Form state
	let judul = $state('');
	let deskripsi = $state('');
	let img_berita = $state<any>(null);
	let currentImage = $state<string | null>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);
	let showConfirm = $state(false);

	// Notification state
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	onMount(async () => {
		await fetchBerita();
	});

	async function fetchBerita() {
		try {
			const result = await api.get(`/admin/berita/${params.id}`);
			const berita = result.data;
			judul = berita.judul;
			deskripsi = berita.deskripsi;
			currentImage = berita.img_berita;
		} catch (error: any) {
			notificationType = 'error';
			notificationMessage = error.message || 'Gagal memuat data berita.';
			showNotification = true;
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;
		showConfirm = false;

		try {
			const formData = new FormData();
			formData.append('judul', judul);
			formData.append('deskripsi', deskripsi);
			// Pastikan id_skpd tetap milik OPD ini
			formData.append('id_skpd', user?.id_skpd ?? '');
			// Method spoofing untuk Laravel file upload via PUT
			formData.append('_method', 'PUT');

			if (img_berita) {
				// FilePond exposes a plain File via onaddfile: value = fileItem.file
				const file =
					img_berita instanceof File ? img_berita : (img_berita[0]?.file ?? img_berita[0]);
				if (file) formData.append('img_berita', file);
			}

			const result = await api.post(`/admin/berita/${params.id}`, formData);

			if (result.success) {
				notificationType = 'success';
				notificationMessage = 'Berita berhasil diperbarui.';
				showNotification = true;
				setTimeout(() => goto('/opd/berita'), 1600);
			}
		} catch (error: any) {
			console.error('Update Error:', error);
			notificationType = 'error';
			notificationMessage = error.message || 'Terjadi kesalahan saat menyimpan data.';
			showNotification = true;
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Edit Berita - OPD</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-5xl">
		<header class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 class="text-3xl font-black text-slate-800 uppercase dark:text-white">Edit Berita</h1>
				<p class="text-sm font-medium text-slate-500">Perbarui konten berita yang sudah ada.</p>
			</div>
			<a
				href="/opd/berita"
				class="rounded-xl border-2 border-slate-100 bg-white px-6 py-3 text-sm font-bold text-slate-400 transition-colors hover:text-slate-600 dark:border-slate-800 dark:bg-slate-800"
			>
				KEMBALI KE DAFTAR
			</a>
		</header>

		<div
			class="rounded-4xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800"
		>
			{#if isLoading}
				<div class="flex flex-col items-center justify-center gap-3 p-20">
					<div
						class="h-10 w-10 animate-spin rounded-full border-4 border-ppid-primary border-t-transparent"
					></div>
					<p class="text-sm font-medium text-slate-500">Memuat data berita...</p>
				</div>
			{:else}
				<form
					onsubmit={(e) => {
						e.preventDefault();
						showConfirm = true;
					}}
					class="space-y-8 p-10"
				>
					<!-- Judul -->
					<div class="space-y-2">
						<label
							for="judul"
							class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
							>Judul Berita</label
						>
						<input
							type="text"
							id="judul"
							bind:value={judul}
							required
							placeholder="Masukkan judul berita..."
							class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
						/>
					</div>

					<!-- Info SKPD (read-only) -->
					<div class="space-y-2">
						<p class="block text-[10px] font-black tracking-widest text-slate-500 uppercase">
							SKPD Pengirim
						</p>
						<div
							class="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/50"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 shrink-0 text-slate-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								/></svg
							>
							<span class="text-sm font-bold text-slate-700 dark:text-slate-200">
								{user?.skpd?.nm_skpd ?? 'SKPD tidak diketahui'}
							</span>
							<span
								class="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-500 uppercase dark:bg-slate-700"
								>Otomatis</span
							>
						</div>
					</div>

					<!-- Thumbnail saat ini -->
					{#if currentImage && !img_berita}
						<div class="space-y-2">
							<h2 class="text-[10px] font-black tracking-widest text-slate-500 uppercase">
								Thumbnail Saat Ini
							</h2>
							<div
								class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50"
							>
								<img
									src={`${PUBLIC_BACKEND_URL}/uploads/berita/${currentImage}`}
									alt="Thumbnail Berita"
									class="h-20 w-20 rounded-xl object-cover shadow-sm"
								/>
								<div class="overflow-hidden">
									<p class="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
										{currentImage}
									</p>
									<p class="text-xs text-slate-500">Unggah file baru untuk mengganti gambar ini.</p>
								</div>
							</div>
						</div>
					{/if}

					<!-- Upload Thumbnail baru -->
					<div class="space-y-2">
						<h2 class="text-[10px] font-black tracking-widest text-slate-500 uppercase">
							{currentImage ? 'Ganti Thumbnail (Opsional)' : 'Thumbnail'}
						</h2>
						<div
							class="rounded-3xl border-2 border-dashed border-slate-200 p-2 dark:border-slate-700"
						>
							<FilePond
								bind:value={img_berita}
								name="img_berita"
								acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
								label="Klik atau seret gambar ke sini"
							/>
						</div>
					</div>

					<!-- Isi Berita -->
					<div class="space-y-2">
						<label
							for="deskripsi"
							class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
							>Isi Berita</label
						>
						<TinyMCE bind:value={deskripsi} id="deskripsi" height={500} />
					</div>

					<footer
						class="flex justify-end gap-4 border-t border-slate-50 pt-10 dark:border-slate-700"
					>
						<button
							type="button"
							onclick={() => goto('/opd/berita')}
							class="px-8 py-4 text-xs font-black text-slate-400 uppercase transition-colors hover:text-slate-600"
							>Batal</button
						>
						<button
							type="submit"
							disabled={isSaving}
							class="rounded-2xl bg-ppid-primary px-12 py-4 text-xs font-black text-white shadow-xl shadow-ppid-primary/30 transition-all hover:opacity-90 disabled:opacity-50"
						>
							{isSaving ? 'MEMPROSES...' : 'SIMPAN PERUBAHAN'}
						</button>
					</footer>
				</form>
			{/if}
		</div>
	</div>
</div>

<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Pastikan data berita sudah benar sebelum memperbarui."
	theme="primary"
	confirmText="Ya, Simpan"
	onConfirm={handleSubmit}
	isLoading={isSaving}
/>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'BERHASIL!' : 'GAGAL!'}
	description={notificationMessage}
/>
