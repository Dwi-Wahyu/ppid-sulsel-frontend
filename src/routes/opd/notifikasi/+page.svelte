<script lang="ts">
	import { onMount } from 'svelte';
	import type { Notification, NotificationResponse } from '$lib/types/notification';
	import { fade } from 'svelte/transition';
	import { api } from '$lib/api';
	import { browser } from '$app/environment';

	// State menggunakan Svelte 5 Runes
	let notifications = $state<Notification[]>([]);
	let isLoading = $state(true);
	let currentPage = $state(1);
	let totalPages = $state(1);

	// Fetch Data
	async function fetchNotifications(page = 1) {
		isLoading = true;
		try {
			// Menggunakan endpoint yang sama dengan admin karena backend sudah memfilter berdasarkan user/SKPD
			const result: NotificationResponse = await api.get('/admin/notifications', { page });

			notifications = result.data.data;
			totalPages = result.data.last_page;
			currentPage = result.data.current_page;
		} catch (e) {
			console.error('Fetch error:', e);
		} finally {
			isLoading = false;
		}
	}

	// Actions
	async function markAllAsRead() {
		try {
			await api.post('/admin/notifications/mark-all-read', {});
			fetchNotifications(currentPage);
		} catch (e) {
			console.error('Mark all read error:', e);
		}
	}

	async function deleteAll() {
		if (!confirm('Hapus semua notifikasi?')) return;
		try {
			await api.delete('/admin/notifications/delete-all');
			notifications = [];
		} catch (e) {
			console.error('Delete all error:', e);
		}
	}

	async function deleteOne(id: string) {
		// Optimistic update: hapus dari UI dulu
		const originalNotifications = [...notifications];
		notifications = notifications.filter((n) => n.id_notification !== id);

		try {
			await api.delete(`/admin/notifications/${id}`);
		} catch (e) {
			// Kembalikan data jika gagal
			notifications = originalNotifications;
			alert('Gagal menghapus notifikasi');
		}
	}

	onMount(() => fetchNotifications());

	function goBack() {
		if (browser) {
			window.history.back();
		}
	}
</script>

<svelte:head>
	<title>Notifikasi - OPD</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-6 pb-10">
	<!-- Breadcrumb -->
	<nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
		<button
			title="Kembali"
			onclick={goBack}
			class="text-slate-500 transition-colors hover:text-ppid-primary"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</button>
		<span class="text-slate-300" aria-hidden="true">/</span>
		<span class="text-slate-700 dark:text-slate-300 font-medium">Notifikasi</span>
	</nav>

	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-3xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
				Pemberitahuan
			</h1>
			<p class="text-sm font-medium text-slate-500">
				Pantau aktivitas terbaru dan status permohonan di Unit Kerja Anda
			</p>
		</div>
		<div class="flex items-center gap-3">
			<button
				onclick={markAllAsRead}
				disabled={notifications.length === 0}
				class="rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-black text-indigo-600 transition-all hover:bg-indigo-100 disabled:opacity-50 dark:bg-indigo-900/20 dark:text-indigo-400"
			>
				TANDAI DIBACA
			</button>
			<button
				onclick={deleteAll}
				disabled={notifications.length === 0}
				class="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-black text-red-600 transition-all hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400"
			>
				HAPUS SEMUA
			</button>
		</div>
	</div>

	<!-- Notifications List -->
	<div class="space-y-4" role="log" aria-live="polite">
		{#if isLoading}
			{#each Array(3) as _}
				<div class="h-32 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800"></div>
			{/each}
		{:else if notifications.length > 0}
			{#each notifications as notif (notif.id_notification)}
				<div
					in:fade
					class="group rounded-3xl border bg-white p-6 shadow-xs transition-all hover:shadow-md dark:bg-slate-800
                    {notif.read_at
						? 'border-slate-100 dark:border-slate-700'
						: 'border-ppid-primary/20 bg-ppid-primary/5 dark:border-ppid-primary/30'}"
				>
					<div class="flex items-start gap-5">
						<div class="mt-1 shrink-0">
							<div
								class="rounded-2xl p-3 {notif.read_at
									? 'bg-slate-100 text-slate-400 dark:bg-slate-700'
									: 'bg-ppid-primary text-white shadow-lg shadow-ppid-primary/20'}"
							>
								{#if notif.read_at}
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
										/>
									</svg>
								{:else}
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
										/>
									</svg>
								{/if}
							</div>
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex items-start justify-between gap-4">
								<div>
									<h4 class="text-lg font-bold text-slate-800 dark:text-slate-100">
										{notif.title}
									</h4>
									<div class="mt-1 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
										<span>{new Date(notif.created_at).toLocaleString('id-ID')}</span>
										{#if !notif.read_at}
											<span class="h-1 w-1 rounded-full bg-slate-300"></span>
											<span class="text-ppid-primary">Baru</span>
										{/if}
									</div>
								</div>
								<button
									aria-label="Hapus notifikasi"
									onclick={() => deleteOne(notif.id_notification)}
									class="rounded-xl p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</button>
							</div>
							<p class="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
								{notif.message}
							</p>
							{#if notif.url}
								<a
									href={notif.url}
									class="mt-5 inline-flex items-center gap-2 text-sm font-black text-ppid-primary uppercase hover:underline dark:text-ppid-accent"
								>
									Lihat Detail
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14 5l7 7m0 0l-7 7m7-7H3"
										/>
									</svg>
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}

			<!-- Pagination -->
			{#if totalPages > 1}
				<nav class="mt-10 flex justify-center gap-3" aria-label="Navigasi Halaman">
					<button
						disabled={currentPage === 1}
						onclick={() => fetchNotifications(currentPage - 1)}
						class="rounded-xl border-2 border-slate-100 bg-white px-6 py-2 text-xs font-black text-slate-600 transition-all hover:border-ppid-primary hover:text-ppid-primary disabled:opacity-30 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
					>
						PREV
					</button>
					<div
						class="flex items-center rounded-xl bg-slate-100 px-6 text-xs font-black text-slate-500 uppercase dark:bg-slate-800"
					>
						Hal {currentPage} / {totalPages}
					</div>
					<button
						disabled={currentPage === totalPages}
						onclick={() => fetchNotifications(currentPage + 1)}
						class="rounded-xl border-2 border-slate-100 bg-white px-6 py-2 text-xs font-black text-slate-600 transition-all hover:border-ppid-primary hover:text-ppid-primary disabled:opacity-30 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
					>
						NEXT
					</button>
				</nav>
			{/if}
		{:else}
			<!-- Empty State -->
			<div
				class="rounded-4xl border border-slate-100 bg-white py-24 text-center dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="flex flex-col items-center gap-5 text-slate-400">
					<div class="rounded-full bg-slate-50 p-6 dark:bg-slate-900/50">
						<svg class="h-16 w-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
							/>
						</svg>
					</div>
					<div class="space-y-1">
						<p class="text-lg font-bold text-slate-600 dark:text-slate-300">
							Belum ada pemberitahuan
						</p>
						<p class="text-sm italic">Kotak masuk Anda saat ini kosong.</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
