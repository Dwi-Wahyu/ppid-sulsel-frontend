<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	let { open = false, title = '', children } = $props();

	const dispatch = createEventDispatcher();

	let dialog: HTMLDialogElement | null = null;

	function openDialog() {
		if (dialog && !dialog.open) {
			dialog.showModal();
		}
	}

	function closeDialog() {
		if (dialog && dialog.open) {
			dialog.close();
		}
	}

	// Reactive effect (Svelte 5 style)
	$effect(() => {
		if (!dialog) return;

		if (open) {
			openDialog();
		} else {
			closeDialog();
		}
	});

	function handleClose() {
		dispatch('close');
	}

	function handleBackdropClick(event: MouseEvent) {
		if (!dialog) return;

		const rect = dialog.getBoundingClientRect();
		const isInside =
			event.clientX >= rect.left &&
			event.clientX <= rect.right &&
			event.clientY >= rect.top &&
			event.clientY <= rect.bottom;

		if (!isInside) {
			closeDialog();
		}
	}

	onMount(() => {
		if (!dialog) return;

		dialog.addEventListener('close', handleClose);

		return () => {
			dialog?.removeEventListener('close', handleClose);
		};
	});
</script>

<dialog
	bind:this={dialog}
	class="w-full max-w-2xl rounded-2xl p-0 shadow-2xl backdrop:bg-black/50"
	onclick={handleBackdropClick}
>
	<div class="relative rounded-2xl bg-white p-6 dark:bg-slate-800">
		<!-- Header -->
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-800 dark:text-white">
				{title}
			</h2>

			<button
				type="button"
				aria-label="Close dialog"
				class="focus:ring-primary rounded-lg p-2 hover:bg-gray-100 focus:ring-2 focus:outline-none dark:hover:bg-slate-700"
				onclick={closeDialog}
			>
				✕
			</button>
		</div>

		<!-- Content -->
		<div class="max-h-[60vh] overflow-y-auto text-gray-600 dark:text-gray-300">
			{@render children?.()}
		</div>

		<!-- Footer -->
		<div class="mt-6 flex justify-end">
			<button
				type="button"
				class="bg-primary hover:bg-primary/90 focus:ring-primary rounded-lg px-4 py-2 text-white focus:ring-2 focus:outline-none"
				onclick={closeDialog}
			>
				Tutup
			</button>
		</div>
	</div>
</dialog>
