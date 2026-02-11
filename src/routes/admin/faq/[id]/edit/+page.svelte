<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state'; // Gunakan parameter dari URL di Svelte 5
	import { api } from '$lib/api'; // Gunakan helper api
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface FAQ {
		id_faq: number;
		pertanyaan: string;
		jawaban: string;
		is_active: boolean;
		urutan: number | null;
	}

	let faqId = $state(page.params.id);
	let pertanyaan = $state('');
	let jawaban = $state('');
	let is_active = $state('1');
	let urutan = $state<number | null>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification states
	let notification = $state({
		show: false,
		type: 'success' as 'success' | 'error',
		message: ''
	});

	let showConfirm = $state(false);

	onMount(async () => {
		await fetchFAQ();
	});

	/**
	 * Mengambil data FAQ menggunakan api.get
	 */
	async function fetchFAQ() {
		try {
			const result = await api.get(`/admin/faq/${faqId}`);
			if (result.success) {
				const data: FAQ = result.data;
				pertanyaan = data.pertanyaan;
				jawaban = data.jawaban;
				is_active = data.is_active ? '1' : '0';
				urutan = data.urutan;
			}
		} catch (error) {
			console.error('Failed to fetch FAQ:', error);
			notification = { show: true, type: 'error', message: 'Gagal memuat data FAQ' };
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Mengirim pembaruan FAQ menggunakan api.put
	 */
	async function handleSubmit() {
		isSaving = true;
		showConfirm = false;

		try {
			const result = await api.put(`/admin/faq/${faqId}`, {
				pertanyaan,
				jawaban,
				is_active: parseInt(is_active),
				urutan
			});

			if (result.success) {
				notification = { show: true, type: 'success', message: 'FAQ berhasil diperbarui' };
				setTimeout(() => goto('/admin/faq'), 1500);
			}
		} catch (error: any) {
			console.error('Submit error:', error);
			notification = {
				show: true,
				type: 'error',
				message: error.message || 'Terjadi kesalahan saat menyimpan data'
			};
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Edit FAQ - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center gap-4">
		<a
			href="/admin/faq"
			class="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800"
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
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Form Edit FAQ</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">Perbarui informasi pertanyaan umum.</p>
		</div>
	</div>

	{#if isLoading}
		<div
			class="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="flex flex-col items-center gap-3">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"
				></div>
				<p class="text-sm text-slate-500">Memuat data...</p>
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
				class="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div>
					<label
						for="pertanyaan"
						class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Pertanyaan <span class="text-rose-500">*</span>
					</label>
					<input
						type="text"
						id="pertanyaan"
						bind:value={pertanyaan}
						required
						class="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="jawaban"
						class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						Jawaban <span class="text-rose-500">*</span>
					</label>
					<textarea
						id="jawaban"
						bind:value={jawaban}
						required
						rows="5"
						class="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
					></textarea>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label
							for="is_active"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>Status</label
						>
						<select
							id="is_active"
							bind:value={is_active}
							class="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
						>
							<option value="1">Aktif</option>
							<option value="0">Tidak Aktif</option>
						</select>
					</div>

					<div>
						<label
							for="urutan"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>Urutan (Opsional)</label
						>
						<input
							type="number"
							id="urutan"
							bind:value={urutan}
							class="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
						/>
					</div>
				</div>
			</div>

			<div class="flex items-center justify-end gap-3">
				<a
					href="/admin/faq"
					class="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
					>Batal</a
				>
				<button
					type="submit"
					disabled={isSaving}
					class="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
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
	description="Pastikan data FAQ sudah benar sebelum diperbarui."
	confirmText="Ya, Simpan"
	theme="primary"
	onConfirm={handleSubmit}
	isLoading={isSaving}
/>

<NotificationDialog
	bind:show={notification.show}
	theme={notification.type}
	title={notification.type === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notification.message}
/>
