<script lang="ts">
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';

	// State untuk mengontrol masing-masing modal
	let showDeleteModal = $state(false);
	let showArchiveModal = $state(false);
	let showUpdateModal = $state(false);

	// Handler untuk konfirmasi manual
	function handleManualConfirm() {
		console.log('Aksi dikonfirmasi secara manual!');
		showUpdateModal = false;
	}
</script>

<div class="mx-auto max-w-2xl space-y-6 p-8">
	<header class="mb-10">
		<h1 class="text-3xl font-bold text-slate-800">Demo Confirmation Dialog</h1>
		<p class="text-slate-500">Implementasi SvelteKit v5 dengan Runes.</p>
	</header>

	<div class="grid grid-cols-1 gap-4">
		<div class="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm">
			<div>
				<h2 class="font-bold text-slate-700">Hapus Akun</h2>
				<p class="text-sm text-slate-500">Menggunakan Form Action & Tema Danger</p>
			</div>
			<button
				onclick={() => (showDeleteModal = true)}
				class="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
			>
				Hapus
			</button>
		</div>

		<div class="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm">
			<div>
				<h2 class="font-bold text-slate-700">Arsip Data</h2>
				<p class="text-sm text-slate-500">Menggunakan Slot Custom & Tema Warning</p>
			</div>
			<button
				onclick={() => (showArchiveModal = true)}
				class="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-600"
			>
				Arsip
			</button>
		</div>
	</div>

	<ConfirmationDialog
		bind:show={showDeleteModal}
		theme="danger"
		title="Hapus Akun Permanen?"
		description="Seluruh data Anda akan dihapus dari server kami dan tidak dapat dikembalikan."
		confirmText="Ya, Hapus Akun"
		action="?/deleteAccount"
	/>

	<ConfirmationDialog
		bind:show={showArchiveModal}
		theme="warning"
		title="Arsipkan Data Tahun Ini?"
		confirmText="Arsipkan Sekarang"
		onConfirm={() => console.log('Data diarsipkan')}
	>
		<div class="rounded-lg border border-amber-100 bg-amber-50 p-3">
			<p class="text-left text-xs text-amber-700">
				<strong>Catatan:</strong> Data yang diarsipkan masih bisa diakses melalui menu
				<span class="font-bold underline">Laporan Lama</span>.
			</p>
		</div>
	</ConfirmationDialog>
</div>
