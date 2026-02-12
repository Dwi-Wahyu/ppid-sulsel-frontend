<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	let {
		isOpen = $bindable(false),
		title = m['form.success_title']() || 'Berhasil!',
		message = m['form.success_desc']() || 'Permohonan Anda telah berhasil dikirim',
		subtitle = m['form.process_desc']() || 'Kami akan memproses permohonan Anda'
	} = $props();

	function close() {
		isOpen = false;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			close();
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div
			class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
		>
			<!-- Backdrop -->
			<div
				class="fixed inset-0 transition-opacity"
				aria-hidden="true"
				onclick={handleBackdropClick}
			>
				<div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
			</div>

			<!-- Center modal -->
			<span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"
				>&#8203;</span
			>

			<!-- Modal Content -->
			<div
				class="relative inline-block transform overflow-hidden rounded-4xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:align-middle dark:bg-slate-800"
			>
				<div class="relative z-10 flex flex-col items-center px-8 pt-10 pb-8 text-center">
					<!-- Icon Wrapper with Blob Background -->
					<div
						class="relative mb-6 flex h-28 w-28 transform items-center justify-center transition-transform duration-300 hover:scale-105"
					>
						<!-- Blob SVG -->
						<svg
							viewBox="0 0 200 200"
							class="absolute inset-0 h-full w-full drop-shadow-2xl"
							xmlns="http://www.w3.org/2000/svg"
						>
							<defs>
								<linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop
										offset="0%"
										class="text-ppid-primary"
										style="stop-color:currentColor;stop-opacity:1"
									/>
									<stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
								</linearGradient>
							</defs>
							<path
								fill="url(#blobGradient)"
								d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.4,82.2,23.1,70.8,34.1C59.4,45.1,47.9,53.4,36.1,60.8C24.3,68.2,12.2,74.7,-1.2,76.8C-14.6,78.9,-29.2,76.6,-42.6,69.9C-56,63.2,-68.2,52.1,-76.6,38.6C-85,25.1,-89.6,9.2,-86.6,-5.3C-83.6,-19.8,-73,-32.9,-62,-44.6C-51,-56.3,-39.6,-66.6,-26.8,-74.7C-14,-82.8,0.2,-88.7,14.6,-88.7C29,-88.7,46.1,-82.8,58.7,-73.4L44.7,-76.4Z"
								transform="translate(100 100) scale(1.1)"
							/>
						</svg>

						<!-- Check Icon -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="relative z-10 h-12 w-12 text-white drop-shadow-md filter"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="4"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>

					<!-- Title -->
					<h3 class="mb-3 text-3xl font-black tracking-tight text-slate-800 dark:text-white">
						{title}
					</h3>

					<!-- Message -->
					<p class="mb-1 text-base leading-relaxed font-medium text-slate-500 dark:text-slate-400">
						{message}
					</p>
					<p class="mb-10 text-sm text-slate-400 dark:text-slate-500">
						{subtitle}
					</p>

					<!-- Buttons -->
					<div class="flex w-full gap-4">
						<button
							onclick={close}
							class="flex-1 rounded-2xl bg-slate-200 px-5 py-3.5 text-sm font-bold tracking-wide text-slate-700 transition-all hover:bg-slate-300 active:scale-95 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
						>
							{m['form.close']() || 'Tutup'}
						</button>
						<button
							onclick={close}
							class="flex-1 transform rounded-2xl bg-linear-to-r from-ppid-primary to-blue-600 px-5 py-3.5 text-sm font-bold tracking-wide text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105 hover:to-blue-500 active:scale-95"
						>
							{m['form.great']() || 'Oke'}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
