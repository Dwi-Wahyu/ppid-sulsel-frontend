<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface SocialLink {
		id_sosmed?: number;
		nm_sosmed: string;
		link_sosmed: string;
		icon_sosmed: string;
		urutan: number;
		is_active: string;
	}

	interface PredefinedIcons {
		[key: string]: string;
	}

	let socialLinks = $state<SocialLink[]>([]);
	let predefinedIcons = $state<PredefinedIcons>({});
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification states
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Form states
	let showForm = $state(false);
	let editingId = $state<number | null>(null);
	let formData = $state<SocialLink>({
		nm_sosmed: '',
		link_sosmed: '',
		icon_sosmed: '',
		urutan: 0,
		is_active: '1'
	});

	onMount(async () => {
		await fetchSocialLinks();
	});

	async function fetchSocialLinks() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/social-links`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				socialLinks = result.data || [];
				predefinedIcons = result.predefinedIcons || {};
			}
		} catch (error) {
			console.error('Error fetching social links:', error);
			notificationType = 'error';
			notificationMessage = 'Gagal memuat data social links';
			showNotification = true;
		} finally {
			isLoading = false;
		}
	}

	function openAddForm() {
		editingId = null;
		formData = {
			nm_sosmed: '',
			link_sosmed: '',
			icon_sosmed: '',
			urutan: socialLinks.length + 1,
			is_active: '1'
		};
		showForm = true;
	}

	function openEditForm(link: SocialLink) {
		editingId = link.id_sosmed || null;
		formData = { ...link };
		showForm = true;
	}

	function cancelForm() {
		showForm = false;
		editingId = null;
		formData = {
			nm_sosmed: '',
			link_sosmed: '',
			icon_sosmed: '',
			urutan: 0,
			is_active: '1'
		};
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;

		try {
			const url = editingId
				? `${PUBLIC_API_URL}/admin/social-links/${editingId}`
				: `${PUBLIC_API_URL}/admin/social-links`;

			const response = await fetch(url, {
				method: editingId ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify(formData)
			});

			const result = await response.json();

			if (result.success) {
				notificationType = 'success';
				notificationMessage = editingId
					? 'Social link berhasil diperbarui'
					: 'Social link berhasil ditambahkan';
				await fetchSocialLinks();
				cancelForm();
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal menyimpan data';
			}
		} catch (error) {
			notificationType = 'error';
			notificationMessage = 'Terjadi kesalahan saat menyimpan data';
		} finally {
			isSaving = false;
			showNotification = true;
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('Yakin ingin menghapus social link ini?')) return;

		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/social-links/${id}`, {
				method: 'DELETE',
				credentials: 'include'
			});

			const result = await response.json();

			if (result.success) {
				notificationType = 'success';
				notificationMessage = 'Social link berhasil dihapus';
				await fetchSocialLinks();
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal menghapus data';
			}
		} catch (error) {
			notificationType = 'error';
			notificationMessage = 'Terjadi kesalahan saat menghapus data';
		} finally {
			showNotification = true;
		}
	}

	function selectPredefinedIcon(platform: string) {
		formData.nm_sosmed = platform;
		formData.icon_sosmed = predefinedIcons[platform];
	}
</script>

<svelte:head>
	<title>Kelola Social Media Links - Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Social Media Links</h1>
				<p class="text-slate-600 dark:text-slate-400">
					Kelola link social media yang tampil di header dan footer
				</p>
			</div>
			<button
				onclick={openAddForm}
				class="flex items-center gap-2 rounded-xl bg-linear-to-r from-ppid-primary to-[#2A4A7E] px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-[#2A4A7E] hover:to-ppid-primary hover:shadow-lg"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Tambah Link
			</button>
		</div>

		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="text-slate-600 dark:text-slate-400">Loading...</div>
			</div>
		{:else}
			<!-- Social Links List -->
			<div
				class="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<h2 class="mb-6 text-xl font-bold text-slate-800 dark:text-white">Daftar Social Links</h2>

				{#if socialLinks.length === 0}
					<div class="py-12 text-center text-slate-500 dark:text-slate-400">
						Belum ada social link. Klik "Tambah Link" untuk menambahkan.
					</div>
				{:else}
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each socialLinks as link (link.id_sosmed)}
							<div
								class="group relative rounded-xl border-2 border-slate-200 bg-slate-50 p-6 transition-all hover:border-ppid-primary hover:shadow-md dark:border-slate-600 dark:bg-slate-700"
							>
								<!-- Active Badge -->
								{#if link.is_active === '1'}
									<div
										class="absolute top-4 right-4 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300"
									>
										Active
									</div>
								{:else}
									<div
										class="absolute top-4 right-4 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-300"
									>
										Inactive
									</div>
								{/if}

								<!-- Icon Preview -->
								<div class="mb-4 flex items-center gap-4">
									<div
										class="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="text-ppid-primary"
										>
											{@html link.icon_sosmed}
										</svg>
									</div>
									<div class="flex-1">
										<h3 class="mb-1 font-bold text-slate-800 dark:text-white">
											{link.nm_sosmed}
										</h3>
										<p class="text-xs text-slate-500 dark:text-slate-400">Urutan: {link.urutan}</p>
									</div>
								</div>

								<!-- Link -->
								<a
									href={link.link_sosmed}
									target="_blank"
									rel="noopener noreferrer"
									class="mb-4 block truncate text-sm text-blue-600 hover:underline dark:text-blue-400"
								>
									{link.link_sosmed}
								</a>

								<!-- Actions -->
								<div class="flex gap-2">
									<button
										onclick={() => openEditForm(link)}
										class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
									>
										Edit
									</button>
									<button
										onclick={() => handleDelete(link.id_sosmed || 0)}
										class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
									>
										Hapus
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Form Modal -->
		{#if showForm}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
				onclick={cancelForm}
			>
				<div
					class="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800"
					onclick={(e) => e.stopPropagation()}
				>
					<div class="mb-6 flex items-center justify-between">
						<h3 class="text-2xl font-bold text-ppid-primary dark:text-white">
							{editingId ? 'Edit Social Link' : 'Tambah Social Link'}
						</h3>
						<button
							onclick={cancelForm}
							class="text-gray-500 transition-colors hover:text-ppid-primary"
							aria-label="Close"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<form onsubmit={handleSubmit}>
						<!-- Predefined Icons -->
						<div class="mb-6">
							<label class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
								Pilih Platform (Opsional)
							</label>
							<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
								{#each Object.entries(predefinedIcons) as [platform, icon]}
									<button
										type="button"
										onclick={() => selectPredefinedIcon(platform)}
										class="flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-ppid-primary hover:bg-ppid-primary/5 {formData.nm_sosmed ===
										platform
											? 'border-ppid-primary bg-ppid-primary/10'
											: 'border-slate-200 dark:border-slate-600'}"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											class="text-slate-600 dark:text-slate-400"
										>
											{@html icon}
										</svg>
										<span class="text-xs font-medium text-slate-700 dark:text-slate-300">
											{platform}
										</span>
									</button>
								{/each}
							</div>
						</div>

						<!-- Platform Name -->
						<div class="mb-6">
							<label
								for="nm_sosmed"
								class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>
								Nama Platform
							</label>
							<input
								type="text"
								id="nm_sosmed"
								bind:value={formData.nm_sosmed}
								required
								aria-required="true"
								class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								placeholder="Contoh: Facebook"
							/>
						</div>

						<!-- Link URL -->
						<div class="mb-6">
							<label
								for="link_sosmed"
								class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>
								URL Link
							</label>
							<input
								type="url"
								id="link_sosmed"
								bind:value={formData.link_sosmed}
								required
								aria-required="true"
								class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								placeholder="https://facebook.com/ppidsulsel"
							/>
						</div>

						<!-- Icon SVG -->
						<div class="mb-6">
							<label
								for="icon_sosmed"
								class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>
								Icon SVG Path
							</label>
							<textarea
								id="icon_sosmed"
								bind:value={formData.icon_sosmed}
								required
								aria-required="true"
								rows="3"
								class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								placeholder="<path d="M18 2h-3..."></path>"
							></textarea>
							<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
								SVG path untuk icon. Pilih dari platform di atas atau masukkan custom path.
							</p>
						</div>

						<!-- Order & Active -->
						<div class="mb-6 grid gap-4 sm:grid-cols-2">
							<div>
								<label
									for="urutan"
									class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
								>
									Urutan
								</label>
								<input
									type="number"
									id="urutan"
									bind:value={formData.urutan}
									min="1"
									class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								/>
							</div>
							<div>
								<label
									for="is_active"
									class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300"
								>
									Status
								</label>
								<select
									id="is_active"
									bind:value={formData.is_active}
									class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								>
									<option value="1">Active</option>
									<option value="0">Inactive</option>
								</select>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex justify-end gap-3">
							<button
								type="button"
								onclick={cancelForm}
								class="rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
							>
								Batal
							</button>
							<button
								type="submit"
								disabled={isSaving}
								aria-busy={isSaving}
								class="flex items-center gap-2 rounded-xl bg-linear-to-r from-ppid-primary to-[#2A4A7E] px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-[#2A4A7E] hover:to-ppid-primary hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								{isSaving ? 'Menyimpan...' : 'Simpan'}
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
