<script>
	import { onMount, onDestroy } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	// Mock banner data - replace with actual API call later
	let slides = $state(['/images/banner1.jpg', '/images/banner2.jpg', '/images/banner3.jpg']);

	let activeSlide = $state(0);
	let showImageModal = $state(false);
	let currentImageSrc = $state('');
	let timer = $state(null);

	onMount(() => {
		startTimer();
	});

	onDestroy(() => {
		stopTimer();
	});

	function startTimer() {
		timer = setInterval(() => {
			next();
		}, 6000);
	}

	function stopTimer() {
		if (timer) {
			clearInterval(timer);
		}
	}

	function next() {
		activeSlide = (activeSlide + 1) % slides.length;
	}

	function prev() {
		activeSlide = activeSlide === 0 ? slides.length - 1 : activeSlide - 1;
	}

	function handleImageClick(imageSrc) {
		// Check if it's the Maklumat image
		if (imageSrc.includes('Maklumat')) {
			window.location.href = '/maklumat';
		} else {
			currentImageSrc = imageSrc;
			showImageModal = true;
			document.body.style.overflow = 'hidden';
		}
	}

	function closeImageModal() {
		showImageModal = false;
		document.body.style.overflow = '';
	}

	// Close modal on Escape key
	$effect(() => {
		function handleKeydown(e) {
			if (e.key === 'Escape' && showImageModal) {
				closeImageModal();
			}
		}
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<section
	class="group relative z-10 mt-24 block h-[50vh] w-full overflow-hidden font-['Plus_Jakarta_Sans'] sm:mt-32 sm:h-[85vh] md:mt-40 md:h-[100vh]"
	onmouseenter={stopTimer}
	onmouseleave={startTimer}
>
	<!-- Carousel Slides -->
	<div
		class="relative flex h-full w-full transition-transform duration-700 ease-in-out"
		style="transform: translateX(-{activeSlide * 100}%)"
	>
		{#each slides as slide, index}
			<div
				class="relative h-full w-full flex-shrink-0 cursor-pointer"
				onclick={() => handleImageClick(slide)}
			>
				<img
					src={slide}
					class="pointer-events-none absolute inset-0 h-full w-full bg-white object-cover object-center md:object-contain dark:bg-slate-800"
					alt="Slider"
				/>
				<!-- Overlay Gradient -->
				<div
					class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ppid-primary/90 via-ppid-primary/40 to-transparent"
				></div>
			</div>
		{/each}
	</div>

	<!-- Welcome Content - Only on First Slide -->
	<div
		class="absolute inset-0 z-20 flex items-center justify-center pb-0 md:mb-72 md:items-end md:pb-12"
	>
		<div class="container mx-auto px-6 text-center text-white">
			{#if activeSlide === 0}
				<div
					in:fly={{ y: 20, duration: 700, delay: 300 }}
					out:fade={{ duration: 300 }}
					class="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 md:gap-6 lg:gap-12"
				>
					<!-- Mobile: Both Logos Above Text -->
					<div class="flex items-center justify-center gap-6 md:hidden">
						<img
							src="/images/logo-sulsel.png"
							alt="Logo Sulawesi Selatan"
							class="h-12 w-12 object-contain drop-shadow-2xl sm:h-16 sm:w-16"
						/>
						<img
							src="/images/ppid-3.png"
							alt="Logo PPID"
							class="h-12 w-12 object-contain drop-shadow-2xl sm:h-16 sm:w-16"
						/>
					</div>

					<!-- Desktop: Content in Row with Logos on Sides -->
					<div class="hidden w-full flex-row items-center justify-center gap-8 md:flex lg:gap-12">
						<!-- Logo Sulsel (Left) -->
						<div class="flex-shrink-0">
							<img
								src="/images/logo-sulsel.png"
								alt="Logo Sulawesi Selatan"
								class="h-24 w-24 animate-pulse object-contain drop-shadow-2xl lg:h-32 lg:w-32"
							/>
						</div>

						<!-- Welcome Text (Center) -->
						<div class="max-w-3xl flex-1">
							<h1
								class="mb-1.5 text-xs leading-tight font-bold text-white drop-shadow-lg sm:mb-4 sm:text-2xl md:text-4xl lg:text-5xl"
							>
								Selamat Datang di Portal Resmi<br />
								<span class="text-ppid-accent">PPID Utama</span><br />
								Provinsi Sulawesi Selatan
							</h1>
							<p
								class="mb-2 text-[10px] leading-tight font-medium text-white/90 drop-shadow-md sm:mb-6 sm:text-sm md:mb-8 md:text-lg lg:text-xl"
							>
								Transparansi Informasi Publik untuk Sulawesi Selatan yang Lebih Baik
							</p>

							<!-- Hero Search Bar -->
							<div class="mx-auto max-w-2xl scale-90 sm:scale-100">
								<button
									class="group/search hover:shadow-3xl flex w-full items-center gap-1.5 rounded-xl border-2 border-transparent bg-white/95 px-3 py-1.5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-ppid-accent/50 hover:shadow-ppid-accent/20 sm:gap-3 sm:rounded-2xl sm:px-6 sm:py-4 dark:bg-slate-800/95"
								>
									<!-- Search Icon -->
									<div class="flex-shrink-0">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 text-ppid-text transition-colors group-hover/search:text-ppid-accent sm:h-6 sm:w-6 dark:text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
									</div>

									<!-- Placeholder Text -->
									<div class="flex-1 text-left">
										<span
											class="text-xs font-normal text-ppid-text sm:text-base sm:font-medium dark:text-gray-400"
										>
											{m['common.search_placeholder']()}
										</span>
									</div>

									<!-- Keyboard Shortcut Hint -->
									<div
										class="hidden items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 md:flex dark:bg-slate-700"
									>
										<kbd class="text-xs font-semibold text-ppid-text dark:text-gray-400">Ctrl</kbd>
										<span class="text-xs text-ppid-text dark:text-gray-400">+</span>
										<kbd class="text-xs font-semibold text-ppid-text dark:text-gray-400">K</kbd>
									</div>
								</button>

								<!-- Popular Keywords -->
								<div class="mt-4 hidden flex-wrap items-center justify-center gap-2 sm:flex">
									<span class="text-sm font-medium text-white/70">Popular:</span>
									<a
										href="/informasi-publik/berkala"
										class="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
									>
										Laporan Keuangan
									</a>
									<a
										href="/informasi-publik/serta-merta"
										class="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
									>
										Informasi Serta Merta
									</a>
									<a
										href="/berita"
										class="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
									>
										Berita Terkini
									</a>
								</div>
							</div>
						</div>

						<!-- Logo PPID (Right) -->
						<div class="flex-shrink-0">
							<img
								src="/images/ppid-3.png"
								alt="Logo PPID"
								class="h-24 w-24 animate-pulse object-contain drop-shadow-2xl lg:h-32 lg:w-32"
							/>
						</div>
					</div>

					<!-- Mobile: Welcome Text Below Logos -->
					<div class="max-w-3xl flex-1 md:hidden">
						<h1
							class="mb-1.5 text-xs leading-tight font-bold text-white drop-shadow-lg sm:mb-4 sm:text-2xl"
						>
							Selamat Datang di Portal Resmi<br />
							<span class="text-ppid-accent">PPID Utama</span><br />
							Provinsi Sulawesi Selatan
						</h1>
						<p
							class="mb-2 text-[10px] leading-tight font-medium text-white/90 drop-shadow-md sm:mb-6 sm:text-sm"
						>
							Transparansi Informasi Publik untuk Sulawesi Selatan yang Lebih Baik
						</p>

						<!-- Hero Search Bar -->
						<div class="mx-auto max-w-2xl scale-90 sm:scale-100">
							<button
								class="group/search hover:shadow-3xl flex w-full items-center gap-1.5 rounded-xl border-2 border-transparent bg-white/95 px-3 py-1.5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-ppid-accent/50 hover:shadow-ppid-accent/20 sm:gap-3 sm:rounded-2xl sm:px-6 sm:py-4 dark:bg-slate-800/95"
							>
								<!-- Search Icon -->
								<div class="flex-shrink-0">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 text-ppid-text transition-colors group-hover/search:text-ppid-accent sm:h-6 sm:w-6 dark:text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>

								<!-- Placeholder Text -->
								<div class="flex-1 text-left">
									<span
										class="text-xs font-normal text-ppid-text sm:text-base sm:font-medium dark:text-gray-400"
									>
										{m['common.search_placeholder']()}
									</span>
								</div>
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Navigation Buttons -->
	<button
		onclick={prev}
		class="absolute top-1/2 left-2 z-30 -translate-x-4 -translate-y-14 transform rounded-full bg-black/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-ppid-accent hover:text-ppid-primary sm:left-4 sm:p-3"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 19l-7-7 7-7"
			/></svg
		>
	</button>
	<button
		onclick={next}
		class="absolute top-1/2 right-2 z-30 translate-x-4 -translate-y-14 transform rounded-full bg-black/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-ppid-accent hover:text-ppid-primary sm:right-4 sm:p-3"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 5l7 7-7 7"
			/></svg
		>
	</button>

	<!-- Dot Indicators -->
	<div
		class="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 space-x-2 sm:bottom-24 md:bottom-28"
	>
		{#each slides as _, index}
			<button
				onclick={() => (activeSlide = index)}
				class="h-1.5 rounded-full transition-all duration-300 {activeSlide === index
					? 'w-16 bg-ppid-accent'
					: 'w-10 bg-white/30 hover:bg-white/50'}"
			></button>
		{/each}
	</div>

	<!-- Wave Decoration -->
	<div
		class="pointer-events-none absolute right-0 bottom-0 left-0 z-20 text-white transition-colors duration-300 dark:text-slate-900"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1440 120"
			fill="currentColor"
			class="h-auto w-full"
		>
			<path
				fill-opacity="1"
				d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
			></path>
		</svg>
	</div>
</section>

<!-- Image Zoom Modal -->
{#if showImageModal}
	<div
		transition:fade={{ duration: 300 }}
		onclick={closeImageModal}
		class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
	>
		<!-- Close Button -->
		<button
			onclick={closeImageModal}
			class="absolute top-4 right-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:rotate-90 hover:bg-white/20 sm:top-6 sm:right-6 sm:h-12 sm:w-12"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>

		<!-- Image Container -->
		<div onclick={(e) => e.stopPropagation()} class="relative max-h-[90vh] w-full max-w-7xl">
			<img
				src={currentImageSrc}
				alt="Zoomed"
				class="h-full w-full rounded-lg object-contain shadow-2xl"
				in:fly={{ y: 20, duration: 300 }}
			/>
		</div>

		<!-- Helper Text -->
		<div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
			Klik di luar gambar atau tekan ESC untuk menutup
		</div>
	</div>
{/if}
