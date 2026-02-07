<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	// Definisi tipe untuk Type Safety
	type NotificationTheme = 'success' | 'error' | 'warning' | 'info';

	interface Props {
		show?: boolean;
		title?: string;
		description?: string;
		theme?: NotificationTheme;
		autoClose?: boolean;
		duration?: number;
	}

	// Menggunakan Snippet/Props dengan Svelte 5 Runes
	let {
		show = $bindable(false),
		title,
		description = 'Proses telah selesai dilakukan.',
		theme = 'success',
		autoClose = true,
		duration = 8000
	}: Props = $props();

	// Logika Konfigurasi Tema menggunakan $derived
	const config = $derived.by(() => {
		switch (theme) {
			case 'error':
				return {
					defaultTitle: 'Gagal!',
					gradientId: 'grad_error',
					blobFill: '#F43F5E',
					iconPath: 'M6 18L18 6M6 6l12 12',
					colors: 'from-red-500 to-rose-600',
					stopColors: ['#DC2626', '#F43F5E']
				};
			case 'warning':
				return {
					defaultTitle: 'Peringatan!',
					gradientId: 'grad_warning',
					blobFill: '#EA580C',
					iconPath:
						'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
					colors: 'from-amber-500 to-orange-600',
					stopColors: ['#F59E0B', '#EA580C']
				};
			case 'info':
				return {
					defaultTitle: 'Informasi',
					gradientId: 'grad_info',
					blobFill: '#6366F1',
					iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
					colors: 'from-blue-500 to-indigo-600',
					stopColors: ['#0EA5E9', '#6366F1']
				};
			default: // success
				return {
					defaultTitle: 'Berhasil!',
					gradientId: 'grad_success',
					blobFill: '#10B981',
					iconPath: 'M5 13l4 4L19 7',
					colors: 'from-emerald-500 to-green-600',
					stopColors: ['#10B981', '#059669']
				};
		}
	});

	// Timer Auto Close menggunakan $effect
	$effect(() => {
		if (show && autoClose) {
			const timer = setTimeout(() => {
				show = false;
			}, duration);
			return () => clearTimeout(timer);
		}
	});
</script>

{#if show}
	<div class="fixed inset-0 z-100 overflow-y-auto">
		<div
			class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
		>
			<div
				transition:fade={{ duration: 200 }}
				onclick={() => (show = false)}
				class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
				aria-hidden="true"
			></div>

			<span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"
				>&#8203;</span
			>

			<div
				transition:fly={{ y: 50, duration: 400, opacity: 0 }}
				class="relative inline-block transform overflow-hidden rounded-4xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:align-middle dark:bg-slate-800"
			>
				<div class="relative z-10 flex flex-col items-center px-8 pt-10 pb-8 text-center">
					<div
						class="relative mb-6 flex h-28 w-28 transform items-center justify-center transition-transform duration-300 hover:scale-105"
					>
						<svg
							viewBox="0 0 200 200"
							class="absolute inset-0 h-full w-full drop-shadow-2xl"
							xmlns="http://www.w3.org/2000/svg"
						>
							<defs>
								<linearGradient id={config.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stop-color={config.stopColors[0]} />
									<stop offset="100%" stop-color={config.stopColors[1]} />
								</linearGradient>
							</defs>
							<path
								fill="url(#{config.gradientId})"
								d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.4,82.2,23.1,70.8,34.1C59.4,45.1,47.9,53.4,36.1,60.8C24.3,68.2,12.2,74.7,-1.2,76.8C-14.6,78.9,-29.2,76.6,-42.6,69.9C-56,63.2,-68.2,52.1,-76.6,38.6C-85,25.1,-89.6,9.2,-86.6,-5.3C-83.6,-19.8,-73,-32.9,-62,-44.6C-51,-56.3,-39.6,-66.6,-26.8,-74.7C-14,-82.8,0.2,-88.7,14.6,-88.7C29,-88.7,46.1,-82.8,58.7,-73.4L44.7,-76.4Z"
								transform="translate(100 100) scale(1.1)"
							/>
						</svg>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="relative z-10 h-12 w-12 text-white drop-shadow-md filter"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="3"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d={config.iconPath} />
						</svg>
					</div>

					<h3 class="mb-3 text-3xl font-black tracking-tight text-slate-800 dark:text-white">
						{title ?? config.defaultTitle}
					</h3>

					<p class="mb-8 text-base leading-relaxed font-medium text-slate-500 dark:text-slate-400">
						{description}
					</p>

					<div class="flex w-full gap-4">
						<button
							onclick={() => (show = false)}
							class="flex-1 rounded-2xl bg-slate-200 px-5 py-3.5 text-sm font-bold tracking-wide text-slate-700 transition-all hover:bg-slate-300 active:scale-95 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
						>
							Tutup
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
