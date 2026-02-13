<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<section
	id="layanan"
	class="relative overflow-hidden bg-white py-8 font-['Plus_Jakarta_Sans'] transition-colors duration-300 md:py-16 dark:bg-slate-900"
>
	<div class="relative z-10 container mx-auto px-4">
		<!-- Section Header -->
		<div class="mx-auto mb-8 max-w-3xl text-center md:mb-12" data-aos="fade-down">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full border border-ppid-accent/30 bg-white px-4 py-2 shadow-sm dark:bg-slate-800"
			>
				<div class="h-2 w-2 rounded-full bg-ppid-accent"></div>
				<span
					class="text-xs font-bold tracking-wide text-ppid-primary uppercase md:text-sm dark:text-gray-200"
					>{m['service.our_services']()}</span
				>
			</div>
			<h2
				class="mb-4 text-2xl leading-tight font-extrabold text-ppid-primary sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white"
			>
				{m['service.public_info_services']()}
			</h2>
			<p class="text-base leading-relaxed text-ppid-text md:text-lg dark:text-gray-300">
				{m['service.access_desc']()}
			</p>
		</div>

		<!-- Cards Grid -->
		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
			{#each [{ title: 'service.info_public_title', desc: 'service.public_info_desc', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', url: '/informasi-publik' }, { title: 'footer.info_request', desc: 'service.request_desc', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', url: '/layanan/permohonan-informasi' }, { title: 'footer.objection', desc: 'service.objection_desc', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', url: '/layanan/pengajuan-keberatan' }] as s, index}
				<a href={s.url} class="group block h-full" data-aos="fade-up" data-aos-delay={index * 150}>
					<div
						class="hover:shadow-[0_20px_40px_-10px_theme('colors.ppid-primary_/_10%')] relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 ease-out hover:-translate-y-1 sm:p-8 dark:border-slate-700 dark:bg-slate-800"
					>
						<!-- Hover Accent Line -->
						<div
							class="absolute top-0 left-0 h-1 w-full scale-x-0 bg-linear-to-r from-transparent via-ppid-accent to-transparent transition-transform duration-500 group-hover:scale-x-100"
						></div>

						<div class="relative z-10 flex h-full flex-row gap-4 md:flex-col md:gap-0">
							<!-- Icon Container -->
							<div
								class="mb-0 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ppid-primary/5 text-ppid-primary transition-colors duration-300 group-hover:bg-ppid-primary group-hover:text-ppid-accent md:mb-6 md:h-14 md:w-14 dark:bg-white/10 dark:text-white"
							>
								<svg
									class="h-6 w-6 md:h-7 md:w-7"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="1.5"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d={s.icon} />
								</svg>
							</div>

							<!-- Content Container -->
							<div class="flex flex-grow flex-col">
								<h3
									class="mb-2 text-base font-bold text-ppid-primary transition-colors group-hover:text-ppid-accent md:mb-3 md:text-lg lg:text-xl dark:text-white"
								>
									{m[s.title]()}
								</h3>
								<p
									class="mb-4 flex-grow text-sm leading-relaxed text-ppid-text md:mb-8 md:text-base dark:text-gray-300"
								>
									{m[s.desc]()}
								</p>

								<span
									class="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-ppid-primary uppercase transition-transform group-hover:translate-x-1 md:text-sm dark:text-white"
								>
									{m['service.access_service']()}
									<svg
										class="h-3 w-3 text-ppid-accent md:h-4 md:w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/></svg
									>
								</span>
							</div>
						</div>

						<!-- Decorative Circle -->
						<div
							class="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-ppid-accent/5 transition-transform duration-700 ease-out group-hover:scale-150"
						></div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
