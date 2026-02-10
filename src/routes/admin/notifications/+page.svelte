<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import type { Notification, NotificationResponse } from '$lib/types/notification';
	import { fade, slide } from 'svelte/transition';

	// State menggunakan Svelte 5 Runes
	let notifications = $state<Notification[]>([]);
	let isLoading = $state(true);
	let currentPage = $state(1);
	let totalPages = $state(1);

	// Fetch Data
	async function fetchNotifications(page = 1) {
		isLoading = true;
		try {
			const res = await fetch(`${env.PUBLIC_API_URL}/admin/notifications?page=${page}`);
			const result: NotificationResponse = await res.json();
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
		await fetch(`${env.PUBLIC_API_URL}/admin/notifications/mark-all-read`, { method: 'POST' });
		fetchNotifications(currentPage);
	}

	async function deleteAll() {
		if (!confirm('Hapus semua notifikasi?')) return;
		await fetch(`${env.PUBLIC_API_URL}/admin/notifications/delete-all`, { method: 'DELETE' });
		notifications = [];
	}

	async function deleteOne(id: string) {
		notifications = notifications.filter((n) => n.id_notification !== id);
		await fetch(`${env.PUBLIC_API_URL}/admin/notifications/${id}`, { method: 'DELETE' });
	}

	onMount(() => fetchNotifications());
</script>

<div class="mx-auto max-w-4xl space-y-6 pb-10 font-sans">
	<nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
		<a href="/admin/dashboard" class="text-slate-500 transition-colors hover:text-blue-600">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</a>
		<span class="text-slate-300" aria-hidden="true">/</span>
		<span class="text-slate-700 dark:text-slate-300">Semua Notifikasi</span>
	</nav>

	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Notifikasi</h1>
			<p class="text-sm text-slate-500">Kelola semua pemberitahuan sistem Anda</p>
		</div>
		<div class="flex items-center gap-3">
			<button
				onclick={markAllAsRead}
				class="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition-colors outline-none hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 dark:bg-blue-900/20"
			>
				Tandai Semua Dibaca
			</button>
			<button
				onclick={deleteAll}
				class="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-colors outline-none hover:bg-red-100 focus:ring-2 focus:ring-red-500 dark:bg-red-900/20"
			>
				Hapus Semua
			</button>
		</div>
	</div>

	<div class="space-y-4" role="log" aria-live="polite">
		{#if isLoading}
			{#each Array(3) as _}
				<div class="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
			{/each}
		{:else if notifications.length > 0}
			{#each notifications as notif (notif.id_notification)}
				<div
					in:fade
					class="group rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-800
                    {notif.read_at
						? 'border-slate-100 dark:border-slate-700'
						: 'border-blue-200 bg-blue-50/30 dark:border-blue-500/50 dark:bg-blue-900/10'}"
				>
					<div class="flex items-start gap-4">
						<div class="mt-1 shrink-0">
							<div
								class="rounded-xl p-2.5 {notif.read_at
									? 'bg-slate-100 text-slate-400'
									: 'bg-blue-100 text-blue-600'}"
							>
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
									/>
								</svg>
							</div>
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex items-start justify-between gap-4">
								<div>
									<h4 class="text-base font-bold text-slate-800 dark:text-slate-100">
										{notif.title}
									</h4>
									<p class="mt-1 text-xs text-slate-400">
										{new Date(notif.created_at).toLocaleString('id-ID')}
									</p>
								</div>
								<button
									aria-label="Hapus notifikasi"
									onclick={() => deleteOne(notif.id_notification)}
									class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
									class="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400"
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

			{#if totalPages > 1}
				<div class="mt-8 flex justify-center gap-2">
					<button
						disabled={currentPage === 1}
						onclick={() => fetchNotifications(currentPage - 1)}
						class="rounded-lg border border-slate-200 bg-white px-4 py-2 disabled:opacity-50"
					>
						Prev
					</button>
					<span class="px-4 py-2">Hal {currentPage} / {totalPages}</span>
					<button
						disabled={currentPage === totalPages}
						onclick={() => fetchNotifications(currentPage + 1)}
						class="rounded-lg border border-slate-200 bg-white px-4 py-2 disabled:opacity-50"
					>
						Next
					</button>
				</div>
			{/if}
		{:else}
			<div
				class="rounded-3xl border border-slate-100 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="flex flex-col items-center gap-4 text-slate-400">
					<div class="rounded-full bg-slate-50 p-4 dark:bg-slate-900">
						<svg class="h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
							/>
						</svg>
					</div>
					<p class="text-sm font-medium italic">Kotak notifikasi kosong.</p>
				</div>
			</div>
		{/if}
	</div>
</div>
