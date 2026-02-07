<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let pdfPath = $state(null); // Will be populated with actual PDF path from API
</script>

<Header />

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[{ label: 'breadcrumb.profile', href: '#' }, { label: 'profile.org_structure' }]}
		/>
		<div class="mt-4">
			<PageTitle title={m['profile.org_structure']()} subtitle={m['profile.org_subtitle']()} />
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-6xl">
			<!-- Hierarchy Info -->
			<div class="mb-10 grid gap-6 md:grid-cols-3">
				<div
					class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Penanggung Jawab</div>
					<p class="font-bold text-gray-900 dark:text-white">Gubernur Sulawesi Selatan</p>
				</div>
				<div
					class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Atasan PPID</div>
					<p class="font-bold text-gray-900 dark:text-white">Sekretaris Daerah Provinsi</p>
				</div>
				<div
					class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">PPID Utama</div>
					<p class="font-bold text-gray-900 dark:text-white">Kepala Dinas Kominfo</p>
				</div>
			</div>

			<!-- Struktur Image -->
			<div
				class="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900"
				>
					<h2 class="font-bold text-gray-900 dark:text-white">Bagan Struktur Organisasi PPID</h2>
					<a
						href={pdfPath || '#'}
						download={pdfPath ? true : undefined}
						class="flex items-center gap-2 text-sm font-medium text-ppid-primary transition-colors hover:text-ppid-accent dark:text-white"
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
							class="h-4 w-4"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" x2="12" y1="15" y2="3" />
						</svg>
						Download
					</a>
				</div>

				<div class="p-6">
					<div
						class="h-[600px] overflow-hidden rounded-lg border border-gray-200 md:h-[800px] dark:border-slate-700"
					>
						{#if pdfPath}
							<iframe
								src={pdfPath}
								width="100%"
								height="100%"
								class="h-full w-full border-0"
								title="Struktur Organisasi PPID"
							>
								<p>
									Browser Anda tidak mendukung pratinjau PDF.
									<a href={pdfPath}>Download PDF</a> untuk melihatnya.
								</p>
							</iframe>
						{:else}
							<img
								src="https://placehold.co/1200x800/EEE/31343C?text=Bagan+Struktur+Organisasi+PPID"
								alt="Struktur Organisasi PPID Sulawesi Selatan"
								class="h-full w-full object-cover"
							/>
						{/if}
					</div>
				</div>
			</div>

			<!-- Info Grid -->
			<div class="grid gap-6 md:grid-cols-2">
				<div
					class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-4 flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-ppid-primary/10">
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
								class="h-5 w-5 text-ppid-primary dark:text-white"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M12 16v-4" />
								<path d="M12 8h.01" />
							</svg>
						</div>
						<h3 class="font-bold text-gray-900 dark:text-white">Komponen PPID</h3>
					</div>
					<div class="space-y-3 text-sm text-gray-700">
						<div class="flex gap-3">
							<span class="mt-1 text-ppid-primary dark:text-white">•</span>
							<div>
								<strong class="text-gray-900 dark:text-white">PPID Utama:</strong> Bertanggung jawab atas
								pengelolaan informasi di tingkat provinsi
							</div>
						</div>
						<div class="flex gap-3">
							<span class="mt-1 text-ppid-primary dark:text-white">•</span>
							<div>
								<strong class="text-gray-900 dark:text-white">PPID Pembantu:</strong> Mengelola informasi
								di setiap SKPD lingkup Pemprov Sulsel
							</div>
						</div>
						<div class="flex gap-3">
							<span class="mt-1 text-ppid-primary dark:text-white">•</span>
							<div>
								<strong class="text-gray-900 dark:text-white">PPID Pelaksana:</strong> Melaksanakan tugas
								teknis pelayanan informasi
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-lg border border-ppid-primary/10 bg-ppid-primary/5 p-6">
					<div class="mb-4 flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-ppid-primary">
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
								class="h-5 w-5 text-white"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M12 16v-4" />
								<path d="M12 8h.01" />
							</svg>
						</div>
						<h3 class="font-bold text-ppid-primary dark:text-white">Koordinasi & Supervisi</h3>
					</div>
					<p class="mb-3 text-sm text-gray-700">
						PPID Utama melakukan koordinasi dan supervisi terhadap PPID Pembantu di seluruh SKPD
						untuk memastikan:
					</p>
					<div class="space-y-2 text-sm text-gray-700">
						<div class="flex gap-2">
							<span class="text-ppid-primary dark:text-white">•</span>
							<span>Standarisasi pengelolaan informasi</span>
						</div>
						<div class="flex gap-2">
							<span class="text-ppid-primary dark:text-white">•</span>
							<span>Kualitas layanan yang konsisten</span>
						</div>
						<div class="flex gap-2">
							<span class="text-ppid-primary dark:text-white">•</span>
							<span>Kepatuhan terhadap regulasi KIP</span>
						</div>
						<div class="flex gap-2">
							<span class="text-ppid-primary dark:text-white">•</span>
							<span>Peningkatan kapasitas SDM</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />
