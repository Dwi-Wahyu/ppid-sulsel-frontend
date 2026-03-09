<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { PUBLIC_API_URL, PUBLIC_BACKEND_URL } from '$env/static/public';

	// --- Interfaces ---
	interface DisposisiRespon {
		id_respon: number;
		respon: string;
		file: string | null;
		responded_at: string;
	}

	interface Disposisi {
		id_disposisi: number;
		status: string;
		catatan_disposisi: string | null;
		created_at: string;
		skpd: { nm_skpd: string } | null;
		respon: DisposisiRespon[];
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
		responded_by?: string | null;
		disposisi: Disposisi[];
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
		disposisi: Disposisi[];
	}

	type SearchResult = PermohonanData | KeberatanData;

	// --- State (Svelte 5 Runes) ---
	let type = $state<'permohonan' | 'keberatan'>('permohonan');
	let email = $state('');
	let loading = $state(false);
	let error = $state('');
	let results = $state<SearchResult[]>([]);

	// --- Helpers ---
	function isPermohonan(item: SearchResult): item is PermohonanData {
		return 'id_permohonan' in item;
	}

	function resetForm() {
		results = [];
		error = '';
	}

	async function searchStatus(e: Event) {
		e.preventDefault();
		if (!email) return;

		loading = true;
		error = '';
		results = [];

		try {
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
		<div class="container mx-auto max-w-7xl space-y-12 px-4">
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
							<p class="font-medium opacity-80">{item.formatted_date}</p>
						</div>
						<span
							class="rounded-full px-6 py-2 text-sm font-bold ring-2 ring-white/30 {item.status_color}"
						>
							{item.status_label_display}
						</span>
					</div>

					<div class="p-8">
						<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
							<div class="space-y-6">
								<div>
									<h4 class="mb-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
										Detail Informasi
									</h4>
									<p class="text-lg font-medium text-slate-800 dark:text-white">
										{isPermohonan(item) ? item.rincian : item.kasus}
									</p>
								</div>

								{#if !isPermohonan(item) && item.alasan_pengajuan}
									<div>
										<h4 class="mb-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
											Alasan Keberatan
										</h4>
										<ul class="space-y-2">
											{#each item.alasan_pengajuan as alasan}
												<li class="flex items-start gap-2 text-slate-600 dark:text-slate-400">
													<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ppid-accent"
													></span>
													{alasan.alasan}
												</li>
											{/each}
										</ul>
									</div>
								{/if}
							</div>

							<div class="space-y-6 rounded-3xl bg-slate-50 p-8 dark:bg-slate-700/50">
								<div>
									<h4 class="mb-3 text-xs font-bold tracking-widest text-ppid-primary uppercase">
										Tanggapan PPID Utama
									</h4>
									<div
										class="prose leading-relaxed text-slate-700 italic dark:text-slate-300 dark:prose-invert"
									>
										{#if isPermohonan(item)}
											"{item.jawaban ||
												item.keterangan ||
												'Permohonan Anda sedang dalam tahap verifikasi oleh petugas kami.'}"
										{:else}
											"{item.feedback ||
												'Pengajuan keberatan Anda telah diterima dan sedang diproses oleh atasan PPID.'}"
										{/if}
									</div>
									{#if isPermohonan(item) && item.responded_by}
										<p class="mt-4 text-xs font-semibold text-slate-500 italic">
											— Respon oleh: {item.responded_by}
										</p>
									{/if}
								</div>

								{#if item.file}
									<div class="border-t border-slate-200 pt-6 dark:border-slate-600">
										<a
											href="{PUBLIC_BACKEND_URL}/uploads/{isPermohonan(item)
												? item.id_permohonan
												: item.id_pengajuan}"
											target="_blank"
											class="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-ppid-primary px-6 py-4 text-base font-bold text-white shadow-lg shadow-ppid-primary/20 transition-all hover:bg-ppid-primary-dark"
										>
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
												/></svg
											>
											Unduh Dokumen Balasan
										</a>
									</div>
								{/if}
							</div>
						</div>

						{#if item.disposisi && item.disposisi.length > 0}
							<div class="mt-12 border-t border-slate-100 pt-10 dark:border-slate-700">
								<h4
									class="mb-8 text-center text-sm font-bold tracking-widest text-slate-400 uppercase"
								>
									Tracking Status Unit Kerja (OPD)
								</h4>
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{#each item.disposisi as disp}
										<div
											class="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-700 dark:bg-slate-900/30"
										>
											<div class="mb-3 flex items-center justify-between">
												<span
													class="text-[10px] font-black tracking-tighter text-slate-400 uppercase"
													>Unit Kerja</span
												>
												<span
													class="rounded-md bg-white px-2 py-1 text-[10px] font-bold shadow-sm dark:bg-slate-800
													{disp.status === 'selesai' ? 'text-green-600' : 'text-amber-500'}"
												>
													{disp.status.toUpperCase()}
												</span>
											</div>
											<h5
												class="mb-4 line-clamp-2 text-sm font-bold text-slate-800 dark:text-slate-200"
											>
												{disp.skpd?.nm_skpd || 'OPD Terkait'}
											</h5>

											{#each disp.respon as res}
												<div
													class="mt-2 rounded-xl bg-white p-3 text-xs shadow-sm dark:bg-slate-800"
												>
													<p class="text-slate-600 italic dark:text-slate-400">"{res.respon}"</p>
												</div>
											{/each}
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>
{/if}

<Footer />
