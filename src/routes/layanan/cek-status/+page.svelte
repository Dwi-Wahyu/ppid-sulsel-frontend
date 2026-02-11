<script>
	import Footer from '$lib/components/Footer.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { api } from '$lib/api';

	// State
	let type = $state('permohonan'); // 'permohonan' or 'keberatan'
	let email = $state('');
	let loading = $state(false);
	let error = $state('');
	let results = $state([]);

	// Functions
	async function searchStatus(e) {
		e.preventDefault();

		if (!email) return;

		loading = true;
		error = '';
		results = [];

		try {
			// Call API based on type
			let endpoint = '';
			if (type === 'permohonan') {
				endpoint = `/public/permohonan-informasi/search?email=${encodeURIComponent(email)}`;
			} else {
				// TODO: Implement endpoint for keberatan if needed, for now simulate or alert
				// endpoint = `/public/pengajuan-keberatan/search?email=${encodeURIComponent(email)}`;
				// Assuming currently only permohonan is requested
				alert('Fitur cek status keberatan belum tersedia saat ini.');
				loading = false;
				return;
			}

			const response = await api.get(endpoint);

			if (response.success) {
				results = response.data;

				if (results.length === 0) {
					error = 'Data tidak ditemukan untuk email tersebut.';
				} else {
					// Scroll to results
					setTimeout(() => {
						document.getElementById('hasil-pencarian')?.scrollIntoView({ behavior: 'smooth' });
					}, 100);
				}
			} else {
				error = response.message || 'Gagal mengambil data.';
			}
		} catch (err) {
			error = 'Terjadi kesalahan koneksi. Silakan coba lagi.';
			console.error('Error:', err);
		} finally {
			loading = false;
		}
	}

	function resetForm() {
		results = [];
		error = '';
	}

	function formatDate(dateString) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	}

	function getStatusColor(status) {
		switch (status) {
			case 'Selesai':
				return 'text-green-600 bg-green-50 border-green-200';
			case 'Diproses':
			case 'Ditinjau':
				return 'text-yellow-600 bg-yellow-50 border-yellow-200';
			case 'Ditolak':
				return 'text-red-600 bg-red-50 border-red-200';
			default:
				return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	}
</script>

<!-- Hero Section -->
<section
	class="relative overflow-hidden bg-gradient-to-br from-ppid-primary via-ppid-primary-light to-ppid-primary pb-32 text-white md:pb-40"
>
	<div class="relative z-10 container mx-auto px-4 pt-16 text-center sm:px-6 md:pt-24">
		<!-- Title -->
		<h1
			class="mb-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
		>
			<span class="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
				Cek Status
			</span>
		</h1>

		<!-- Subtitle -->
		<p
			class="mb-12 text-lg leading-relaxed font-medium text-blue-100 sm:text-xl md:mb-16 md:text-2xl"
		>
			Lacak perkembangan permohonan informasi dan pengajuan keberatan Anda secara real-time
		</p>
	</div>

	<!-- Wave Divider -->
	<div class="absolute right-0 bottom-0 left-0">
		<svg
			class="h-auto w-full"
			viewBox="0 0 1440 120"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
		>
			<path
				d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
				fill="white"
				class="dark:fill-slate-900"
			/>
		</svg>
	</div>
</section>

<!-- Form Section -->
<section class="relative z-20 -mt-24 pb-16 md:-mt-32">
	<div class="relative container mx-auto px-4 sm:px-6">
		<div class="mx-auto max-w-4xl">
			<div
				class="rounded-[2.5rem] border-2 border-ppid-primary/10 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-8 shadow-2xl md:p-14 dark:border-blue-500/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
			>
				<div class="mb-10 text-center">
					<h2
						class="mb-4 text-2xl font-bold text-ppid-primary sm:text-3xl md:text-4xl dark:text-white"
					>
						Pilih Jenis Layanan
					</h2>
					<p class="text-slate-600 dark:text-slate-400">
						Pilih jenis layanan yang ingin Anda cek statusnya
					</p>
				</div>

				<!-- Type Selector -->
				<div class="mb-10">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<!-- Permohonan Button -->
						<button
							type="button"
							onclick={() => {
								type = 'permohonan';
								resetForm();
							}}
							class="group relative transform rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg"
							class:bg-gradient-to-r={type === 'permohonan'}
							class:from-ppid-primary={type === 'permohonan'}
							class:to-ppid-primary-light={type === 'permohonan'}
							class:text-white={type === 'permohonan'}
							class:shadow-xl={type === 'permohonan'}
							class:scale-105={type === 'permohonan'}
							class:border-ppid-accent={type === 'permohonan'}
							class:bg-white={type !== 'permohonan'}
							class:dark:bg-slate-700={type !== 'permohonan'}
							class:text-slate-700={type !== 'permohonan'}
							class:dark:text-slate-300={type !== 'permohonan'}
							class:border-transparent={type !== 'permohonan'}
						>
							<div class="flex items-center gap-4">
								<div
									class="rounded-xl p-3 transition-colors {type === 'permohonan'
										? 'bg-white/10'
										: 'bg-slate-100 dark:bg-slate-600'}"
								>
									<svg
										class="h-8 w-8 transition-colors {type === 'permohonan'
											? 'text-ppid-accent'
											: 'text-ppid-primary dark:text-slate-300'}"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										></path>
									</svg>
								</div>
								<div class="text-left">
									<div class="mb-1 text-lg font-bold">Permohonan Informasi</div>
									<div class="text-sm opacity-90">Cek status permohonan informasi publik</div>
								</div>
							</div>
							{#if type === 'permohonan'}
								<div class="absolute top-3 right-3">
									<svg class="h-6 w-6 text-ppid-accent" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
								</div>
							{/if}
						</button>

						<!-- Keberatan Button -->
						<button
							type="button"
							onclick={() => {
								type = 'keberatan';
								resetForm();
							}}
							class="group relative transform rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg"
							class:bg-gradient-to-r={type === 'keberatan'}
							class:from-ppid-primary={type === 'keberatan'}
							class:to-ppid-primary-light={type === 'keberatan'}
							class:text-white={type === 'keberatan'}
							class:shadow-xl={type === 'keberatan'}
							class:scale-105={type === 'keberatan'}
							class:border-ppid-accent={type === 'keberatan'}
							class:bg-white={type !== 'keberatan'}
							class:dark:bg-slate-700={type !== 'keberatan'}
							class:text-slate-700={type !== 'keberatan'}
							class:dark:text-slate-300={type !== 'keberatan'}
							class:border-transparent={type !== 'keberatan'}
						>
							<div class="flex items-center gap-4">
								<div
									class="rounded-xl p-3 transition-colors {type === 'keberatan'
										? 'bg-white/10'
										: 'bg-slate-100 dark:bg-slate-600'}"
								>
									<svg
										class="h-8 w-8 transition-colors {type === 'keberatan'
											? 'text-ppid-accent'
											: 'text-ppid-primary dark:text-slate-300'}"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										></path>
									</svg>
								</div>
								<div class="text-left">
									<div class="mb-1 text-lg font-bold">Pengajuan Keberatan</div>
									<div class="text-sm opacity-90">Cek status pengajuan keberatan</div>
								</div>
							</div>
							{#if type === 'keberatan'}
								<div class="absolute top-3 right-3">
									<svg class="h-6 w-6 text-ppid-accent" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
								</div>
							{/if}
						</button>
					</div>
				</div>

				<!-- Search Form -->
				<form onsubmit={searchStatus} class="mx-auto max-w-2xl">
					<div class="mb-8">
						<label class="mb-3 block text-lg font-semibold text-ppid-primary dark:text-white">
							Email {type === 'permohonan' ? 'Pemohon' : 'Pengaju'}
						</label>
						<div class="group relative">
							<input
								type="email"
								bind:value={email}
								required
								class="w-full rounded-2xl border-2 border-slate-300 bg-white px-6 py-5 text-xl text-slate-900 transition-all duration-300 focus:border-ppid-primary focus:ring-4 focus:ring-ppid-accent/30 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
								placeholder="contoh: nama@email.com"
							/>
						</div>
					</div>

					{#if error}
						<div
							class="mb-8 rounded-2xl border-2 border-red-300 bg-red-50 p-5 dark:border-red-700 dark:bg-red-900/30"
						>
							<p class="flex items-center gap-3 font-semibold text-red-700 dark:text-red-300">
								<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clip-rule="evenodd"
									></path>
								</svg>
								<span>{error}</span>
							</p>
						</div>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="flex w-full transform items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-ppid-primary to-ppid-primary-light px-8 py-6 text-xl font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:from-ppid-primary-hover hover:to-ppid-primary disabled:opacity-50 md:text-2xl"
					>
						{#if loading}
							<svg class="h-7 w-7 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							<span>Mencari...</span>
						{:else}
							<span>Cek Status Saya</span>
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
</section>

<!-- Results Section -->
{#if results.length > 0}
	<section id="hasil-pencarian" class="bg-slate-50 py-12 md:py-20 dark:bg-slate-900">
		<div class="container mx-auto px-4 sm:px-6">
			<div class="mb-12 text-center">
				<div
					class="inline-flex flex-col items-center gap-4 rounded-2xl border-2 border-ppid-primary/10 bg-white px-8 py-5 shadow-lg sm:flex-row dark:bg-slate-800"
				>
					<h2 class="text-2xl font-bold text-ppid-primary sm:text-3xl dark:text-white">
						{type === 'permohonan' ? 'Riwayat Permohonan Informasi' : 'Riwayat Pengajuan Keberatan'}
					</h2>
					<span class="rounded-full bg-ppid-accent px-4 py-1 text-sm font-bold text-white">
						{results.length} Data
					</span>
				</div>
			</div>

			<div class="mx-auto max-w-7xl space-y-10">
				{#each results as item (type === 'permohonan' ? item.id_permohonan : item.id_pengajuan)}
					<div
						class="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
					>
						<!-- Header -->
						<div class="bg-gradient-to-r from-ppid-primary to-ppid-primary-light p-6">
							<div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
								<div>
									<h3 class="mb-2 text-2xl font-bold text-white">
										{type === 'permohonan'
											? `Permohonan #${item.id_permohonan}`
											: `Keberatan #${item.id_pengajuan}`}
									</h3>
									<p class="text-blue-100">
										Tanggal: {formatDate(
											type === 'permohonan' ? item.tgl_permohonan : item.tgl_pengajuan
										)}
									</p>
								</div>
								<div>
									<span
										class="inline-flex items-center gap-2 rounded-full border-2 px-6 py-2 text-base font-bold {getStatusColor(
											item.status
										)}"
									>
										<span class="h-2 w-2 rounded-full bg-current"></span>
										{item.status}
									</span>
								</div>
							</div>
						</div>

						<!-- Body -->
						<div class="p-6">
							<div class="space-y-4">
								<div>
									<label class="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400">
										{type === 'permohonan' ? 'Rincian Informasi' : 'Alasan Keberatan'}
									</label>
									<p class="text-lg text-gray-800 dark:text-white">
										{type === 'permohonan' ? item.rincian : item.alasan_keberatan}
									</p>
								</div>

								{#if item.tgl_selesai}
									<div>
										<label
											class="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400"
										>
											Tanggal Selesai
										</label>
										<p class="text-lg text-gray-800 dark:text-white">
											{formatDate(item.tgl_selesai)}
										</p>
									</div>
								{/if}

								<div>
									<label class="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400">
										{type === 'permohonan' ? 'Keterangan' : 'Jawaban'}
									</label>
									<p
										class="rounded-lg bg-blue-50 p-4 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
									>
										{type === 'permohonan' ? item.keterangan : item.jawaban}
									</p>
								</div>

								{#if item.file_url}
									<div class="mt-4">
										<a
											href={item.file_url}
											target="_blank"
											class="inline-flex items-center gap-2 rounded-lg bg-ppid-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ppid-primary-dark"
										>
											<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											Unduh Dokumen / Jawaban
										</a>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<Footer />

<style>
	[x-cloak] {
		display: none !important;
	}
</style>
