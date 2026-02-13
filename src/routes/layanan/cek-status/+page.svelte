<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { api } from '$lib/api';
	import { PUBLIC_API_URL } from '$env/static/public';

	interface BaseResponse<T> {
		success: boolean;
		type: 'permohonan' | 'keberatan';
		data: T[];
		message?: string;
	}

	interface PermohonanData {
		id_permohonan: number;
		no_pendaftaran: string | null;
		rincian: string | null;
		tujuan: string | null;
		status_label_display: string;
		status_color: string;
		formatted_date: string;
		jawaban?: string | null;
		keterangan?: string | null;
		file?: string | null;
	}

	interface KeberatanData {
		id_pengajuan: number;
		no_pendaftaran: string | null;
		kasus: string | null;
		tujuan: string | null;
		feedback: string | null;
		status_label_display: string;
		status_color: string;
		formatted_date: string;
		file?: string | null;
		alasan_pengajuan?: Array<{ alasan: string }>;
	}

	type SearchResult = PermohonanData | KeberatanData;

	// State menggunakan Svelte 5 Runes [cite: 20]
	let type = $state<'permohonan' | 'keberatan'>('permohonan');
	let email = $state('');
	let loading = $state(false);
	let error = $state('');
	let results = $state<SearchResult[]>([]);

	// Type Guard untuk pengecekan properti di template
	function isPermohonan(item: SearchResult): item is PermohonanData {
		return 'id_permohonan' in item;
	}

	async function searchStatus(e: Event) {
		e.preventDefault();
		if (!email) return;

		loading = true;
		error = '';
		results = [];

		try {
			// Menggunakan PUBLIC_API_URL dan endpoint tunggal
			const query = new URLSearchParams({ email, type }).toString();
			const response = await fetch(`${PUBLIC_API_URL}/public/cek-status?${query}`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			if (data.success) {
				results = data.data;
				if (results.length === 0) {
					error = m['common.no_data_email']();
				} else {
					setTimeout(() => {
						document.getElementById('hasil-pencarian')?.scrollIntoView({ behavior: 'smooth' });
					}, 100);
				}
			} else {
				error = data.message || 'Gagal mengambil data.';
			}
		} catch (err) {
			error = m['form.alert.server_error']();
			console.error('API Error:', err);
		} finally {
			loading = false;
		}
	}

	function resetForm() {
		results = [];
		error = '';
	}
</script>

<svelte:head>
	<title>{m['layanan_pages.check_status_title']()} | PPID Sulsel</title>
</svelte:head>

<section
	class="relative overflow-hidden bg-linear-to-br from-ppid-primary via-ppid-primary-light to-ppid-primary pb-32 text-white md:pb-40"
>
	<div class="relative z-10 container mx-auto px-4 pt-16 text-center md:pt-24">
		<h1 class="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">
			{m['layanan_pages.check_status_title']()}
		</h1>
		<p class="mb-12 text-lg font-medium text-blue-100 sm:text-xl md:text-2xl">
			{m['layanan_pages.check_status_subtitle']()}
		</p>
	</div>
</section>

<section class="relative z-20 -mt-24 pb-16 md:-mt-32">
	<div class="container mx-auto px-4">
		<div
			class="mx-auto max-w-4xl rounded-[2.5rem] border-2 border-ppid-primary/10 bg-white p-8 shadow-2xl md:p-14 dark:bg-slate-800"
		>
			<div class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2" role="radiogroup">
				<button
					type="button"
					onclick={() => {
						type = 'permohonan';
						resetForm();
					}}
					class="flex items-center gap-4 rounded-2xl border-2 p-6 transition-all {type ===
					'permohonan'
						? 'scale-105 border-ppid-accent bg-ppid-primary text-white'
						: 'border-transparent bg-slate-50 text-slate-700'}"
				>
					<div class="text-left">
						<div class="text-lg font-bold">{m['layanan_pages.permohonan_title']()}</div>
						<div class="text-sm opacity-80">Pantau permohonan informasi Anda</div>
					</div>
				</button>

				<button
					type="button"
					onclick={() => {
						type = 'keberatan';
						resetForm();
					}}
					class="flex items-center gap-4 rounded-2xl border-2 p-6 transition-all {type ===
					'keberatan'
						? 'scale-105 border-ppid-accent bg-ppid-primary text-white'
						: 'border-transparent bg-slate-50 text-slate-700'}"
				>
					<div class="text-left">
						<div class="text-lg font-bold">{m['layanan_pages.keberatan_title']()}</div>
						<div class="text-sm opacity-80">Cek status pengajuan keberatan</div>
					</div>
				</button>
			</div>

			<form onsubmit={searchStatus} class="space-y-6">
				<div>
					<label
						for="email"
						class="mb-3 block text-lg font-semibold text-ppid-primary dark:text-white"
						>Email Pemohon</label
					>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						class="w-full rounded-2xl border-2 border-slate-300 px-6 py-5 text-xl focus:border-ppid-primary focus:ring-4 focus:ring-ppid-accent/20 dark:bg-slate-700 dark:text-white"
						placeholder="contoh@email.com"
					/>
				</div>

				{#if error}
					<div class="rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-red-700" role="alert">
						{error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-2xl bg-ppid-primary py-6 text-2xl font-bold text-white shadow-xl transition-all hover:bg-ppid-primary-hover disabled:opacity-50"
				>
					{loading ? m['form.searching']() : m['form.check_my_status']()}
				</button>
			</form>
		</div>
	</div>
</section>

{#if results.length > 0}
	<section id="hasil-pencarian" class="bg-slate-50 py-20 dark:bg-slate-900">
		<div class="container mx-auto max-w-7xl space-y-8 px-4">
			{#each results as item}
				<article
					class="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="flex flex-col items-start justify-between gap-4 bg-ppid-primary p-6 text-white md:flex-row md:items-center"
					>
						<div>
							<h3 class="text-2xl font-bold">
								{isPermohonan(item)
									? `Permohonan #${item.no_pendaftaran || item.id_permohonan}`
									: `Keberatan #${item.no_pendaftaran || item.id_pengajuan}`}
							</h3>
							<p class="opacity-80">{item.formatted_date}</p>
						</div>
						<span
							class="rounded-full px-6 py-2 text-sm font-bold ring-2 ring-white/30 {item.status_color}"
						>
							{item.status_label_display}
						</span>
					</div>

					<div class="grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
						<div class="space-y-4">
							<h4 class="text-xs font-bold tracking-widest text-slate-400 uppercase">
								Detail Informasi
							</h4>
							<p class="text-lg font-medium text-slate-800 dark:text-white">
								{isPermohonan(item) ? item.rincian : item.kasus}
							</p>

							{#if !isPermohonan(item) && item.alasan_pengajuan}
								<ul class="list-inside list-disc text-slate-600 dark:text-slate-400">
									{#each item.alasan_pengajuan as alasan}
										<li>{alasan.alasan}</li>
									{/each}
								</ul>
							{/if}
						</div>

						<div class="space-y-4 rounded-2xl bg-slate-50 p-6 dark:bg-slate-700/50">
							<h4 class="text-xs font-bold text-ppid-primary uppercase">Tanggapan PPID</h4>
							<p class="text-slate-700 italic dark:text-slate-300">
								"{isPermohonan(item)
									? item.jawaban || item.keterangan || 'Menunggu verifikasi...'
									: item.feedback || 'Sedang diproses...'}"
							</p>

							{#if item.file}
								<div class="mt-4 border-t border-slate-200 pt-4 dark:border-slate-600">
									<a
										href="{PUBLIC_API_URL}/public/informasi/download/{isPermohonan(item)
											? item.id_permohonan
											: item.id_pengajuan}"
										target="_blank"
										class="inline-flex items-center gap-2 rounded-xl bg-ppid-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-ppid-primary-dark"
									>
										Unduh Lampiran Jawaban
									</a>
								</div>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>
{/if}

<Footer />
