<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { api } from '$lib/api';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import SuccessModal from '$lib/components/SuccessModal.svelte';

	let { data }: { data: PageData } = $props();

	// State
	let showResponseModal = $state(false);
	let responseMessage = $state('');
	let responseStatus = $state('diproses'); // diproses, selesai, ditolak
	let file: File | null = $state(null);
	let isLoading = $state(false);

	// Modal States
	let showConfirmation = $state(false);
	let confirmationConfig = $state({
		title: '',
		description: '',
		action: async () => {}
	});
	let showSuccess = $state(false);
	let successMessage = $state('');

	type AsyncVoidFunction = () => Promise<void>;

	// Derived values
	// Find disposition assigned to current user's SKPD
	let myDisposition = $derived.by(() => {
		const userSkpd = String(data.user?.id_skpd || '').trim();
		if (!data.permohonan?.disposisi || !userSkpd) return undefined;

		console.log('Finding disposition for user SKPD:', userSkpd);
		console.log('Available dispositions:', data.permohonan.disposisi);

		return data.permohonan.disposisi.find((d: any) => String(d.id_skpd).trim() === userSkpd);
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getDispositionStatusBadge(status: string): string {
		switch (status) {
			case 'pending':
				return 'bg-amber-100 text-amber-700 border-amber-300';
			case 'diproses':
				return 'bg-blue-100 text-blue-700 border-blue-300';
			case 'selesai':
				return 'bg-emerald-100 text-emerald-700 border-emerald-300';
			case 'ditolak':
				return 'bg-red-100 text-red-700 border-red-300';
			default:
				return 'bg-slate-100 text-slate-700 border-slate-300';
		}
	}

	function closeResponseModal() {
		showResponseModal = false;
		responseMessage = '';
		file = null;
		responseStatus = 'diproses';
	}

	async function processResponse() {
		if (!myDisposition) return;
		isLoading = true;
		try {
			const formData = new FormData();
			formData.append('respon', responseMessage);
			formData.append('status', responseStatus);
			if (file) {
				formData.append('file', file);
			}

			const response = await api.post(
				`/admin/permohonan-informasi/disposisi/${myDisposition.id_disposisi}/respon`,
				formData
			);

			if (response.success) {
				await invalidateAll();
				closeResponseModal();
				successMessage = 'Respon Anda berhasil dikirim.';
				showSuccess = true;
			}
		} catch (error: any) {
			console.error('Error sending response:', error);
			alert(error.message || 'Gagal mengirim respon');
		} finally {
			isLoading = false;
		}
	}

	function handleResponseSubmit() {
		confirmationConfig = {
			title: 'Kirim Respon?',
			description: 'Respon Anda akan dikirim ke Admin PPID untuk ditinjau.',
			action: async () => await processResponse()
		};
		showConfirmation = true;
	}
</script>

<svelte:head>
	<title>Detail Permohonan - OPD PPID</title>
</svelte:head>

<!-- Header -->
<div
	class="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-ppid-primary to-ppid-primary/80 p-8 text-white shadow-xl"
>
	<div class="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
	<div
		class="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-ppid-accent/20 blur-3xl"
	></div>

	<div class="relative flex items-start justify-between">
		<div class="flex-1">
			<div class="mb-2 flex items-center gap-3">
				<a
					href="/opd/permohonan-informasi"
					class="rounded-lg p-2 transition-colors hover:bg-white/10"
					aria-label="Kembali ke daftar permohonan"
				>
					<svg
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
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</a>
				<h1 class="font-['Plus_Jakarta_Sans'] text-2xl font-bold">Detail Permohonan (Disposisi)</h1>
			</div>
			<div class="flex items-center gap-4">
				<p class="text-lg opacity-90">
					<span class="font-semibold">#{data.permohonan.id_permohonan}</span> - {data.permohonan
						.nama}
				</p>
			</div>
		</div>
	</div>
</div>

<div class="grid gap-6 lg:grid-cols-3">
	<!-- Left: Details -->
	<div class="space-y-6 lg:col-span-2">
		<!-- Identitas Pemohon -->
		<div
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
			>
				<h2 class="flex items-center gap-2 text-lg font-bold text-ppid-primary dark:text-white">
					<div
						class="rounded-lg bg-ppid-primary/10 p-2 text-ppid-primary dark:bg-blue-500/20 dark:text-blue-400"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					Identitas Pemohon
				</h2>
			</div>
			<div class="p-6">
				<dl class="grid gap-4 md:grid-cols-2">
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Nama Lengkap</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{data.permohonan.nama}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Kategori</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{data.permohonan.kategori || '-'}
						</dd>
					</div>
				</dl>
			</div>
		</div>

		<!-- Informasi yang Diminta -->
		<div
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
			>
				<h2 class="flex items-center gap-2 text-lg font-bold text-ppid-primary dark:text-white">
					<div
						class="rounded-lg bg-ppid-primary/10 p-2 text-ppid-primary dark:bg-blue-500/20 dark:text-blue-400"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					Rincian Permohonan (Disposisi)
				</h2>
			</div>
			<div class="p-6">
				<!-- Admin Note for this Disposition -->
				{#if myDisposition && myDisposition.catatan_disposisi}
					<div class="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
						<p class="mb-1 text-sm font-bold text-amber-800">📢 Catatan Admin:</p>
						<p class="text-amber-800 italic">"{myDisposition.catatan_disposisi}"</p>
					</div>
				{/if}

				<dl class="space-y-4">
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">
							Rincian Informasi
						</dt>
						<dd
							class="mt-2 rounded-lg bg-slate-50 p-4 whitespace-pre-wrap text-slate-900 dark:bg-slate-700/50 dark:text-slate-100"
						>
							{data.permohonan.rincian_informasi}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">
							Tujuan Penggunaan
						</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{data.permohonan.tujuan}
						</dd>
					</div>
				</dl>
			</div>
		</div>

		<!-- Previous Responses History -->
		{#if myDisposition && myDisposition.respon && myDisposition.respon.length > 0}
			<div
				class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
				>
					<h2 class="flex items-center gap-2 text-lg font-bold text-ppid-primary dark:text-white">
						<div
							class="rounded-lg bg-ppid-primary/10 p-2 text-ppid-primary dark:bg-blue-500/20 dark:text-blue-400"
						>
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						Riwayat Respon Anda
					</h2>
				</div>
				<div class="space-y-4 p-6">
					{#each myDisposition.respon as respon, i}
						<div class="relative border-l-2 border-slate-200 pb-4 pl-6 last:border-0 last:pb-0">
							<div
								class="absolute top-0 -left-[9px] h-4 w-4 rounded-full border-2 border-white bg-ppid-primary"
							></div>
							<div class="mb-1 text-sm text-slate-500">{formatDate(respon.created_at)}</div>
							<div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
								<p class="text-slate-800">{respon.pesan}</p>
								{#if respon.file}
									<a
										href={`/uploads/${respon.file}`}
										target="_blank"
										class="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline"
									>
										<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
											/></svg
										>
										Lihat File Lampiran
									</a>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<!-- Right: Actions -->
	<div class="space-y-6">
		<div
			class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="border-b border-slate-100 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-800/50"
			>
				<h3 class="flex items-center gap-2 text-xl font-bold text-ppid-primary dark:text-white">
					<div
						class="rounded-lg bg-ppid-primary/10 p-2 text-ppid-primary dark:bg-blue-500/20 dark:text-blue-400"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</div>
					Tindakan OPD
				</h3>
			</div>
			<div class="p-6">
				{#if !myDisposition}
					<div class="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-900/30">
						<div class="flex items-start">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Akses Ditolak</h3>
								<div class="mt-2 text-sm text-red-700 dark:text-red-300">
									<p>Anda tidak memiliki akses ke disposisi ini.</p>
									<div class="mt-2 rounded bg-white/50 p-2 font-mono text-xs dark:bg-black/20">
										<p><strong>Debug Info:</strong></p>
										<p>User SKPD: {data.user?.id_skpd ? `"${data.user.id_skpd}"` : '(kosong)'}</p>
										<p>
											Disposisi SKPDs: {data.permohonan?.disposisi
												?.map((d) => `"${d.id_skpd}"`)
												.join(', ') || '(tidak ada)'}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else if myDisposition.status === 'selesai' || myDisposition.status === 'ditolak'}
					<div class="text-center">
						<div class="mb-4 inline-flex items-center justify-center rounded-full bg-slate-100 p-4">
							<svg
								class="h-8 w-8 text-slate-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h4 class="mb-2 text-lg font-bold text-slate-800">Disposisi Telah Selesai</h4>
						<p class="mb-4 text-slate-600">
							Status saat ini:
							<span
								class="font-bold uppercase {getDispositionStatusBadge(
									myDisposition.status
								)} ml-1 rounded px-2 py-0.5 text-xs"
							>
								{myDisposition.status}
							</span>
						</p>
					</div>
				{:else}
					<p class="mb-4 text-sm text-slate-600 dark:text-slate-400">
						Silakan proses permohonan ini:
					</p>
					<button
						type="button"
						onclick={() => (showResponseModal = true)}
						class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-ppid-primary to-ppid-primary-light px-4 py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
							/>
						</svg>
						Kirim Respon / Jawaban
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Modal: Respon Form -->
{#if showResponseModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="response-modal-title"
	>
		<div
			class="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
			onclick={closeResponseModal}
			aria-hidden="true"
		></div>

		<div
			class="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all dark:bg-slate-800"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="relative bg-ppid-primary px-6 py-6 dark:bg-slate-900">
				<div
					class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl"
				></div>
				<h3 id="response-modal-title" class="flex items-center gap-2 text-xl font-bold text-white">
					<div class="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
					</div>
					Form Respon Disposisi
				</h3>
				<button
					type="button"
					onclick={closeResponseModal}
					class="absolute top-6 right-6 rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
					aria-label="Tutup modal"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="space-y-5 p-6">
				<div>
					<label
						for="status"
						class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>Status Tindakan</label
					>
					<div class="grid grid-cols-3 gap-3">
						<button
							type="button"
							onclick={() => (responseStatus = 'diproses')}
							class="rounded-lg border px-4 py-3 text-sm font-semibold transition-all {responseStatus ===
							'diproses'
								? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
								: 'border-slate-200 text-slate-600 hover:bg-slate-50'}"
						>
							Sedang Diproses
						</button>
						<button
							type="button"
							onclick={() => (responseStatus = 'selesai')}
							class="rounded-lg border px-4 py-3 text-sm font-semibold transition-all {responseStatus ===
							'selesai'
								? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
								: 'border-slate-200 text-slate-600 hover:bg-slate-50'}"
						>
							Selesai (Ada Jawaban)
						</button>
						<button
							type="button"
							onclick={() => (responseStatus = 'ditolak')}
							class="rounded-lg border px-4 py-3 text-sm font-semibold transition-all {responseStatus ===
							'ditolak'
								? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20'
								: 'border-slate-200 text-slate-600 hover:bg-slate-50'}"
						>
							Tolak / Tidak Tersedia
						</button>
					</div>
				</div>

				<div>
					<label
						for="message"
						class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
					>
						{responseStatus === 'selesai' ? 'Jawaban / Informasi' : 'Keterangan / Alasan'}
						<span class="text-red-500">*</span>
					</label>
					<textarea
						id="message"
						bind:value={responseMessage}
						rows="5"
						placeholder="Tuliskan respon Anda di sini..."
						class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-ppid-primary focus:ring-2 focus:ring-ppid-primary/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						required
					></textarea>
				</div>

				<div>
					<label
						for="file"
						class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>Lampiran File (Opsional)</label
					>
					<input
						type="file"
						id="file"
						accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
						onchange={(e) => (file = e.currentTarget.files?.[0] || null)}
						class="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-slate-200 focus:border-ppid-primary focus:outline-none dark:border-slate-600 dark:bg-slate-700"
					/>
					<p class="mt-1 text-xs text-slate-500">Mendukung: PDF, Word, Gambar, ZIP (Max 10MB)</p>
				</div>

				<div class="flex gap-3 pt-4">
					<button
						type="button"
						onclick={closeResponseModal}
						class="flex-1 rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
					>
						Batal
					</button>
					<button
						type="button"
						onclick={handleResponseSubmit}
						disabled={!responseMessage}
						class="flex-1 rounded-lg bg-gradient-to-r from-ppid-primary to-ppid-primary-light px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-ppid-primary-light hover:to-ppid-primary disabled:cursor-not-allowed disabled:opacity-50"
					>
						Kirim Respon
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<ConfirmationDialog
	bind:show={showConfirmation}
	title={confirmationConfig.title}
	description={confirmationConfig.description}
	onConfirm={confirmationConfig.action}
	{isLoading}
/>

<SuccessModal bind:isOpen={showSuccess} title="Berhasil!" message={successMessage} />
