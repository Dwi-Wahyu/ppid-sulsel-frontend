<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<section
	id="survey"
	class="relative overflow-hidden bg-gradient-to-br from-ppid-primary to-ppid-primary-light py-12 font-['Plus_Jakarta_Sans'] transition-colors duration-300 md:py-20"
>
	<!-- Background Decorative Elements -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-10 right-10 h-64 w-64 rounded-full bg-white/20 blur-3xl"></div>
		<div class="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-ppid-accent/20 blur-3xl"></div>
	</div>

	<div class="relative z-10 container mx-auto px-4">
		<!-- Section Header -->
		<div class="mx-auto mb-12 max-w-3xl text-center" data-aos="fade-down">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm"
			>
				<div class="h-2 w-2 rounded-full bg-ppid-accent"></div>
				<span class="text-xs font-bold tracking-wide text-white uppercase md:text-sm"
					>{m['breadcrumb.survey']()}</span
				>
			</div>
			<h2
				class="mb-4 text-3xl leading-tight font-extrabold text-white sm:mb-6 sm:text-4xl md:text-5xl"
			>
				{m['survey_form.title']()}
			</h2>
			<p class="text-base leading-relaxed text-white/90 md:text-lg">
				{m['survey_form.subtitle']()}
			</p>
		</div>

		<!-- Survey Cards Grid -->
		<div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
			<!-- Isi Survey Card -->
			<a href="/survey/isi-survey" class="group block h-full" data-aos="fade-up" data-aos-delay={0}>
				<div
					class="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-700 ease-out hover:-translate-y-2 hover:bg-white/20 hover:shadow-[0_20px_60px_-10px_rgba(212,175,55,0.4)]"
				>
					<!-- Icon Container -->
					<div
						class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white text-ppid-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-ppid-accent group-hover:text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>

					<!-- Content -->
					<div class="flex flex-grow flex-col">
						<h3 class="mb-3 text-2xl font-bold text-white transition-colors lg:text-3xl">
							{m['survey_pages.isi_title']()}
						</h3>
						<p class="mb-6 flex-grow text-base leading-relaxed text-white/80 md:text-lg">
							{m['survey_form.form_desc']()}
						</p>

						<!-- CTA -->
						<span
							class="inline-flex items-center gap-2 text-sm font-bold tracking-wider text-ppid-accent uppercase transition-all group-hover:gap-3 group-hover:text-white md:text-base"
						>
							{m['survey_form.submit_btn']()}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</span>
					</div>

					<!-- Decorative Corner -->
					<div
						class="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-ppid-accent/20 transition-transform duration-700 ease-out group-hover:scale-150"
					></div>
				</div>
			</a>

			<!-- Hasil Survey Card -->
			<a
				href="/survey/hasil-survey"
				class="group block h-full"
				data-aos="fade-up"
				data-aos-delay={150}
			>
				<div
					class="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-700 ease-out hover:-translate-y-2 hover:bg-white/20 hover:shadow-[0_20px_60px_-10px_rgba(212,175,55,0.4)]"
				>
					<!-- Icon Container -->
					<div
						class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white text-ppid-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-ppid-accent group-hover:text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>

					<!-- Content -->
					<div class="flex flex-grow flex-col">
						<h3 class="mb-3 text-2xl font-bold text-white transition-colors lg:text-3xl">
							{m['survey_pages.hasil_title']()}
						</h3>
						<p class="mb-6 flex-grow text-base leading-relaxed text-white/80 md:text-lg">
							{m['survey_pages.hasil_subtitle']()}
						</p>

						<!-- Stats Preview -->
						<div class="mb-6 flex items-center gap-4">
							<div class="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
								<div class="text-2xl font-bold text-ppid-accent">88.5</div>
								<div class="text-xs text-white/70">IKM Score</div>
							</div>
							<div class="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
								<div class="text-2xl font-bold text-ppid-accent">1,240</div>
								<div class="text-xs text-white/70">Responden</div>
							</div>
						</div>

						<!-- CTA -->
						<span
							class="inline-flex items-center gap-2 text-sm font-bold tracking-wider text-ppid-accent uppercase transition-all group-hover:gap-3 group-hover:text-white md:text-base"
						>
							Lihat Hasil
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</span>
					</div>

					<!-- Decorative Corner -->
					<div
						class="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-ppid-accent/20 transition-transform duration-700 ease-out group-hover:scale-150"
					></div>
				</div>
			</a>
		</div>

		<!-- Bottom CTA -->
		<div class="mt-12 text-center" data-aos="fade-up" data-aos-delay={300}>
			<p class="text-white/80">Pendapat Anda sangat berharga bagi peningkatan layanan kami</p>
		</div>
	</div>
</section>
