<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface Respondent {
		kode: string;
		nama: string;
		email: string;
		lembaga: string;
		alamat: string;
		tanggal: string;
		created_at: string;
	}

	interface Question {
		id: number;
		urutan: number;
		soal: string;
		tipe: 'radio' | 'textarea';
	}

	let kode = $state('');
	let respondent = $state<Respondent | null>(null);
	let questions = $state<Question[]>([]);
	let answersMap = $state<Record<string, string>>({});
	let isLoading = $state(true);

	onMount(async () => {
		kode = window.location.pathname.split('/')[3];
		await fetchResponse();
	});

	async function fetchResponse() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/admin/survey-responses/${kode}`, {
				credentials: 'include'
			});
			const result = await response.json();

			if (result.success) {
				respondent = result.data.respondent;
				questions = result.data.questions;
				answersMap = result.data.answersMap;
			}
		} catch (error) {
			console.error('Failed to fetch response:', error);
		} finally {
			isLoading = false;
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatDateTime(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Detail Hasil Survey - Admin PPID</title>
</svelte:head>

<div class="p-8">
	<div class="mx-auto max-w-5xl">
		{#if isLoading}
			<div class="flex items-center justify-center py-24">
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
					<p class="text-sm text-slate-500 dark:text-slate-400">Memuat data...</p>
				</div>
			</div>
		{:else if respondent}
			<!-- Header -->
			<div class="mb-8">
				<a
					href="/admin/survey-responses"
					class="mb-4 inline-flex items-center gap-2 text-ppid-primary hover:underline dark:text-blue-400"
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
					Kembali ke Daftar Survey
				</a>
				<h1 class="mb-2 text-3xl font-bold text-slate-800 dark:text-white">Detail Hasil Survey</h1>
				<p class="text-slate-600 dark:text-slate-400">
					Kode Survey: <span class="font-mono font-semibold">{kode}</span>
				</p>
			</div>

			<!-- Respondent Information -->
			<div
				class="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-6 flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-ppid-primary text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<h2 class="text-xl font-bold text-slate-800 dark:text-white">Data Responden</h2>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label class="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-400"
							>Nama Lengkap</label
						>
						<p class="text-base font-medium text-slate-900 dark:text-white">
							{respondent.nama}
						</p>
					</div>
					<div>
						<label class="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-400"
							>Email</label
						>
						<p class="text-base font-medium text-slate-900 dark:text-white">
							{respondent.email}
						</p>
					</div>
					<div>
						<label class="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-400"
							>Lembaga</label
						>
						<p class="text-base font-medium text-slate-900 dark:text-white">
							{respondent.lembaga}
						</p>
					</div>
					<div>
						<label class="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-400"
							>Tanggal Permintaan Informasi</label
						>
						<p class="text-base font-medium text-slate-900 dark:text-white">
							{formatDate(respondent.tanggal)}
						</p>
					</div>
					<div class="md:col-span-2">
						<label class="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-400"
							>Alamat</label
						>
						<p class="text-base font-medium text-slate-900 dark:text-white">
							{respondent.alamat}
						</p>
					</div>
					<div class="md:col-span-2">
						<label class="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-400"
							>Waktu Pengisian Survey</label
						>
						<p class="text-base font-medium text-slate-900 dark:text-white">
							{formatDateTime(respondent.created_at)} WIB
						</p>
					</div>
				</div>
			</div>

			<!-- Survey Answers -->
			<div
				class="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="mb-6 flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-ppid-accent text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h2 class="text-xl font-bold text-slate-800 dark:text-white">Jawaban Penilaian</h2>
				</div>

				<div class="space-y-6">
					{#each questions as question, index}
						{@const kodeSoal = 'Q' + question.urutan}
						{@const answer = answersMap[kodeSoal] || '-'}
						<div
							class="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-600 dark:bg-slate-700/50"
						>
							<div class="mb-3 flex items-start gap-3">
								<span
									class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ppid-primary text-sm font-bold text-white"
									>{index + 1}</span
								>
								<p class="text-base leading-relaxed font-semibold text-slate-900 dark:text-white">
									{question.soal}
								</p>
							</div>
							<div class="ml-11">
								{#if question.tipe === 'radio'}
									<div
										class="inline-flex items-center gap-2 rounded-lg border-2 border-ppid-primary bg-white px-4 py-2 dark:border-blue-500 dark:bg-slate-800"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-ppid-primary dark:text-blue-500"
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
										<span class="font-semibold text-ppid-primary dark:text-blue-400">{answer}</span>
									</div>
								{:else}
									<p class="text-slate-700 italic dark:text-slate-300">{answer}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Feedback/Masukan -->
			{#if answersMap['masukan']}
				<div
					class="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-6 flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
								/>
							</svg>
						</div>
						<h2 class="text-xl font-bold text-slate-800 dark:text-white">Masukan & Saran</h2>
					</div>
					<div
						class="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-600 dark:bg-slate-700/50"
					>
						<p class="text-base leading-relaxed text-slate-700 dark:text-slate-300">
							{answersMap['masukan']}
						</p>
					</div>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="mt-8 flex justify-end gap-4">
				<a
					href="/admin/survey-responses"
					class="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
				>
					Kembali ke Daftar
				</a>
			</div>
		{/if}
	</div>
</div>
