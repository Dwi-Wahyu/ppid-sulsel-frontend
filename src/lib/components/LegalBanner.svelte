<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<section class="relative overflow-hidden bg-ppid-primary py-12 font-['Plus_Jakarta_Sans'] md:py-20">
	<!-- Decorative Cultural Pattern Overlay -->
	<div
		class="pointer-events-none absolute inset-0 opacity-10 transition-all duration-75 ease-out"
		style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556 15.858 12.14 28 0zm0 0\' fill=\'%23D4AF37\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E'); background-repeat: repeat;"
	></div>

	<div class="relative z-10 container mx-auto px-4">
		<div class="mx-auto max-w-5xl">
			<!-- Header Section -->
			<div
				class="mb-10 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left"
				data-aos="fade-down"
			>
				<div
					class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-ppid-accent/30 bg-white/5 text-ppid-accent shadow-lg backdrop-blur-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path
							d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"
						/><path d="M7 21h10" /><path d="M12 3v18" /></svg
					>
				</div>
				<div class="text-white">
					<h3 class="mb-1 text-2xl font-bold tracking-tight text-ppid-accent md:text-3xl">
						{m['download.legal_title']()}
					</h3>
					<p class="text-sm text-gray-300 md:text-base">
						{m['download.legal_subtitle']()}
					</p>
				</div>
			</div>

			<!-- Grid Section -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each [{ law: 'UU No. 14 Tahun 2008', title: 'download.legal_1' }, { law: 'PP No. 61 Tahun 2010', title: 'download.legal_2' }, { law: 'Perpres No. 33 Tahun 2020', title: 'download.legal_3' }] as l, index}
					<div
						class="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-ppid-accent/50 hover:bg-white/10"
						data-aos="fade-up"
						data-aos-delay={index * 150}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							class="mt-1 text-ppid-accent transition-transform group-hover:scale-110"
							><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline
								points="22 4 12 14.01 9 11.01"
							/></svg
						>
						<div class="text-white">
							<p
								class="mb-1 text-xs font-bold tracking-widest text-ppid-accent uppercase opacity-80"
							>
								{l.law}
							</p>
							<p
								class="text-base leading-tight font-semibold text-white transition-colors group-hover:text-ppid-accent"
							>
								{m[l.title]()}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Bottom Disclaimer -->
			<div class="mx-auto mt-10 max-w-3xl px-4 text-center md:mt-12" data-aos="fade-up">
				<p class="text-sm leading-relaxed font-medium text-gray-400 md:text-base">
					{m['download.legal_desc']()}
				</p>
			</div>
		</div>
	</div>
</section>
