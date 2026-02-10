<script>
	// No imports needed for static content
</script>

<section id="informasi" class="bg-white py-8 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<!-- Section Header -->
		<div class="mx-auto mb-12 max-w-3xl text-center md:mb-16" data-aos="fade-down">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full border border-ppid-accent/30 bg-ppid-accent/10 px-5 py-2.5 shadow-sm"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="text-ppid-accent"
				>
					<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
				</svg>
				<span
					class="text-xs font-bold tracking-wide text-ppid-primary uppercase md:text-sm dark:text-gray-200"
					>Akses Cepat</span
				>
			</div>
			<h2
				class="mb-4 text-2xl leading-tight font-bold text-ppid-primary sm:text-3xl md:text-5xl dark:text-white"
			>
				Informasi & Layanan
			</h2>
			<p class="text-base leading-relaxed text-ppid-text md:text-xl dark:text-gray-300">
				Akses mudah ke berbagai layanan dan informasi PPID
			</p>
		</div>

		<!-- Grid -->
		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each [{ title: 'Berita & Informasi', desc: 'Baca berita terkini dan update informasi dari PPID Sulawesi Selatan', icon: '<path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>', url: '/berita', badge: 'Berita' }, { title: 'Profil PPID', desc: 'Pelajari lebih lanjut tentang profil, visi misi, dan struktur organisasi PPID', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', url: '/profil-ppid', badge: 'Profil' }, { title: 'PPID Pelaksana', desc: 'Temukan kontak dan informasi PPID Pelaksana di berbagai SKPD Provinsi Sulsel', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87m0-4.13a4 4 0 0 1 0 7.75"/>', url: '/ppid-pelaksana', badge: 'Kontak' }, { title: 'Standar Operasional', desc: 'Lihat SOP dan prosedur pelayanan informasi publik PPID', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>', url: '/layanan/sop', badge: 'Panduan' }] as card, index}
				<a
					href={card.url}
					data-aos="fade-up"
					data-aos-delay={index * 100}
					class="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-ppid-accent/50 hover:shadow-[0_20px_50px_-10px_rgba(26,48,94,0.15)] dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="flex flex-row md:flex-col">
						<!-- Header with Icon & Badge -->
						<div
							class="relative shrink-0 overflow-hidden bg-ppid-primary p-4 text-white transition-colors group-hover:bg-[#15264a] md:p-5 lg:p-6"
						>
							<!-- Decorative Pattern -->
							<div
								class="absolute top-0 right-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 rounded-full bg-ppid-accent/10 transition-transform duration-500 group-hover:scale-125"
							></div>

							<div
								class="relative mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-110 md:mb-4 md:h-14 md:w-14"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									class="text-ppid-accent md:h-6 md:w-6"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									{@html card.icon}
								</svg>
							</div>
							<div
								class="flex items-center gap-1.5 text-[9px] font-semibold tracking-wider text-white/70 uppercase md:gap-2 md:text-xs"
							>
								<span
									class="rounded bg-ppid-accent/20 px-1.5 py-0.5 whitespace-nowrap text-ppid-accent md:px-2"
									>{card.badge}</span
								>
								<span class="hidden md:inline">•</span>
								<span class="hidden md:inline">PPID Sulsel</span>
							</div>
						</div>

						<!-- Content -->
						<div class="flex flex-grow flex-col p-4 md:p-5 lg:p-8">
							<h3
								class="mb-2 text-base leading-tight font-bold text-ppid-primary transition-colors group-hover:text-ppid-accent md:mb-3 md:text-xl dark:text-white"
							>
								{card.title}
							</h3>
							<p
								class="mb-3 flex-grow text-xs leading-relaxed wrap-break-word text-ppid-text md:mb-6 md:text-base dark:text-slate-300"
							>
								{card.desc}
							</p>
							<div
								class="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-[#fafafa] px-3 py-2 text-xs font-bold text-ppid-primary shadow-sm transition-all group-hover:border-ppid-accent group-hover:bg-ppid-accent group-hover:text-ppid-primary group-hover:shadow-md md:px-5 md:py-3 md:text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
							>
								<span>Akses Sekarang</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="transition-transform group-hover:translate-x-1 md:h-[18px] md:w-[18px]"
								>
									<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
								</svg>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
