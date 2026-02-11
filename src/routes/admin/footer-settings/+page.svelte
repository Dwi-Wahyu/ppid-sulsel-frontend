<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api'; // [cite: 23]
	import TinyMCE from '$lib/components/TinyMCE.svelte'; // [cite: 24]
	import FilePond from '$lib/components/FilePond.svelte'; // [cite: 24]
	import NotificationDialog from '$lib/components/NotificationDialog.svelte'; // [cite: 24]
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte'; // [cite: 24]
	import type { FooterData } from '$lib/types/footer';

	// State Management Svelte 5 Runes [cite: 3, 25]
	let isLoading = $state(true);
	let isSaving = $state(false);
	let showConfirm = $state(false);

	let settings = $state<FooterData>({
		footer_logo: null,
		footer_description: '',
		footer_address: '',
		footer_phone: '',
		footer_email: '',
		privacy_policy: '',
		terms_conditions: '',
		is_stats_visible: false
	});

	// State khusus untuk FilePond (berkas gambar) [cite: 27, 34]
	let logoFile = $state<any>(null);

	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	onMount(async () => {
		try {
			const result = await api.get('/admin/footer-setting');
			if (result.success) {
				settings = {
					...result.data,
					// Konversi "0"/"1" dari database ke boolean untuk checkbox
					is_stats_visible: result.data.is_stats_visible === '1'
				};
			}
		} catch (error: any) {
			showNotification('error', 'Gagal memuat data pengaturan.');
		} finally {
			isLoading = false;
		}
	});

	function showNotification(type: 'success' | 'error', message: string) {
		notification = { show: true, type, message };
	}

	async function handleSubmit() {
		isSaving = true;
		showConfirm = false;

		try {
			const data = new FormData(); // [cite: 32]
			data.append('footer_description', settings.footer_description);
			data.append('footer_address', settings.footer_address);
			data.append('footer_phone', settings.footer_phone);
			data.append('footer_email', settings.footer_email);
			data.append('privacy_policy', settings.privacy_policy);
			data.append('terms_conditions', settings.terms_conditions);
			data.append('is_stats_visible', settings.is_stats_visible ? '1' : '0');

			// Penanganan Unggah Logo menggunakan FilePond
			if (logoFile && logoFile.length > 0) {
				const rawFile = logoFile[0].file;
				data.append('footer_logo', rawFile);
			}

			const result = await api.post('/admin/footer-setting', data); // [cite: 37]

			if (result.success) {
				showNotification('success', 'Pengaturan footer berhasil diperbarui.');
			}
		} catch (error: any) {
			showNotification('error', error.message || 'Terjadi kesalahan sistem.');
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Footer Settings - Admin PPID</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-5xl">
		<header class="mb-10 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-black text-slate-800 uppercase dark:text-white">
					Footer Settings
				</h1>
				<p class="text-sm font-medium text-slate-500">
					Kelola identitas, kontak, dan dokumen legal.
				</p>
			</div>
		</header>

		{#if isLoading}
			<div class="flex h-64 items-center justify-center">
				<div
					class="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-ppid-primary"
				></div>
			</div>
		{:else}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					showConfirm = true; // [cite: 42]
				}}
				class="space-y-8"
			>
				<section
					class="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="mb-8 flex items-center justify-between border-b border-slate-50 pb-6 dark:border-slate-700"
					>
						<h2 class="text-sm font-black tracking-widest text-slate-800 uppercase dark:text-white">
							Branding & Logo
						</h2>

						<label class="flex cursor-pointer items-center gap-3">
							<span class="text-xs font-bold text-slate-500 uppercase">Tampilkan Statistik</span>
							<div class="relative inline-flex items-center">
								<input
									type="checkbox"
									bind:checked={settings.is_stats_visible as boolean}
									class="peer sr-only"
								/>
								<div
									class="h-6 w-11 rounded-full bg-slate-200 transition-all peer-checked:bg-ppid-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"
								></div>
							</div>
						</label>
					</div>

					<div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
						<div class="space-y-4">
							<h1 class="block text-[10px] font-black tracking-widest text-slate-500 uppercase">
								Logo Footer
							</h1>
							<div
								class="rounded-3xl border-2 border-dashed border-slate-200 p-2 dark:border-slate-700"
							>
								<FilePond
									bind:value={logoFile}
									name="footer_logo"
									acceptedFileTypes={['image/png', 'image/jpeg']}
									label="Seret Logo"
								/>
							</div>
						</div>

						<div class="space-y-2 lg:col-span-2">
							<label
								for="footer_description"
								class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
								>Deskripsi Singkat</label
							>
							<textarea
								id="footer_description"
								bind:value={settings.footer_description}
								rows="5"
								class="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-5 text-sm font-bold outline-none focus:border-ppid-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
							></textarea>
						</div>
					</div>
				</section>

				<section
					class="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800"
				>
					<h2
						class="mb-8 border-b border-slate-50 pb-6 text-sm font-black tracking-widest text-slate-800 uppercase dark:border-slate-700 dark:text-white"
					>
						Informasi Kontak
					</h2>

					<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div class="space-y-2">
							<label
								for="footer_phone"
								class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
								>Nomor Telepon</label
							>
							<input
								type="text"
								id="footer_phone"
								bind:value={settings.footer_phone}
								class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
							/>
						</div>
						<div class="space-y-2">
							<label
								for="footer_email"
								class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
								>Email</label
							>
							<input
								type="email"
								id="footer_email"
								bind:value={settings.footer_email}
								class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
							/>
						</div>
					</div>

					<div class="mt-8 space-y-2">
						<label
							for="footer_address"
							class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
							>Alamat</label
						>
						<textarea
							id="footer_address"
							bind:value={settings.footer_address}
							rows="2"
							class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-900 dark:text-white"
						></textarea>
					</div>
				</section>

				<section
					class="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800"
				>
					<h2
						class="mb-8 border-b border-slate-50 pb-6 text-sm font-black tracking-widest text-slate-800 uppercase dark:border-slate-700 dark:text-white"
					>
						Dokumen Legal
					</h2>

					<div class="space-y-8">
						<div class="space-y-4">
							<label
								for="privacy_policy"
								class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
								>Privacy Policy</label
							>
							<TinyMCE bind:value={settings.privacy_policy} id="privacy_policy" height={300} />
						</div>

						<div class="space-y-4">
							<label
								for="terms_conditions"
								class="block text-[10px] font-black tracking-widest text-slate-500 uppercase"
								>Terms & Conditions</label
							>
							<TinyMCE bind:value={settings.terms_conditions} id="terms_conditions" height={300} />
						</div>
					</div>
				</section>

				<footer class="flex justify-end gap-4 pt-4">
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

<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Pengaturan ini akan langsung berdampak pada tampilan footer portal publik."
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
