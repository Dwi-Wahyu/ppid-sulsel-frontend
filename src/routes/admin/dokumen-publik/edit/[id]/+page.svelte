<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { PUBLIC_API_URL } from '$env/static/public';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Get user from page data
	const user = $derived($page.data.user);
	const isAdmin = $derived(user && user.id_skpd === null);

	// Form state - initialize with existing data
	let judul = $state(data.dokumen.judul);
	let id_kat_info = $state(String(data.dokumen.id_kat_info));
	let id_skpd = $state(data.dokumen.id_skpd);
	let ket = $state(data.dokumen.ket);
	let verify = $state(data.dokumen.verify);
	let uploadedFile: File | null = $state(null);
	let isSubmitting = $state(false);

	// Notification state
	let showNotification = $state(false);
	let notificationTheme = $state<'success' | 'error'>('success');
	let notificationTitle = $state('');
	let notificationDescription = $state('');

	// Validation errors
	let errors = $state<Record<string, string[]>>({});

	// Update errors from form action
	$effect(() => {
		if (form?.errors) {
			errors = form.errors;
			if (!form.success) {
				notificationTheme = 'error';
				notificationTitle = 'Gagal!';
				notificationDescription = form.message || 'Terjadi kesalahan saat menyimpan data.';
				showNotification = true;
			}
		}
	});

	// Handle FilePond file update
	function handleFilePondUpdate(event: CustomEvent) {
		const files = event.detail;
		uploadedFile = files.length > 0 ? files[0].file : null;
	}

	// Client-side validation
	function validateForm(): boolean {
		errors = {};
		let isValid = true;

		if (!judul.trim()) {
			errors.judul = ['Judul informasi harus diisi'];
			isValid = false;
		} else if (judul.length > 255) {
			errors.judul = ['Judul informasi maksimal 255 karakter'];
			isValid = false;
		}

		if (!id_kat_info) {
			errors.id_kat_info = ['Kategori harus dipilih'];
			isValid = false;
		}

		if (!id_skpd) {
			errors.id_skpd = ['SKPD harus dipilih'];
			isValid = false;
		}

		if (!ket.trim()) {
			errors.ket = ['Keterangan harus diisi'];
			isValid = false;
		}

		return isValid;
	}

	// Format date for display
	function formatDate(dateString: string | null): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}
</script>

<div class="mb-6">
	<div class="mb-2 flex items-center gap-3">
		<a
			href="/admin/dokumen-publik"
			class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-ppid-primary dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				></path>
			</svg>
		</a>
		<h2 class="text-xl leading-tight font-semibold text-slate-800 dark:text-slate-100">
			Edit Informasi Publik
		</h2>
	</div>
	<p class="ml-14 text-sm text-slate-600 dark:text-slate-400">
		Perbarui informasi dokumen yang sudah ada
	</p>
</div>

<div
	class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
>
	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={() => {
			if (!validateForm()) {
				return async () => {};
			}
			isSubmitting = true;
			return async ({ result, update }) => {
				isSubmitting = false;
				await update();
			};
		}}
		class="space-y-6 p-6"
	>
		<!-- Document Info -->
		<div
			class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
		>
			<div class="flex items-start gap-3">
				<svg
					class="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<div class="flex-1 text-sm">
					<p class="mb-1 font-medium text-blue-800 dark:text-blue-300">Informasi Dokumen</p>
					<p class="text-blue-700 dark:text-blue-400">
						ID: <span class="font-mono">{data.dokumen.id_informasi}</span> • Diupload: {formatDate(
							data.dokumen.tgl_upload
						)} • Diunduh: {data.dokumen.jumlah_download || 0}x
					</p>
				</div>
			</div>
		</div>

		<!-- Judul -->
		<div>
			<label for="judul" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
				Judul Informasi <span class="text-red-500">*</span>
			</label>
			<input
				type="text"
				id="judul"
				name="judul"
				bind:value={judul}
				maxlength="255"
				class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-ppid-accent focus:ring-2 focus:ring-ppid-accent/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 {errors.judul
					? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
					: ''}"
				placeholder="Masukkan judul informasi publik"
			/>
			{#if errors.judul}
				<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.judul[0]}</p>
			{/if}
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Kategori -->
			<div>
				<label
					for="id_kat_info"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Kategori Informasi <span class="text-red-500">*</span>
				</label>
				<select
					id="id_kat_info"
					name="id_kat_info"
					bind:value={id_kat_info}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-ppid-accent focus:ring-2 focus:ring-ppid-accent/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 {errors.id_kat_info
						? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
						: ''}"
				>
					<option value="">Pilih Kategori</option>
					{#each data.kategoriList as kategori}
						<option value={kategori.id_kat_info}>{kategori.nm_kat_info}</option>
					{/each}
				</select>
				{#if errors.id_kat_info}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.id_kat_info[0]}</p>
				{/if}
			</div>

			<!-- SKPD -->
			<div>
				<label
					for="id_skpd"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					SKPD <span class="text-red-500">*</span>
				</label>
				<select
					id="id_skpd"
					name="id_skpd"
					bind:value={id_skpd}
					disabled={!isAdmin}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-ppid-accent focus:ring-2 focus:ring-ppid-accent/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:disabled:bg-slate-800 {errors.id_skpd
						? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
						: ''}"
				>
					<option value="">Pilih SKPD</option>
					{#each data.skpdList as skpd}
						<option value={skpd.id_skpd}>{skpd.nm_skpd}</option>
					{/each}
				</select>
				{#if errors.id_skpd}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.id_skpd[0]}</p>
				{/if}
			</div>
		</div>

		<!-- Status Verifikasi (Admin Only) -->
		{#if isAdmin}
			<div>
				<label
					for="verify"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Status Verifikasi
				</label>
				<select
					id="verify"
					name="verify"
					bind:value={verify}
					class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-ppid-accent focus:ring-2 focus:ring-ppid-accent/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				>
					<option value="n">Pending</option>
					<option value="y">Terverifikasi</option>
					<option value="t">Ditolak</option>
				</select>
			</div>
		{/if}

		<!-- Current File Info -->
		{#if data.dokumen.file}
			<div
				class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<svg
							class="h-5 w-5 text-slate-500 dark:text-slate-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							></path>
						</svg>
						<div>
							<p class="text-sm font-medium text-slate-700 dark:text-slate-300">File Saat Ini</p>
							<p class="text-xs text-slate-500 dark:text-slate-400">{data.dokumen.file}</p>
						</div>
					</div>
					<a
						href="{PUBLIC_API_URL}/storage/{data.dokumen.file}"
						target="_blank"
						class="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
					>
						Lihat File
					</a>
				</div>
			</div>
		{/if}

		<!-- File Upload (Optional on Edit) -->
		<div>
			<label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
				Upload File Baru (Opsional)
			</label>
			<FilePond
				name="file"
				allowMultiple={false}
				acceptedFileTypes={[
					'application/pdf',
					'application/msword',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'application/vnd.ms-excel',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'image/jpeg',
					'image/jpg',
					'image/png'
				]}
				maxFileSize="5MB"
				labelIdle={'Drag & Drop file atau <span class="filepond--label-action">Browse</span><br/><span class="text-xs text-slate-500">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 5MB)</span><br/><span class="text-xs text-amber-600">Kosongkan jika tidak ingin mengganti file</span>'}
				onupdatefiles={handleFilePondUpdate}
			/>
			{#if errors.file}
				<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.file[0]}</p>
			{/if}
		</div>

		<!-- Keterangan -->
		<div>
			<label for="ket" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
				Keterangan <span class="text-red-500">*</span>
			</label>
			<textarea
				id="ket"
				name="ket"
				bind:value={ket}
				rows="4"
				class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-ppid-accent focus:ring-2 focus:ring-ppid-accent/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 {errors.ket
					? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
					: ''}"
				placeholder="Masukkan keterangan atau deskripsi dokumen"
			></textarea>
			{#if errors.ket}
				<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ket[0]}</p>
			{/if}
		</div>

		<!-- Form Actions -->
		<div class="flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
			<button
				type="submit"
				disabled={isSubmitting}
				class="hover:bg-ppid-dark flex items-center gap-2 rounded-lg bg-ppid-primary px-6 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-400"
			>
				{#if isSubmitting}
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Menyimpan...
				{:else}
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
					Simpan Perubahan
				{/if}
			</button>
			<a
				href="/admin/dokumen-publik"
				class="rounded-lg bg-slate-100 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
			>
				Batal
			</a>
		</div>
	</form>
</div>

<!-- Notification Dialog -->
<NotificationDialog
	bind:show={showNotification}
	title={notificationTitle}
	description={notificationDescription}
	theme={notificationTheme}
/>
