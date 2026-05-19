<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api'; // Menggunakan Proxy API
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import type { SosmedItem } from '$lib/types/sosmed';

	// State Management (Svelte 5 Runes)
	let socialLinks = $state<SosmedItem[]>([]);
	let isLoading = $state(true);

	// Notification & Dialog states
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	let showDeleteDialog = $state(false);
	let idToDelete = $state<number | null>(null);

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
				onclick={() => goto('/admin/sosial-media/tambah')}
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
								onclick={() => goto(`/admin/sosial-media/${link.id_sosmed}`)}
								class="flex-1 rounded-xl bg-slate-100 py-3 text-[10px] font-black text-slate-600 transition-all hover:bg-ppid-primary hover:text-white dark:bg-slate-700 dark:text-slate-300"
								>EDIT</button
							>
							<button
								onclick={() => confirmDelete(link.id_sosmed)}
								class="flex-1 rounded-xl bg-red-50 py-3 text-[10px] font-black text-red-600 transition-all hover:bg-red-600 hover:text-white"
								>HAPUS</button
							>
						</div>
					</div>
				{/each}
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
