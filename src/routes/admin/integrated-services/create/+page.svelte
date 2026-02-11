<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	let title = $state('');
	let description = $state('');
	let link = $state('');
	let icon = $state<any>(null);
	let is_active = $state('1');
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	async function handleSubmit() {
		if (!title || !description || !link || !icon) {
			notificationType = 'error';
			notificationMessage = 'Semua field harus diisi';
			showNotification = true;
			return;
		}

		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('link', link);
			formData.append('icon', icon);
			formData.append('is_active', is_active);

			const response = await fetch(`${PUBLIC_API_URL}/admin/integrated-services`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Layanan berhasil ditambahkan';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/integrated-services');
				}, 1500);
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal menyimpan layanan';
				showNotification = true;
			}
		} catch (error) {
			notificationType = 'error';
			notificationMessage = 'Terjadi kesalahan saat menyimpan data';
			showNotification = true;
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Tambah Layanan Terpadu - Admin</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<!-- Header -->
	<div class="mb-6 flex items-center gap-4">
		<a
			href="/admin/integrated-services"
			class="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-300"
			aria-label="Kembali"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</a>
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Tambah Layanan Terpadu</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">Tambahkan layanan terintegrasi baru.</p>
		</div>
	</div>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			showConfirm = true;
		}}
		class="space-y-6"
	>
		<div
			class="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<!-- Title -->
			<div>
				<label
					for="title"
					class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
				>
					Judul Layanan <span class="text-rose-500">*</span>
				</label>
				<input
					type="text"
					id="title"
					bind:value={title}
					required
					class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					placeholder="Contoh: E-Government"
				/>
			</div>

			<!-- Description -->
			<div>
				<label
					for="description"
					class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
				>
					Deskripsi Singkat <span class="text-rose-500">*</span>
				</label>
				<input
					type="text"
					id="description"
					bind:value={description}
					required
					class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					placeholder="Deskripsi layanan"
				/>
			</div>

			<!-- Link -->
			<div>
				<label
					for="link"
					class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
				>
					Link Tujuan <span class="text-rose-500">*</span>
				</label>
				<input
					type="url"
					id="link"
					bind:value={link}
					required
					class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					placeholder="https://..."
				/>
			</div>

			<!-- Icon -->
			<div>
				<label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
					Icon (Gambar) <span class="text-rose-500">*</span>
				</label>
				<FilePond
					bind:value={icon}
					name="icon"
					acceptedFileTypes={['image/*']}
					label="Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span>"
					maxFileSize="2MB"
				/>
				<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
					Format: jpeg, png, jpg, gif, svg. Max: 2MB.
				</p>
			</div>

			<!-- Status -->
			<div>
				<label
					for="is_active"
					class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
				>
					Status
				</label>
				<select
					id="is_active"
					bind:value={is_active}
					class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				>
					<option value="1">Active</option>
					<option value="0">Inactive</option>
				</select>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center justify-end gap-3">
			<a
				href="/admin/integrated-services"
				class="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
			>
				Batal
			</a>
			<button
				type="submit"
				disabled={isSaving}
				class="hover:bg-ppid-dark rounded-xl bg-ppid-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus:ring-2 focus:ring-ppid-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isSaving ? 'Menyimpan...' : 'Simpan'}
			</button>
		</div>
	</form>
</div>

<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Layanan?"
	description="Apakah Anda yakin ingin menyimpan layanan ini?"
	confirmText="Ya, Simpan"
	theme="primary"
	onConfirm={handleSubmit}
	isLoading={isSaving}
/>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
