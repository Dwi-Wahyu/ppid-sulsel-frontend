<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { env } from '$env/dynamic/public';

	interface DokumenDetail {
		id_informasi: number;
		judul: string;
		ket: string | null;
		file: string;
		tgl_upload: string;
		tgl_verify: string | null;
		jumlah_download: number;
		tahun: string;
		verify: string;
		kategori?: {
			id_kat_info: number;
			nm_kat_info: string;
		};
		skpd?: {
			id_skpd: number;
			nm_skpd: string;
		};
	}

	interface PageData {
		informasi: DokumenDetail;
	}

	let { data } = $props<{ data: PageData }>();

	const BACKEND_URL = env.PUBLIC_BACKEND_URL || 'http://localhost:8000';

	// 		if (file.startsWith('http')) {
	// 			return file;
	// 		}
	// 		return `${BACKEND_URL}/storage/${file}`;
	function getFileUrl(file: string): string {
		if (file.startsWith('http')) {
			return file;
		}
		return `${BACKEND_URL}/storage/${file}`;
	}

	function getDownloadUrl(id: number): string {
		return `${BACKEND_URL}/api/public/informasi/download/${id}`;
	}
</script>

<svelte:head>
	<title>{data.informasi.judul} - PPID Sulawesi Selatan</title>
</svelte:head>

<!-- Breadcrumb + Title Section -->
<!-- Breadcrumb + Title Section -->
<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<!-- Breadcrumb -->
		<div class="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
			<a href="/" class="transition-colors hover:text-ppid-primary dark:text-white">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-4 w-4"
				>
					<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					<polyline points="9 22 9 12 15 12 15 22" />
				</svg>
			</a>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-4 w-4 text-gray-400"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
			<a href="/informasi-publik" class="transition-colors hover:text-ppid-primary dark:text-white">
				{m['public_info.title']()}
			</a>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-4 w-4 text-gray-400"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
			<span class="font-medium text-ppid-primary dark:text-white"
				>{m['public_info.detail.breadcrumb']()}</span
			>
		</div>

		<!-- Title -->
		<div class="flex items-end justify-between">
			<div>
				<h1
					class="mb-2 text-2xl leading-tight font-bold text-ppid-primary md:text-3xl dark:text-white"
				>
					{data.informasi.judul}
				</h1>
				<p class="text-gray-600 dark:text-gray-300">{m['public_info.detail.subtitle']()}</p>
			</div>
			<div class="hidden md:block">
				<div class="h-1 w-20 rounded-full bg-gradient-to-r from-ppid-primary to-transparent"></div>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-4xl">
			<div
				class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-ppid-primary/5 dark:border-slate-700 dark:bg-slate-800"
			>
				<!-- Detail Header -->
				<div
					class="relative overflow-hidden bg-gradient-to-br from-ppid-primary to-[#2A4A8E] p-8 text-white"
				>
					<div class="absolute top-0 right-0 p-8 opacity-10">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="120"
							height="120"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="16" y1="13" x2="8" y2="13" />
							<line x1="16" y1="17" x2="8" y2="17" />
							<line x1="10" y1="9" x2="8" y2="9" />
						</svg>
					</div>
					<div class="relative z-10">
						<span
							class="mb-4 inline-block rounded-full bg-ppid-accent px-3 py-1 text-xs font-bold tracking-wider text-white uppercase"
						>
							{data.informasi.kategori?.nm_kat_info || m['public_info.detail.fallback_category']()}
						</span>
						<h2 class="mb-4 text-2xl font-bold">{data.informasi.judul}</h2>
						<div class="flex flex-wrap items-center gap-6 text-sm text-white/80">
							<div class="flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="h-4 w-4"
								>
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
								{data.informasi.tgl_upload}
							</div>
							<div class="flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="h-4 w-4"
								>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="7 10 12 15 17 10" />
									<line x1="12" x2="12" y1="15" y2="3" />
								</svg>
								{data.informasi.jumlah_download || 0}
								{m['public_info.detail.downloads']()}
							</div>
						</div>
					</div>
				</div>

				<!-- Detail Body -->
				<div class="p-8">
					<div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
						<div class="space-y-6">
							<div>
								<label
									class="mb-1 block text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500"
								>
									{m['public_info.detail.skpd_label']()}
								</label>
								<p class="font-medium text-gray-900 italic dark:text-white">
									{data.informasi.skpd?.nm_skpd || '-'}
								</p>
							</div>
							<div>
								<label
									class="mb-1 block text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500"
								>
									{m['public_info.detail.desc_label']()}
								</label>
								<div
									class="prose prose-sm max-w-none leading-relaxed text-gray-700 dark:text-gray-300 dark:prose-invert"
								>
									{@html data.informasi.ket || m['public_info.detail.no_desc']()}
								</div>
							</div>
						</div>
						<div
							class="self-start rounded-xl border border-gray-100 bg-gray-50 p-6 dark:border-slate-700 dark:bg-slate-900/50"
						>
							<label
								class="mb-4 block text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500"
							>
								{m['public_info.detail.doc_info']()}
							</label>
							<ul class="space-y-4 text-sm">
								<li class="flex items-start gap-3">
									<div
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ppid-primary/10"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="text-ppid-primary"
										>
											<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
											<polyline points="14 2 14 8 20 8" />
											<line x1="16" y1="13" x2="8" y2="13" />
											<line x1="16" y1="17" x2="8" y2="17" />
											<line x1="10" y1="9" x2="8" y2="9" />
										</svg>
									</div>
									<div>
										<span class="block text-xs text-gray-500 dark:text-gray-400"
											>{m['public_info.detail.file_name']()}</span
										>
										<span class="font-medium break-all text-gray-900 dark:text-white">
											{data.informasi.file.split('/').pop()}
										</span>
									</div>
								</li>
								<li class="flex items-start gap-3">
									<div
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ppid-primary/10"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="text-ppid-primary"
										>
											<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
										</svg>
									</div>
									<div>
										<span class="block text-xs text-gray-500 dark:text-gray-400"
											>{m['public_info.detail.verify_status']()}</span
										>
										<span
											class="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase"
										>
											<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
											{m['public_info.detail.verified']()} ({data.informasi.tgl_verify ||
												data.informasi.tgl_upload})
										</span>
									</div>
								</li>
							</ul>
						</div>
					</div>

					<!-- Action Buttons -->
					<div
						class="flex flex-col items-center gap-4 border-t border-gray-100 pt-8 sm:flex-row dark:border-slate-700"
					>
						{#if data.informasi.file}
							<a
								href={getFileUrl(data.informasi.file)}
								target="_blank"
								rel="noopener noreferrer"
								class="flex w-full items-center justify-center gap-2 rounded-xl bg-ppid-primary px-8 py-3 font-bold text-white shadow-lg shadow-ppid-primary/20 transition-all hover:bg-[#2A4A8E] sm:w-auto"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
								{m['public_info.detail.view_file']()}
							</a>
							<a
								href={getDownloadUrl(data.informasi.id_informasi)}
								class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ppid-primary bg-white px-8 py-3 font-bold text-ppid-primary transition-all hover:bg-gray-50 sm:w-auto dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="7 10 12 15 17 10" />
									<line x1="12" x2="12" y1="15" y2="3" />
								</svg>
								{m['public_info.detail.download_file']()}
							</a>
						{:else}
							<div
								class="w-full rounded-xl border border-red-100 bg-red-50 p-4 text-center font-bold text-red-600"
							>
								{m['public_info.detail.no_file']()}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Back Link -->
			<div class="mt-8 text-center">
				<button
					onclick={() => window.history.back()}
					class="group inline-flex items-center gap-2 font-medium text-gray-500 italic transition-colors hover:text-ppid-primary"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="transition-transform group-hover:-translate-x-1"
					>
						<line x1="19" y1="12" x2="5" y2="12" />
						<polyline points="12 19 5 12 12 5" />
					</svg>
					{m['public_info.detail.back']()}
				</button>
			</div>
		</div>
	</div>
</main>
