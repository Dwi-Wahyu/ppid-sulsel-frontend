<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api'; // Menggunakan Proxy API [cite: 10]
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface SocialLink {
		id_sosmed?: number;
		sosmed: string; // Sesuai kolom database: 'sosmed'
		judul: string; // Sesuai kolom database: 'judul'
		link_sosmed: string;
		icon_sosmed: string;
		urutan: number;
	}

	// Daftar ikon bawaan untuk dropdown
	const predefinedIcons: Record<string, string> = {
		Facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
		'Twitter/X':
			'<path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768 M13.232 10.768l6.768 -6.768"></path>',
		Instagram:
			'<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
		YouTube:
			'<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0 1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>',
		TikTok: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>',
		LinkedIn:
			'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>',
		WhatsApp:
			'<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"></path><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"></path><path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>',
		Telegram: '<path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>',
		Website:
			'<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>'
	};

	// State Management (Svelte 5 Runes)
	let socialLinks = $state<SocialLink[]>([]);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification & Dialog states
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	let showDeleteDialog = $state(false);
	let idToDelete = $state<number | null>(null);

	// Form states
	let showForm = $state(false);
	let editingId = $state<number | null>(null);
	let formData = $state<SocialLink>({
		sosmed: '',
		judul: '',
		link_sosmed: '',
		icon_sosmed: '',
		urutan: 0
	});

	onMount(async () => {
		await fetchSocialLinks();
	});

	async function fetchSocialLinks() {
		isLoading = true;
		try {
			// URL disesuaikan dengan rute Laravel terbaru: /admin/sosmed
			const result = await api.get('/admin/sosmed');
			if (result.success) {
				socialLinks = result.data || [];
			}
		} catch (error) {
			console.error('Error fetching:', error);
		} finally {
			isLoading = false;
		}
	}

	function handlePlatformChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const platform = target.value;
		if (platform && predefinedIcons[platform]) {
			formData.sosmed = platform;
			formData.judul = platform; // Default judul ke nama platform
			formData.icon_sosmed = predefinedIcons[platform];
		}
	}

	function openAddForm() {
		editingId = null;
		formData = {
			sosmed: '',
			judul: '',
			link_sosmed: '',
			icon_sosmed: '',
			urutan: socialLinks.length + 1
		};
		showForm = true;
	}

	function openEditForm(link: SocialLink) {
		editingId = link.id_sosmed || null;
		formData = { ...link };
		showForm = true;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSaving = true;

		try {
			let result;
			if (editingId) {
				result = await api.put(`/admin/sosmed/${editingId}`, formData);
			} else {
				result = await api.post('/admin/sosmed', formData);
			}

			if (result.success) {
				notificationType = 'success';
				notificationMessage = editingId
					? 'Tautan berhasil diperbarui'
					: 'Tautan berhasil ditambahkan';
				await fetchSocialLinks();
			}
		} catch (error: any) {
			notificationType = 'error';
			// Menampilkan pesan error spesifik (termasuk SQL error jika terjadi) [cite: 25]
			notificationMessage = error.message || 'Terjadi kesalahan sistem saat menyimpan data.';
		} finally {
			isSaving = false;
			showForm = false; // Memastikan form tertutup baik saat sukses maupun error
			showNotification = true;
		}
	}

	function confirmDelete(id: number) {
		idToDelete = id;
		showDeleteDialog = true;
	}

	async function processDelete() {
		if (!idToDelete) return;
		try {
			const result = await api.delete(`/admin/sosmed/${idToDelete}`);
			if (result.success) {
				notificationType = 'success';
				notificationMessage = 'Data berhasil dihapus';
				await fetchSocialLinks();
			}
		} catch (error: any) {
			notificationType = 'error';
			notificationMessage = 'Gagal menghapus data';
		} finally {
			idToDelete = null;
			showNotification = true;
		}
	}
</script>

<div class="p-8">
	<div class="mx-auto max-w-7xl">
		<header class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 class="text-3xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
					Social Media
				</h1>
				<p class="text-sm font-medium text-slate-500 dark:text-slate-400">
					Konfigurasi link eksternal pada website
				</p>
			</div>
			<button
				onclick={openAddForm}
				class="flex h-12 items-center justify-center gap-2 rounded-xl bg-ppid-primary px-6 font-bold text-white shadow-lg shadow-ppid-primary/20 transition-transform active:scale-95"
				aria-label="Tambah link sosial media baru"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
				</svg>
				TAMBAH LINK
			</button>
		</header>

		{#if isLoading}
			<div class="flex flex-col items-center justify-center py-32" aria-live="polite">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-ppid-primary"
				></div>
			</div>
		{:else}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
				{#each socialLinks as link (link.id_sosmed)}
					<div
						class="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-ppid-primary hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
						role="listitem"
					>
						<div class="mb-6 flex items-center gap-4">
							<div
								class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-ppid-primary dark:bg-slate-900"
							>
								<svg
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									{@html link.icon_sosmed}
								</svg>
							</div>
							<div class="min-w-0">
								<h3 class="truncate text-sm font-black text-slate-800 uppercase dark:text-white">
									{link.judul || link.sosmed}
								</h3>
								<p class="text-[10px] font-bold text-slate-400">ORDER: {link.urutan}</p>
							</div>
						</div>

						<div class="mb-8">
							<p class="mb-1 text-[10px] font-black tracking-tighter text-slate-400 uppercase">
								Tautan
							</p>
							<a
								href={link.link_sosmed}
								target="_blank"
								rel="noopener noreferrer"
								class="block truncate text-sm font-bold text-blue-600 hover:underline dark:text-blue-400"
							>
								{link.link_sosmed}
							</a>
						</div>

						<div class="flex gap-2">
							<button
								onclick={() => openEditForm(link)}
								class="flex-1 rounded-xl bg-slate-100 py-3 text-[10px] font-black text-slate-600 transition-all hover:bg-ppid-primary hover:text-white dark:bg-slate-700 dark:text-slate-300"
								>EDIT</button
							>
							<button
								onclick={() => confirmDelete(link.id_sosmed!)}
								class="flex-1 rounded-xl bg-red-50 py-3 text-[10px] font-black text-red-600 transition-all hover:bg-red-600 hover:text-white"
								>HAPUS</button
							>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if showForm}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
				role="dialog"
				aria-modal="true"
				onclick={() => (showForm = false)}
			>
				<div
					class="w-full max-w-lg rounded-4xl bg-white p-10 shadow-2xl dark:bg-slate-900"
					onclick={(e) => e.stopPropagation()}
				>
					<h2
						class="mb-8 text-2xl font-black tracking-tight text-slate-800 uppercase dark:text-white"
					>
						{editingId ? 'Update Link' : 'Tambah Link Baru'}
					</h2>

					<form onsubmit={handleSubmit} class="space-y-6">
						<div>
							<label
								for="platform-select"
								class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
								>Pilih Platform</label
							>
							<select
								id="platform-select"
								onchange={handlePlatformChange}
								class="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-800 transition-all focus:border-ppid-primary focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
							>
								<option value="">-- Pilih Template Ikon --</option>
								{#each Object.keys(predefinedIcons) as platform}
									<option value={platform} selected={formData.sosmed === platform}
										>{platform}</option
									>
								{/each}
								<option value="custom">Input Manual</option>
							</select>
						</div>

						<div class="grid gap-6 sm:grid-cols-2">
							<div class="sm:col-span-2">
								<label
									for="sosmed"
									class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
									>Nama Platform</label
								>
								<input
									type="text"
									id="sosmed"
									bind:value={formData.sosmed}
									required
									placeholder="Misal: Twitter"
									class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
								/>
							</div>

							<div class="sm:col-span-2">
								<label
									for="judul"
									class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
									>Label/Judul</label
								>
								<input
									type="text"
									id="judul"
									bind:value={formData.judul}
									placeholder="Misal: Follow Akun X Kami"
									class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
								/>
							</div>

							<div class="sm:col-span-2">
								<label
									for="link_sosmed"
									class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
									>URL Tautan</label
								>
								<input
									type="url"
									id="link_sosmed"
									bind:value={formData.link_sosmed}
									required
									placeholder="https://..."
									class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold transition-all outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
								/>
							</div>

							<div class="sm:col-span-2">
								<label
									for="icon_sosmed"
									class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
									>SVG Path</label
								>
								<textarea
									id="icon_sosmed"
									bind:value={formData.icon_sosmed}
									required
									rows="3"
									class="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 font-mono text-xs transition-all outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
								></textarea>
							</div>

							<div>
								<label
									for="urutan"
									class="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase"
									>Urutan</label
								>
								<input
									type="number"
									id="urutan"
									bind:value={formData.urutan}
									min="1"
									class="w-full rounded-2xl border-2 border-slate-100 p-4 text-sm font-bold outline-none focus:border-ppid-primary dark:bg-slate-800 dark:text-white"
								/>
							</div>
						</div>

						<footer class="flex justify-end gap-4 pt-6">
							<button
								type="button"
								onclick={() => (showForm = false)}
								class="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-600"
								>Batal</button
							>
							<button
								type="submit"
								disabled={isSaving}
								class="rounded-2xl bg-ppid-primary px-10 py-4 text-xs font-black text-white shadow-xl shadow-ppid-primary/30 transition-all hover:opacity-90 disabled:opacity-50"
							>
								{isSaving ? 'MEMPROSES...' : 'SIMPAN DATA'}
							</button>
						</footer>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>

<ConfirmationDialog
	bind:show={showDeleteDialog}
	title="Hapus Sosmed?"
	description="Tautan ini akan dihapus dari sistem secara permanen."
	theme="danger"
	onConfirm={processDelete}
/>

<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'BERHASIL' : 'ERROR SISTEM'}
	description={notificationMessage}
/>
