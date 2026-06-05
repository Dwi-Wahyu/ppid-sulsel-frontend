<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		open?: boolean;
		title?: string;
		children?: any;
		onClose?: () => void;
	}

	let { open = false, title = '', children, onClose }: Props = $props();

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
		if (onClose) onClose();
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
	class="fixed inset-0 z-50 m-auto h-fit w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm dark:bg-slate-800"
	onclick={handleBackdropClick}
>
	<div class="relative p-6">
		<!-- Header -->
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">
				{title}
			</h2>
		</div>

		<!-- Content -->
		<div class="max-h-[70vh] overflow-y-auto text-gray-600 dark:text-gray-300">
			{@render children?.()}
		</div>

		<!-- Footer -->
		<div class="mt-8 flex justify-end">
			<button
				type="button"
				class="rounded-xl bg-ppid-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-ppid-primary/20 transition-all hover:bg-ppid-primary-hover focus:ring-2 focus:ring-ppid-primary focus:outline-none"
				onclick={closeDialog}
			>
				Tutup
			</button>
		</div>
	</div>
</dialog>
