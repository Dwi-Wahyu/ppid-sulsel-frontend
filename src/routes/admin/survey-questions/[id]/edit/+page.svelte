<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	interface SurveyQuestion {
		id: number;
		urutan: number;
		soal: string;
		tipe: 'radio' | 'textarea';
	}

	let questionId = $state('');
	let urutan = $state<number | null>(null);
	let soal = $state('');
	let tipe = $state<'radio' | 'textarea' | ''>('');
	let isLoading = $state(true);
	let isSaving = $state(false);

	// Notification
	let showNotification = $state(false);
	let notificationType = $state<'success' | 'error'>('success');
	let notificationMessage = $state('');

	// Confirmation
	let showConfirm = $state(false);

	onMount(async () => {
		questionId = window.location.pathname.split('/')[3];
		await fetchQuestion();
	});

	async function fetchQuestion() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/survey-questions/${questionId}`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				const data: SurveyQuestion = result.data;
				urutan = data.urutan;
				soal = data.soal;
				tipe = data.tipe;
			}
		} catch (error) {
			console.error('Failed to fetch question:', error);
			notificationType = 'error';
			notificationMessage = 'Gagal memuat data pertanyaan';
			showNotification = true;
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		if (!urutan || !soal || !tipe) {
			notificationType = 'error';
			notificationMessage = 'Semua field harus diisi';
			showNotification = true;
			return;
		}

		isSaving = true;

		try {
			const formData = new FormData();
			formData.append('urutan', urutan.toString());
			formData.append('soal', soal);
			formData.append('tipe', tipe);
			formData.append('_method', 'PUT');

			const response = await fetch(`${PUBLIC_API_URL}/admin/survey-questions/${questionId}`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				notificationType = 'success';
				notificationMessage = 'Pertanyaan berhasil diperbarui';
				showNotification = true;

				setTimeout(() => {
					goto('/admin/survey-questions');
				}, 1500);
			} else {
				notificationType = 'error';
				notificationMessage = result.message || 'Gagal memperbarui pertanyaan';
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
	<title>Edit Pertanyaan Survey - Admin PPID</title>
</svelte:head>

<div class="p-6">
	<!-- Header -->
	<div class="mb-6">
		<div class="mb-2 flex items-center gap-3">
			<a
				href="/admin/survey-questions"
				class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
				aria-label="Kembali"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-gray-600 dark:text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</a>
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Pertanyaan Survey</h1>
				<p class="mt-1 text-gray-600 dark:text-gray-400">Perbarui pertanyaan survey yang ada</p>
			</div>
		</div>
	</div>

	<!-- Form Card -->
	<div class="max-w-3xl">
		{#if isLoading}
			<div
				class="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-12 shadow-md dark:border-slate-700 dark:bg-slate-800"
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
					<p class="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
				</div>
			</div>
		{:else}
			<div
				class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="p-6">
					<form
						onsubmit={(e) => {
							e.preventDefault();
							showConfirm = true;
						}}
						class="space-y-6"
					>
						<!-- Urutan -->
						<div>
							<label
								for="urutan"
								class="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
							>
								Nomor Urut <span class="text-red-500">*</span>
							</label>
							<input
								type="number"
								id="urutan"
								bind:value={urutan}
								min="1"
								required
								aria-required="true"
								class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-base transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-900 dark:text-white"
								placeholder="Contoh: 1"
							/>
							<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Tentukan urutan pertanyaan (1, 2, 3, dst.)
							</p>
						</div>

						<!-- Soal -->
						<div>
							<label
								for="soal"
								class="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
							>
								Pertanyaan <span class="text-red-500">*</span>
							</label>
							<textarea
								id="soal"
								bind:value={soal}
								rows="4"
								required
								aria-required="true"
								class="w-full resize-none rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-base transition-all outline-none focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary dark:border-slate-600 dark:bg-slate-900 dark:text-white"
								placeholder="Tuliskan pertanyaan survey..."
							></textarea>
						</div>

						<!-- Tipe -->
						<div>
							<label class="mb-3 block text-sm font-semibold text-gray-800 dark:text-gray-200">
								Tipe Jawaban <span class="text-red-500">*</span>
							</label>
							<div class="grid grid-cols-2 gap-4">
								<label
									class="group relative flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-300 p-4 transition-all hover:border-ppid-primary hover:bg-blue-50 dark:border-slate-600 dark:hover:bg-slate-700"
								>
									<input
										type="radio"
										name="tipe"
										value="radio"
										bind:group={tipe}
										required
										class="h-5 w-5 text-ppid-primary focus:ring-2 focus:ring-ppid-primary"
									/>
									<div>
										<span
											class="block text-base font-medium text-gray-700 group-hover:text-ppid-primary dark:text-gray-300 dark:group-hover:text-white"
											>Radio Button</span
										>
										<span class="block text-xs text-gray-500 dark:text-gray-400"
											>Pilihan ganda (A, B, C, D)</span
										>
									</div>
								</label>
								<label
									class="group relative flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-300 p-4 transition-all hover:border-ppid-primary hover:bg-blue-50 dark:border-slate-600 dark:hover:bg-slate-700"
								>
									<input
										type="radio"
										name="tipe"
										value="textarea"
										bind:group={tipe}
										class="h-5 w-5 text-ppid-primary focus:ring-2 focus:ring-ppid-primary"
									/>
									<div>
										<span
											class="block text-base font-medium text-gray-700 group-hover:text-ppid-primary dark:text-gray-300 dark:group-hover:text-white"
											>Text Area</span
										>
										<span class="block text-xs text-gray-500 dark:text-gray-400"
											>Jawaban panjang/essay</span
										>
									</div>
								</label>
							</div>
						</div>

						<!-- Actions -->
						<div
							class="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-slate-700"
						>
							<a
								href="/admin/survey-questions"
								class="px-6 py-3 font-semibold text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
							>
								Batal
							</a>
							<button
								type="submit"
								disabled={isSaving}
								class="transform rounded-lg bg-linear-to-r from-ppid-primary to-[#2A4A7E] px-8 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:from-[#2A4A7E] hover:to-ppid-primary hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isSaving ? 'Menyimpan...' : 'Update Pertanyaan'}
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Confirmation Dialog -->
<ConfirmationDialog
	bind:show={showConfirm}
	title="Simpan Perubahan?"
	description="Apakah anda yakin ingin menyimpan perubahan ini?"
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
