<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface FAQ {
		id_faq: number;
		pertanyaan: string;
		jawaban: string;
		is_active: boolean;
		urutan: number | null;
		created_at: string;
		updated_at: string;
	}

	let faqId = $state('');
	let faq = $state<FAQ | null>(null);
	let isLoading = $state(true);

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
				faq = result.data;
			}
		} catch (error) {
			console.error('Failed to fetch FAQ:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Detail FAQ - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<!-- Back Button -->
	<div class="mb-6 flex items-center gap-4">
		<a
			href="/admin/faq"
			class="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-300"
			aria-label="Kembali ke daftar FAQ"
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
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</a>
		<h3 class="text-lg font-bold text-ppid-primary dark:text-white">
			{faq?.pertanyaan || 'Loading...'}
		</h3>
	</div>

	{#if isLoading}
		<div
			class="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="flex flex-col items-center gap-3">
				<svg
					class="h-8 w-8 animate-spin text-ppid-primary"
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
	{:else if faq}
		<div
			class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div
				class="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-700"
			>
				<h3 class="text-lg font-bold text-ppid-primary dark:text-white">Detail FAQ</h3>
				<div class="flex gap-2">
					<a
						href="/admin/faq/{faq.id_faq}/edit"
						class="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
					>
						Edit
					</a>
				</div>
			</div>

			<div class="space-y-6 p-6">
				<!-- Pertanyaan -->
				<div>
					<h4 class="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">Pertanyaan</h4>
					<div class="text-lg font-medium text-slate-900 dark:text-slate-100">
						{faq.pertanyaan}
					</div>
				</div>

				<div class="my-4 border-t border-slate-100 dark:border-slate-700"></div>

				<!-- Jawaban -->
				<div>
					<h4 class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Jawaban</h4>
					<div
						class="max-w-none rounded-lg border border-slate-100 bg-slate-50 p-4 text-slate-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
					>
						{faq.jawaban}
					</div>
				</div>

				<div class="grid grid-cols-2 gap-6 pt-4">
					<!-- Status -->
					<div>
						<h4 class="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">Status</h4>
						<span
							class="inline-block rounded-full border px-2.5 py-1 text-xs font-medium {faq.is_active
								? 'border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
								: 'border-slate-100 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400'}"
						>
							{faq.is_active ? 'Aktif' : 'Non-Aktif'}
						</span>
					</div>

					<!-- Urutan -->
					<div>
						<h4 class="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">Urutan</h4>
						<div class="text-slate-900 dark:text-slate-100">{faq.urutan ?? '-'}</div>
					</div>
				</div>
			</div>

			<div
				class="border-t border-slate-100 bg-slate-50 p-6 text-right dark:border-slate-700 dark:bg-slate-700/50"
			>
				<a
					href="/admin/faq"
					class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Kembali
				</a>
			</div>
		</div>
	{:else}
		<div
			class="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<p class="text-slate-500 dark:text-slate-400">Data FAQ tidak ditemukan.</p>
		</div>
	{/if}
</div>
