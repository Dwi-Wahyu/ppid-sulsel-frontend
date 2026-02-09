<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	// Tipe literal agar sesuai dengan standar HTML Form
	type FormMethod = 'POST' | 'GET' | 'post' | 'get' | 'dialog' | 'DIALOG';

	// Definisikan interface di luar destrukturisasi
	interface Props {
		show: boolean;
		title?: string;
		description?: string;
		theme?: 'danger' | 'warning' | 'primary';
		confirmText?: string;
		cancelText?: string;
		action?: string;
		method?: FormMethod;
		onConfirm?: (() => void) | null;
		children?: Snippet; // Snippet untuk menangani konten di dalam tag
		isLoading?: boolean;
	}

	let {
		show = $bindable(false),
		title = 'Apakah Anda Yakin?',
		description = 'Tindakan ini tidak dapat dibatalkan.',
		theme = 'danger',
		confirmText = 'Ya, Lanjutkan',
		cancelText = 'Batal',
		action = '',
		method = 'POST',
		onConfirm = null,
		children,
		isLoading = false
	}: Props = $props();

	// Logika warna dan icon berbasis tema menggunakan $derived (reaktif)
	const themeConfig = $derived.by(() => {
		switch (theme) {
			case 'warning':
				return {
					gradient: 'from-amber-400 to-orange-500',
					btnPrimary: 'from-amber-500 to-orange-600 hover:to-orange-500',
					btnShadow: 'shadow-orange-500/30',
					iconPath:
						'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
					fill: 'fill-amber-500'
				};
			case 'primary':
				return {
					gradient: 'from-blue-500 to-indigo-600',
					btnPrimary: 'from-blue-600 to-indigo-700 hover:to-indigo-600',
					btnShadow: 'shadow-blue-500/30',
					iconPath:
						'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
					fill: 'fill-blue-500'
				};
			default: // danger
				return {
					gradient: 'from-red-500 to-rose-600',
					btnPrimary: 'from-red-600 to-rose-700 hover:to-rose-600',
					btnShadow: 'shadow-red-500/30',
					iconPath:
						'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
					fill: 'fill-red-500'
				};
		}
	});

	function handleCancel() {
		show = false;
	}

	function handleConfirm() {
		if (onConfirm) {
			onConfirm();
			show = false;
		}
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div
			class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
		>
			<div
				transition:fade={{ duration: 200 }}
				onclick={handleCancel}
				class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
				aria-hidden="true"
			></div>

			<span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"
				>&#8203;</span
			>

			<div
				transition:fly={{ y: 20, duration: 300 }}
				class="relative inline-block transform overflow-hidden rounded-4xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:align-middle dark:bg-slate-800"
			>
				<div class="relative z-10 flex flex-col items-center px-8 pt-10 pb-8 text-center">
					<div
						class="relative mb-6 flex h-24 w-24 transform items-center justify-center transition-transform duration-300 hover:scale-105"
					>
						<svg
							viewBox="0 0 200 200"
							class="absolute inset-0 h-full w-full drop-shadow-xl"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								class={themeConfig.fill}
								d="M41.8,-71.3C54.7,-64.9,66.1,-54.6,75.4,-42.1C84.7,-29.6,91.9,-14.8,90.2,-0.9C88.6,12.9,78.1,25.8,67.4,36.9C56.7,48,45.8,57.2,33.5,63.9C21.2,70.6,7.5,74.7,-5.7,73.8C-18.9,72.9,-31.7,66.9,-44.1,60.2C-56.5,53.5,-68.5,46,-76.3,34.9C-84.1,23.8,-87.7,9.1,-84.8,-4.2C-81.9,-17.5,-72.5,-29.3,-62.4,-39.7C-52.3,-50.1,-41.5,-59.1,-29.6,-66.1C-17.7,-73.2,-4.7,-78.3,4.2,-79C13.1,-79.7,26.2,-76,33.1,-72.3L41.8,-71.3Z"
								transform="translate(100 100) scale(1.1)"
								opacity="0.2"
							/>
						</svg>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="relative z-10 h-10 w-10 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2.5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d={themeConfig.iconPath} />
						</svg>
					</div>

					<h3 class="mb-2 text-2xl font-black tracking-tight text-slate-800 dark:text-white">
						{title}
					</h3>

					<p class="mb-8 text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
						{description}
					</p>

					{#if children}
						<div class="mb-6 w-full">
							{@render children()}
						</div>
					{/if}

					<div class="flex w-full gap-3">
						<button
							type="button"
							onclick={handleCancel}
							class="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
						>
							{cancelText}
						</button>

						{#if action}
							<form {action} {method} use:enhance class="flex-1">
								<button
									type="submit"
									class="w-full transform rounded-xl bg-linear-to-r px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 {themeConfig.btnPrimary} {themeConfig.btnShadow}"
								>
									{confirmText}
								</button>
							</form>
						{:else}
							<button
								type="button"
								onclick={handleConfirm}
								class="flex-1 transform rounded-xl bg-linear-to-r px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 {themeConfig.btnPrimary} {themeConfig.btnShadow}"
							>
								{#if isLoading}
									<div
										class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
									></div>
								{/if}
								{confirmText}
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
