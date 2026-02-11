<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// State
	let selectedSkpd = $state<string[]>([]);
	let showUpdateModal = $state(false);
	let showDispositionModal = $state(false);
	let showRejectModal = $state(false);
	let pesan = $state('');
	let rejectReason = $state('');
	let dispositionMessage = $state('');

	// Derived values
	let assignedSkpdIds = $derived(data.permohonan.disposisi?.map((d) => d.id_skpd) || []);
	let availableSkpd = $derived(
		data.skpdList.filter((skpd) => !assignedSkpdIds.includes(skpd.id_skpd))
	);

	// Status config
	const statusOptions = [
		{ value: 0, label: 'Menunggu Verifikasi', color: 'bg-amber-100 text-amber-700' },
		{ value: 1, label: 'Sedang Diproses', color: 'bg-blue-100 text-blue-700' },
		{ value: 2, label: 'Dijawab', color: 'bg-emerald-100 text-emerald-700' },
		{ value: 3, label: 'Ditolak', color: 'bg-red-100 text-red-700' },
		{ value: 4, label: 'Dibatalkan', color: 'bg-slate-100 text-slate-700' },
		{ value: 5, label: 'Disposisi', color: 'bg-purple-100 text-purple-700' }
	];

	function getStatusConfig(status: number) {
		return statusOptions.find((s) => s.value === status) || statusOptions[0];
	}

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

	function toggleSkpd(skpdId: string) {
		if (selectedSkpd.includes(skpdId)) {
			selectedSkpd = selectedSkpd.filter((id) => id !== skpdId);
		} else {
			selectedSkpd = [...selectedSkpd, skpdId];
		}
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

	function closeUpdateModal() {
		showUpdateModal = false;
		pesan = '';
	}

	function closeRejectModal() {
		showRejectModal = false;
		rejectReason = '';
	}

	function closeDispositionModal() {
		showDispositionModal = false;
		selectedSkpd = [];
		dispositionMessage = '';
	}

	// Close modal when clicking backdrop
	function handleBackdropClick(event: MouseEvent, closeFunc: () => void) {
		if (event.target === event.currentTarget) {
			closeFunc();
		}
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			if (showUpdateModal) closeUpdateModal();
			if (showDispositionModal) closeDispositionModal();
			if (showRejectModal) closeRejectModal();
		}
	}}
/>

<svelte:head>
	<title>Detail Permohonan #{data.permohonan.id_permohonan}</title>
</svelte:head>

<!-- Header -->
<div
	class="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A305E] to-[#2A4A8E] p-8 text-white shadow-xl"
>
	<div class="flex items-start justify-between">
		<div class="flex-1">
			<div class="mb-2 flex items-center gap-3">
				<a
					href="/admin/permohonan-informasi"
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
				<h1 class="text-2xl font-bold">Detail Permohonan Informasi</h1>
			</div>
			<div class="flex items-center gap-4">
				<p class="text-lg opacity-90">
					<span class="font-semibold">#{data.permohonan.id_permohonan}</span> - {data.permohonan
						.nama}
				</p>
				<span
					class="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-sm font-semibold"
				>
					{getStatusConfig(data.permohonan.status).label}
				</span>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="grid gap-6 lg:grid-cols-3">
	<!-- Left: Details -->
	<div class="space-y-6 lg:col-span-2">
		<!-- Identitas Pemohon -->
		<div
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="border-b border-slate-200 bg-gradient-to-r from-[#1A305E] to-[#2A4A8E] p-4">
				<h2 class="flex items-center gap-2 text-lg font-bold text-white">
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
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
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
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Email</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{data.permohonan.email}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">No. HP</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{data.permohonan.no_hp}
						</dd>
					</div>
					{#if data.permohonan.nik}
						<div>
							<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">NIK</dt>
							<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
								{data.permohonan.nik}
							</dd>
						</div>
					{/if}
					<div class="md:col-span-2">
						<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">Alamat</dt>
						<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
							{data.permohonan.alamat}
						</dd>
					</div>
				</dl>
				{#if data.permohonan.foto_ktp}
					<div class="mt-4">
						<dt class="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">Foto KTP</dt>
						<a
							href="http://localhost:8000/storage/{data.permohonan.foto_ktp}"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 text-sm text-[#1A305E] hover:text-[#B8860B] dark:text-blue-400 dark:hover:text-blue-300"
						>
							<svg
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							Lihat KTP
						</a>
					</div>
				{/if}
			</div>
		</div>

		<!-- Informasi yang Diminta -->
		<div
			class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
		>
			<div class="border-b border-slate-200 bg-gradient-to-r from-[#1A305E] to-[#2A4A8E] p-4">
				<h2 class="flex items-center gap-2 text-lg font-bold text-white">
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
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					Informasi yang Diminta
				</h2>
			</div>
			<div class="p-6">
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
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">
								Cara Memperoleh
							</dt>
							<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
								{data.permohonan.cara_memperoleh}
							</dd>
						</div>
						<div>
							<dt class="text-sm font-semibold text-slate-600 dark:text-slate-400">
								Bentuk Salinan
							</dt>
							<dd class="mt-1 text-base text-slate-900 dark:text-slate-100">
								{data.permohonan.cara_mendapat_salinan}
							</dd>
						</div>
					</div>
				</dl>
			</div>
		</div>

		<!-- Tracking Disposisi OPD -->
		{#if data.permohonan.disposisi && data.permohonan.disposisi.length > 0}
			<div
				class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="border-b border-slate-200 bg-gradient-to-r from-purple-600 to-purple-800 p-4">
					<h2 class="flex items-center gap-2 text-lg font-bold text-white">
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
								d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
							/>
						</svg>
						Tracking Disposisi OPD
						<span class="ml-2 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">
							{data.permohonan.disposisi.length} OPD
						</span>
					</h2>
				</div>
				<div class="p-6">
					<div class="grid gap-4">
						{#each data.permohonan.disposisi as disposisi, index}
							<div
								class="group overflow-hidden rounded-xl border-2 transition-all {disposisi.status ===
								'selesai'
									? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10'
									: disposisi.status === 'diproses'
										? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10'
										: disposisi.status === 'ditolak'
											? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
											: 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10'} hover:shadow-lg"
							>
								<!-- Card Header -->
								<div
									class="flex items-center justify-between border-b p-4 {disposisi.status ===
									'selesai'
										? 'border-emerald-200 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:border-emerald-800 dark:from-emerald-900/30 dark:to-emerald-900/10'
										: disposisi.status === 'diproses'
											? 'border-blue-200 bg-gradient-to-r from-blue-100 to-blue-50 dark:border-blue-800 dark:from-blue-900/30 dark:to-blue-900/10'
											: disposisi.status === 'ditolak'
												? 'border-red-200 bg-gradient-to-r from-red-100 to-red-50 dark:border-red-800 dark:from-red-900/30 dark:to-red-900/10'
												: 'border-amber-200 bg-gradient-to-r from-amber-100 to-amber-50 dark:border-amber-800 dark:from-amber-900/30 dark:to-amber-900/10'}"
								>
									<div class="flex items-center gap-3">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full {disposisi.status ===
											'selesai'
												? 'bg-emerald-500 text-white'
												: disposisi.status === 'diproses'
													? 'bg-blue-500 text-white'
													: disposisi.status === 'ditolak'
														? 'bg-red-500 text-white'
														: 'bg-amber-500 text-white'} shadow-md"
											aria-label="Disposisi nomor {index + 1}"
										>
											{#if disposisi.status === 'selesai'}
												<svg
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
														d="M5 13l4 4L19 7"
													/>
												</svg>
											{:else if disposisi.status === 'diproses'}
												<svg
													class="h-6 w-6 animate-spin"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
													/>
												</svg>
											{:else if disposisi.status === 'ditolak'}
												<svg
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
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											{:else}
												<svg
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
														d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											{/if}
										</div>
										<div class="flex-1">
											<h3
												class="text-lg font-bold {disposisi.status === 'selesai'
													? 'text-emerald-900 dark:text-emerald-100'
													: disposisi.status === 'diproses'
														? 'text-blue-900 dark:text-blue-100'
														: disposisi.status === 'ditolak'
															? 'text-red-900 dark:text-red-100'
															: 'text-amber-900 dark:text-amber-100'}"
											>
												{disposisi.skpd?.nm_skpd || 'SKPD'}
											</h3>
											<p class="text-xs text-slate-600 dark:text-slate-400">
												Didisposisi oleh {disposisi.disposisi_by_user?.name || 'Admin'} •
												{formatDate(disposisi.created_at)}
											</p>
										</div>
									</div>
									<span
										class="rounded-full border-2 px-4 py-1.5 text-sm font-bold uppercase {getDispositionStatusBadge(
											disposisi.status
										)}"
									>
										{disposisi.status}
									</span>
								</div>

								<!-- Card Body -->
								<div class="p-4">
									<!-- Pesan Disposisi -->
									{#if disposisi.pesan}
										<div class="mb-4">
											<p
												class="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
											>
												💼 Pesan Disposisi:
											</p>
											<p
												class="mt-1 rounded-lg bg-white p-3 text-sm text-slate-700 italic shadow-sm dark:bg-slate-800 dark:text-slate-300"
											>
												"{disposisi.pesan}"
											</p>
										</div>
									{/if}

									<!-- Respon OPD -->
									{#if disposisi.respon && disposisi.respon.length > 0}
										<div class="space-y-3">
											<div class="flex items-center gap-2">
												<svg
													class="h-5 w-5 text-purple-600 dark:text-purple-400"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
													/>
												</svg>
												<p
													class="text-sm font-bold tracking-wide text-purple-700 uppercase dark:text-purple-300"
												>
													Respon dari OPD ({disposisi.respon.length})
												</p>
											</div>

											{#each disposisi.respon as respon, responIndex}
												<div
													class="overflow-hidden rounded-lg border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30 shadow-md dark:border-purple-800 dark:from-slate-800 dark:to-purple-900/10"
												>
													<div
														class="flex items-center justify-between border-b border-purple-200 bg-purple-100/50 p-3 dark:border-purple-800 dark:bg-purple-900/20"
													>
														<div class="flex items-center gap-2">
															<div
																class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white"
															>
																{responIndex + 1}
															</div>
															<p class="font-bold text-purple-900 dark:text-purple-100">
																{respon.responded_by?.name || 'OPD'}
															</p>
														</div>
														<time
															class="text-xs font-medium text-purple-700 dark:text-purple-300"
															datetime={respon.created_at}
														>
															{formatDate(respon.created_at)}
														</time>
													</div>
													<div class="p-4">
														<p
															class="text-sm leading-relaxed whitespace-pre-wrap text-slate-900 dark:text-slate-100"
														>
															{respon.pesan}
														</p>
														{#if respon.file}
															<div class="mt-3">
																<a
																	href="http://localhost:8000/storage/{respon.file}"
																	target="_blank"
																	rel="noopener noreferrer"
																	class="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-700 hover:shadow-lg"
																>
																	<svg
																		class="h-4 w-4"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke="currentColor"
																		aria-hidden="true"
																	>
																		<path
																			stroke-linecap="round"
																			stroke-linejoin="round"
																			stroke-width="2"
																			d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
																		/>
																	</svg>
																	Unduh Lampiran
																</a>
															</div>
														{/if}
													</div>
												</div>
											{/each}
										</div>
									{:else}
										<!-- No Response Yet -->
										<div
											class="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-600 dark:bg-slate-700/30"
										>
											<svg
												class="mx-auto h-12 w-12 text-slate-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												aria-hidden="true"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
												/>
											</svg>
											<p class="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
												Belum ada respon dari OPD
											</p>
											{#if disposisi.status === 'pending'}
												<p class="text-xs text-slate-500">Menunggu tindakan dari OPD</p>
											{/if}
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Right: Actions -->
	<div class="space-y-6">
		{#if data.permohonan.status === 0}
			<div
				class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="border-b border-slate-200 bg-gradient-to-r from-[#1A305E] to-[#2A4A8E] p-4">
					<h3 class="flex items-center gap-2 text-lg font-bold text-white">
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
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
						Tindakan Admin
					</h3>
				</div>
				<div class="p-4">
					<p class="mb-4 text-sm text-slate-600 dark:text-slate-400">Pilih tindakan:</p>
					<div class="grid gap-3">
						<button
							type="button"
							onclick={() => (showUpdateModal = true)}
							class="group flex items-center gap-3 rounded-lg border-2 border-slate-200 bg-gradient-to-r from-emerald-50 to-emerald-50/50 p-4 text-left transition-all hover:border-emerald-500 hover:shadow-md dark:border-slate-700 dark:from-emerald-900/20"
							aria-label="Buka form jawab langsung"
						>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md transition-transform group-hover:scale-110"
								aria-hidden="true"
							>
								<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div class="flex-1">
								<h4 class="font-bold text-slate-900 dark:text-slate-100">Jawab Langsung</h4>
								<p class="text-sm text-slate-600 dark:text-slate-400">
									Berikan jawaban dan ubah status
								</p>
							</div>
						</button>

						<button
							type="button"
							onclick={() => (showDispositionModal = true)}
							class="group flex items-center gap-3 rounded-lg border-2 border-slate-200 bg-gradient-to-r from-purple-50 to-purple-50/50 p-4 text-left transition-all hover:border-purple-500 hover:shadow-md dark:border-slate-700 dark:from-purple-900/20"
							aria-label="Buka form buat disposisi"
						>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white shadow-md transition-transform group-hover:scale-110"
								aria-hidden="true"
							>
								<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
									/>
								</svg>
							</div>
							<div class="flex-1">
								<h4 class="font-bold text-slate-900 dark:text-slate-100">Buat Disposisi</h4>
								<p class="text-sm text-slate-600 dark:text-slate-400">
									Teruskan ke OPD/SKPD terkait
								</p>
							</div>
						</button>

						<button
							type="button"
							onclick={() => (showRejectModal = true)}
							class="group flex items-center gap-3 rounded-lg border-2 border-slate-200 bg-gradient-to-r from-red-50 to-red-50/50 p-4 text-left transition-all hover:border-red-500 hover:shadow-md dark:border-slate-700 dark:from-red-900/20"
							aria-label="Buka form tolak permohonan"
						>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white shadow-md transition-transform group-hover:scale-110"
								aria-hidden="true"
							>
								<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</div>
							<div class="flex-1">
								<h4 class="font-bold text-slate-900 dark:text-slate-100">Tolak Permohonan</h4>
								<p class="text-sm text-slate-600 dark:text-slate-400">Tolak dengan alasan</p>
							</div>
						</button>
					</div>
				</div>
			</div>
		{:else}
			<div
				class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="border-b border-slate-200 bg-gradient-to-r from-purple-600 to-purple-800 p-4">
					<h3 class="flex items-center gap-2 text-lg font-bold text-white">
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
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Tambah OPD Lain
					</h3>
				</div>
				<div class="p-4">
					<button
						type="button"
						onclick={() => (showDispositionModal = true)}
						class="w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-purple-800"
					>
						Buka Form Disposisi
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Modal: Jawab Langsung -->
{#if showUpdateModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={(e) => handleBackdropClick(e, closeUpdateModal)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="update-modal-title"
	>
		<div
			class="w-full max-w-2xl animate-[scale-in_0.2s_ease-out] rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
			onclick={(e) => e.stopPropagation()}
		>
			<div
				class="flex items-center justify-between border-b border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-700 p-6"
			>
				<h3 id="update-modal-title" class="flex items-center gap-2 text-xl font-bold text-white">
					<svg
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
					Form Jawaban Langsung
				</h3>
				<button
					type="button"
					onclick={closeUpdateModal}
					class="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
					aria-label="Tutup modal"
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
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<form
				method="POST"
				action="?/updateStatus"
				enctype="multipart/form-data"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							await invalidateAll();
							closeUpdateModal();
						}
					};
				}}
				class="p-6"
			>
				<div class="space-y-5">
					<!-- Auto-set status to 2 (Selesai/Dijawab) -->
					<input type="hidden" name="status" value="2" />

					<div
						class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20"
					>
						<p class="text-sm text-emerald-800 dark:text-emerald-200">
							<span class="font-semibold">ℹ️ Info:</span> Status otomatis akan berubah menjadi
							<span class="font-bold">"Dijawab"</span> setelah Anda memberikan jawaban.
						</p>
					</div>

					<div>
						<label
							for="pesan"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Pesan/Jawaban <span class="text-red-500">*</span>
						</label>
						<textarea
							id="pesan"
							name="pesan"
							bind:value={pesan}
							rows="6"
							required
							placeholder="Tuliskan jawaban atau keterangan untuk pemohon..."
							class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						></textarea>
					</div>

					<div>
						<label
							for="file"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Lampiran File (Opsional, Max 10MB)
						</label>
						<input
							type="file"
							id="file"
							name="file"
							accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
							class="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100 focus:border-emerald-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700"
						/>
						<p class="mt-1 text-xs text-slate-500">Format: PDF, DOC, DOCX, JPG, PNG, ZIP</p>
					</div>

					<div class="flex gap-3 pt-4">
						<button
							type="button"
							onclick={closeUpdateModal}
							class="flex-1 rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
						>
							Batal
						</button>
						<button
							type="submit"
							class="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-emerald-800"
						>
							Simpan Jawaban
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal: Tolak Permohonan -->
{#if showRejectModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={(e) => handleBackdropClick(e, closeRejectModal)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="reject-modal-title"
	>
		<div
			class="w-full max-w-2xl animate-[scale-in_0.2s_ease-out] rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
			onclick={(e) => e.stopPropagation()}
		>
			<div
				class="flex items-center justify-between border-b border-red-200 bg-gradient-to-r from-red-600 to-red-700 p-6"
			>
				<h3 id="reject-modal-title" class="flex items-center gap-2 text-xl font-bold text-white">
					<svg
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
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					Form Penolakan Permohonan
				</h3>
				<button
					type="button"
					onclick={closeRejectModal}
					class="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
					aria-label="Tutup modal"
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
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<form
				method="POST"
				action="?/updateStatus"
				enctype="multipart/form-data"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							await invalidateAll();
							closeRejectModal();
						}
					};
				}}
				class="p-6"
			>
				<div class="space-y-5">
					<!-- Auto-set status to 3 (Ditolak) -->
					<input type="hidden" name="status" value="3" />

					<div
						class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
					>
						<p class="text-sm text-red-800 dark:text-red-200">
							<span class="font-semibold">⚠️ Perhatian:</span> Status akan berubah menjadi
							<span class="font-bold">"Ditolak"</span>. Pastikan Anda memberikan alasan penolakan
							yang jelas.
						</p>
					</div>

					<div>
						<label
							for="rejectReason"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Alasan Penolakan <span class="text-red-500">*</span>
						</label>
						<textarea
							id="rejectReason"
							name="pesan"
							bind:value={rejectReason}
							rows="6"
							required
							placeholder="Jelaskan alasan mengapa permohonan ini ditolak..."
							class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
						></textarea>
					</div>

					<div>
						<label
							for="rejectFile"
							class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
						>
							Lampiran File (Opsional, Max 10MB)
						</label>
						<input
							type="file"
							id="rejectFile"
							name="file"
							accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
							class="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-red-50 file:px-4 file:py-2 file:font-semibold file:text-red-700 hover:file:bg-red-100 focus:border-red-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700"
						/>
						<p class="mt-1 text-xs text-slate-500">Format: PDF, DOC, DOCX, JPG, PNG, ZIP</p>
					</div>

					<div class="flex gap-3 pt-4">
						<button
							type="button"
							onclick={closeRejectModal}
							class="flex-1 rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
						>
							Batal
						</button>
						<button
							type="submit"
							class="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-red-700 hover:to-red-800"
						>
							Tolak Permohonan
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal: Disposisi -->
{#if showDispositionModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={(e) => handleBackdropClick(e, closeDispositionModal)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="disposition-modal-title"
	>
		<div
			class="w-full max-w-2xl animate-[scale-in_0.2s_ease-out] rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
			onclick={(e) => e.stopPropagation()}
		>
			<div
				class="flex items-center justify-between border-b border-purple-200 bg-gradient-to-r from-purple-600 to-purple-700 p-6"
			>
				<h3
					id="disposition-modal-title"
					class="flex items-center gap-2 text-xl font-bold text-white"
				>
					<svg
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
							d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
						/>
					</svg>
					Form Disposisi
				</h3>
				<button
					type="button"
					onclick={closeDispositionModal}
					class="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
					aria-label="Tutup modal"
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
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<form
				method="POST"
				action="?/createDisposition"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							await invalidateAll();
							closeDispositionModal();
						}
					};
				}}
				class="p-6"
			>
				<div class="space-y-5">
					{#if availableSkpd.length === 0}
						<div
							class="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-600 dark:bg-slate-700"
						>
							<svg
								class="mx-auto h-12 w-12 text-slate-400"
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
							<p class="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
								Semua OPD sudah didisposisi
							</p>
						</div>
					{:else}
						<div>
							<label class="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
								Pilih OPD/SKPD Tujuan <span class="text-red-500">*</span>
								{#if selectedSkpd.length > 0}
									<span
										class="ml-2 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
									>
										{selectedSkpd.length} dipilih
									</span>
								{/if}
							</label>
							<div
								class="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3 dark:border-slate-600"
							>
								{#each data.skpdList as skpd}
									{@const isAssigned = assignedSkpdIds.includes(skpd.id_skpd)}
									<label
										class="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors {isAssigned
											? 'bg-slate-100 dark:bg-slate-700'
											: selectedSkpd.includes(skpd.id_skpd)
												? 'bg-purple-50 dark:bg-purple-900/20'
												: 'hover:bg-purple-50 dark:hover:bg-purple-900/20'}"
									>
										<input
											type="checkbox"
											name="id_skpd"
											value={skpd.id_skpd}
											checked={isAssigned || selectedSkpd.includes(skpd.id_skpd)}
											disabled={isAssigned}
											onchange={() => !isAssigned && toggleSkpd(skpd.id_skpd)}
											class="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
											aria-describedby={isAssigned ? `skpd-${skpd.id_skpd}-assigned` : undefined}
										/>
										<span class="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100">
											{skpd.nm_skpd}
											{#if isAssigned}
												<span id="skpd-{skpd.id_skpd}-assigned" class="ml-2 text-xs text-slate-500"
													>(Sudah didisposisi)</span
												>
											{/if}
										</span>
									</label>
								{/each}
							</div>
						</div>

						<div>
							<label
								for="dispositionMessage"
								class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
							>
								Pesan Disposisi (Opsional)
							</label>
							<textarea
								id="dispositionMessage"
								name="pesan"
								bind:value={dispositionMessage}
								rows="4"
								placeholder="Tambahkan catatan atau instruksi untuk OPD..."
								class="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
							></textarea>
						</div>

						<div class="flex gap-3 pt-4">
							<button
								type="button"
								onclick={closeDispositionModal}
								class="flex-1 rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
							>
								Batal
							</button>
							<button
								type="submit"
								disabled={selectedSkpd.length === 0}
								class="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Buat Disposisi
							</button>
						</div>
					{/if}
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Notifications -->
{#if form?.error}
	<div
		class="fixed right-4 bottom-4 z-50 animate-[slide-in_0.3s_ease-out] rounded-lg bg-red-500 px-6 py-4 text-white shadow-lg"
		role="alert"
	>
		<p class="font-semibold">{form.error}</p>
	</div>
{/if}

{#if form?.success}
	<div
		class="fixed right-4 bottom-4 z-50 animate-[slide-in_0.3s_ease-out] rounded-lg bg-emerald-500 px-6 py-4 text-white shadow-lg"
		role="status"
	>
		<p class="font-semibold">{form.message}</p>
	</div>
{/if}

<style>
	@keyframes scale-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
