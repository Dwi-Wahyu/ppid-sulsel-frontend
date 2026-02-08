<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface FAQ {
		id_faq: number;
		pertanyaan: string;
		jawaban: string;
		is_active: boolean;
		urutan: number | null;
	}

	let faqId = $state('');
	let pertanyaan = $state('');
	let jawaban = $state('');
	let is_active = $state('1');
	let urutan = $state<number | null>(null);
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	onMount(async () => {
		faqId = window.location.pathname.split('/')[3]; // Extract ID from URL
		await fetchFAQ();
	});

	async function fetchFAQ() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/faq/${faqId}`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				const data: FAQ = result.data;
				pertanyaan = data.pertanyaan;
				jawaban = data.jawaban;
				is_active = data.is_active ? '1' : '0';
				urutan = data.urutan;
			}
		} catch (error) {
			console.error('Failed to fetch FAQ:', error);
			notificationType = 'error';
			notificationMessage = 'Gagal memuat data FAQ';
			showNotification = true;
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('pertanyaan', pertanyaan);
			formData.append('jawaban', jawaban);
			formData.append('is_active', is_active);
			if (urutan !== null) formData.append('urutan', urutan.toString());
			formData.append('_method', 'PUT');

			const response = await fetch(`${PUBLIC_API_URL}/admin/faq/${faqId}`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'FAQ berhasil diperbarui';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/faq');
				}, 1500);
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal memperbarui FAQ';
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
	<title>Edit FAQ - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/admin/faq"
			class="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-300"
			aria-label="Kembali ke daftar FAQ"
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
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</a>
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Form Edit FAQ</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">Perbarui informasi FAQ.</p>
		</div>
	</div>

	{#if isLoading}
		<div
			class="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="flex flex-col items-center gap-3">
				<svg
					class="h-8 w-8 animate-spin text-indigo-600"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					aria-hidden="true"
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
				<!-- Pertanyaan -->
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
						aria-required="true"
						class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
						placeholder="Masukkan pertanyaan"
					/>
				</div>

				<!-- Jawaban -->
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
						aria-required="true"
						rows="5"
						class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
						placeholder="Masukkan jawaban"
					></textarea>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<!-- Status Active -->
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
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						>
							<option value="1">Aktif</option>
							<option value="0">Tidak Aktif</option>
						</select>
					</div>

					<!-- Urutan -->
					<div>
						<label
							for="urutan"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Urutan (Opsional)
						</label>
						<input
							type="number"
							id="urutan"
							bind:value={urutan}
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
							placeholder="Contoh: 1"
						/>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center justify-end gap-3">
				<a
					href="/admin/faq"
					class="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Batal
				</a>
				<button
					type="submit"
					disabled={isSaving}
					aria-busy={isSaving}
					class="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
				</button>
			</div>
		</form>
	{/if}
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Apakah Anda yakin ingin menyimpan perubahan FAQ ini?"
	confirmText="Ya, Simpan"
	theme="primary"
	onConfirm={handleSubmit}
	isLoading={isSaving}
/>

<!-- Notification -->
<NotificationDialog
	bind:show={showNotification}
	theme={notificationType}
	title={notificationType === 'success' ? 'Berhasil!' : 'Gagal!'}
	description={notificationMessage}
/>
