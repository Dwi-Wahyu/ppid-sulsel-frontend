<script lang="ts">
	let { open = $bindable(false), title, children } = $props();
	let dialogRef: HTMLDialogElement;

	$effect(() => {
		if (open) dialogRef.showModal();
		else dialogRef.close();
	});
</script>

<dialog
	bind:this={dialogRef}
	onclose={() => (open = false)}
	onclick={(e) => e.target === dialogRef && (open = false)}
	class="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border-0 p-0 shadow-2xl"
>
	<div class="flex flex-col p-6">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-xl font-bold">{title}</h3>
			<button
				onclick={() => (open = false)}
				class="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
				aria-label="Tutup modal"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/></svg
				>
			</button>
		</div>
		{@render children()}
	</div>
</dialog>

<style>
	dialog::backdrop {
		animation: fade-in 0.2s ease-out;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
