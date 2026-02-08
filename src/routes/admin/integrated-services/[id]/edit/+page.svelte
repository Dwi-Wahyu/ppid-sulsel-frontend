<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import FilePond from '$lib/components/FilePond.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface Service {
		id: number;
		title: string;
		description: string;
		link: string;
		icon: string | null;
		is_active: boolean;
	}

	let serviceId = $state('');
	let title = $state('');
	let description = $state('');
	let link = $state('');
	let icon = $state<any>(null);
	let currentIcon = $state<string | null>(null);
	let is_active = $state('1');
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	onMount(async () => {
		serviceId = window.location.pathname.split('/')[3];
		await fetchService();
	});

	async function fetchService() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/integrated-services/${serviceId}`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				const data: Service = result.data;
				title = data.title;
				description = data.description;
				link = data.link;
				currentIcon = data.icon;
				is_active = data.is_active ? '1' : '0';
			}
		} catch (error) {
			console.error('Failed to fetch service:', error);
			notificationType = 'error';
			notificationMessage = 'Gagal memuat data layanan';
			showNotification = true;
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		if (!title || !description || !link) {
			notificationType = 'error';
			notificationMessage = 'Judul, deskripsi, dan link harus diisi';
			showNotification = true;
			return;
		}

		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('link', link);
			formData.append('is_active', is_active);
			if (icon) formData.append('icon', icon);
			formData.append('_method', 'PUT');

			const response = await fetch(`${PUBLIC_API_URL}/admin/integrated-services/${serviceId}`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Layanan berhasil diperbarui';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/integrated-services');
				}, 1500);
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal memperbarui layanan';
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
	<title>Edit Layanan Terpadu - Admin</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
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
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Layanan Terpadu</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">Perbarui informasi layanan.</p>
		</div>
	</div>

	{#if isLoading}
		<div
			class="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="flex flex-col items-center gap-3">
				<svg
					class="h-8 w-8 animate-spin text-ppid-primary"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<p class="text-sm text-slate-500 dark:text-slate-400">Memuat data...</p>
			</div>
		</div>
	{:else}
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
					/>
				</div>

				<!-- Current Icon -->
				{#if currentIcon && !icon}
					<div>
						<label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
							Icon Saat Ini
						</label>
						<div class="mb-2">
							<img
								src={`${PUBLIC_API_URL.replace('/api', '')}/storage/integrated_services/${currentIcon}`}
								alt="Current Icon"
								class="h-16 w-16 rounded-lg border border-slate-200 object-contain dark:border-slate-600"
							/>
						</div>
					</div>
				{/if}

				<!-- Icon Upload -->
				<div>
					<label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
						{currentIcon ? 'Icon Baru (Opsional)' : 'Icon (Gambar)'}
					</label>
					<FilePond
						bind:value={icon}
						name="icon"
						acceptedFileTypes={['image/*']}
						label="Seret & Letakkan file atau <span class='filepond--label-action'>Telusuri</span>"
						maxFileSize="2MB"
					/>
					<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
						Biarkan kosong jika tidak ingin mengubah gambar. Max: 2MB.
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
					{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
				</button>
			</div>
		</form>
	{/if}
</div>

<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Apakah Anda yakin ingin menyimpan perubahan layanan ini?"
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
