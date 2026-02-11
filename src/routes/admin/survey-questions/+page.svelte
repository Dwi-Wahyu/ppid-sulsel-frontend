<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	interface SurveyQuestion {
		id: number;
		urutan: number;
		soal: string;
		tipe: 'radio' | 'textarea';
	}

	interface PaginationData {
		current_page: number;
		data: SurveyQuestion[];
		next_page_url: string | null;
		prev_page_url: string | null;
		total: number;
		from: number;
		to: number;
		last_page: number;
	}

	let loading = $state(true);
	let questions = $state<SurveyQuestion[]>([]);
	let pagination = $state<Partial<PaginationData>>({});

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation dialog
	let showDeleteConfirm = $state(false);
	let deleteId = $state<number | null>(null);
	let isDeleting = $state(false);

	onMount(async () => {
		await fetchData();
	});

	async function fetchData(url: string | null = null) {
		loading = true;
		const targetUrl = url || `${PUBLIC_API_URL}/admin/survey-questions`;

		try {
			const response = await fetch(targetUrl, {
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) throw new Error('Failed to fetch');

			const data: PaginationData = await response.json();
			questions = data.data;
			pagination = {
				next_page_url: data.next_page_url,
				prev_page_url: data.prev_page_url,
				total: data.total,
				from: data.from,
				to: data.to,
				current_page: data.current_page,
				last_page: data.last_page
			};
		} catch (error) {
			console.error('Error fetching questions:', error);
		} finally {
			loading = false;
		}
	}

	function changePage(url: string | null) {
		if (url) fetchData(url);
	}

	function confirmDelete(id: number) {
		deleteId = id;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		if (deleteId === null) return;

		isDeleting = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/survey-questions/${deleteId}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: { Accept: 'application/json' }
			});

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Pertanyaan berhasil dihapus';
				showNotification = true;
				await fetchData();
			} else {
				notificationType = 'error';
				notificationMessage = 'Gagal menghapus pertanyaan';
				showNotification = true;
			}
		} catch (error) {
			console.error('Delete error:', error);
			notificationType = 'error';
			notificationMessage = 'Terjadi kesalahan';
			showNotification = true;
		} finally {
			isDeleting = false;
			deleteId = null;
		}
	}
</script>

<svelte:head>
	<title>Kelola Pertanyaan Survey - Admin PPID</title>
</svelte:head>

<div class="space-y-6 p-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-100">
				Kelola Pertanyaan Survey
			</h2>
		</div>
		<a
			href="/admin/survey-questions/create"
			class="flex items-center gap-2 rounded-lg bg-ppid-primary px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#2A4A7E] hover:shadow-lg"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Tambah Pertanyaan
		</a>
	</div>

	<!-- Table -->
	<div
		class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
	>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-900">
					<tr>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300"
						>
							No.
						</th>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300"
						>
							Pertanyaan
						</th>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300"
						>
							Tipe
						</th>
						<th
							class="px-6 py-4 text-center text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300"
						>
							Aksi
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-slate-700">
					{#if loading}
						{#each Array(3) as _, i (i)}
							<tr class="animate-pulse">
								<td class="px-6 py-4">
									<div class="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-4 w-3/4 rounded bg-gray-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4">
									<div class="h-6 w-24 rounded-full bg-gray-100 dark:bg-slate-700"></div>
								</td>
								<td class="px-6 py-4 text-center">
									<div class="mx-auto h-8 w-20 rounded-lg bg-gray-100 dark:bg-slate-700"></div>
								</td>
							</tr>
						{/each}
					{:else if questions.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-12 text-center">
								<div class="flex flex-col items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<p class="text-lg font-medium text-gray-600 dark:text-gray-400">
										Belum ada pertanyaan survey
									</p>
									<p class="mt-1 text-sm text-gray-500 dark:text-gray-500">
										Klik tombol "Tambah Pertanyaan" untuk membuat pertanyaan baru
									</p>
								</div>
							</td>
						</tr>
					{:else}
						{#each questions as question (question.id)}
							<tr class="transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50">
								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ppid-primary text-sm font-bold text-white"
									>
										{question.urutan}
									</span>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm leading-relaxed font-medium text-gray-900 dark:text-white">
										{question.soal}
									</p>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if question.tipe === 'radio'}
										<span
											class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
										>
											Radio Button
										</span>
									{:else}
										<span
											class="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
										>
											Text Area
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 text-center whitespace-nowrap">
									<div class="flex items-center justify-center gap-2">
										<a
											href="/admin/survey-questions/{question.id}/edit"
											class="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
											title="Edit"
											aria-label="Edit pertanyaan {question.urutan}"
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
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/>
											</svg>
										</a>
										<button
											type="button"
											onclick={() => confirmDelete(question.id)}
											class="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
											title="Hapus"
											aria-label="Hapus pertanyaan {question.urutan}"
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
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if !loading && questions.length > 0 && pagination.last_page && pagination.last_page > 1}
			<div class="border-t border-gray-200 px-6 py-4 dark:border-slate-700">
				<div class="flex items-center justify-between">
					<div class="text-sm text-gray-600 dark:text-gray-400">
						Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} pertanyaan
					</div>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={() => changePage(pagination.prev_page_url || null)}
							disabled={!pagination.prev_page_url}
							class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
						>
							Sebelumnya
						</button>
						<button
							type="button"
							onclick={() => changePage(pagination.next_page_url || null)}
							disabled={!pagination.next_page_url}
							class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
						>
							Berikutnya
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Delete Confirmation -->
<ConfirmationDialog
	bind:show={showDeleteConfirm}
	title="Hapus Pertanyaan?"
	description="Data yang dihapus tidak dapat dikembalikan."
	confirmText="Ya, Hapus"
	theme="danger"
	onConfirm={handleDelete}
	isLoading={isDeleting}
/>

<!-- Notification -->
<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
