<script lang="ts">
	import NotificationDialog from '$lib/components/NotificationDialog.svelte';

	// State utama
	let isModalVisible = $state(false);
	let modalProps = $state({
		theme: 'success' as 'success' | 'error' | 'warning' | 'info',
		title: '',
		description: '',
		duration: 5000
	});

	// Helper untuk memicu notifikasi
	function trigger(theme: typeof modalProps.theme, title: string, desc: string, duration = 5000) {
		modalProps = { theme, title, description: desc, duration };
		isModalVisible = true;
	}
</script>

<div class="mx-auto max-w-4xl p-8">
	<div class="mb-10 text-center">
		<h1 class="text-4xl font-black tracking-tight text-slate-800">System Notifications</h1>
		<p class="mt-2 text-slate-500">Pilih tipe feedback untuk mencoba modal reaktif.</p>
	</div>

	<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
		<button
			onclick={() => trigger('success', 'Berhasil Disimpan', 'Profil Anda telah diperbarui.')}
			class="flex flex-col items-center rounded-3xl border border-emerald-200 bg-emerald-50 p-6 transition-all hover:bg-emerald-100"
		>
			<span class="mb-2 text-3xl">✅</span>
			<span class="font-bold text-emerald-800">Success</span>
		</button>

		<button
			onclick={() =>
				trigger('error', 'Koneksi Terputus', 'Gagal menghubungi server. Silakan coba lagi.', 10000)}
			class="flex flex-col items-center rounded-3xl border border-red-200 bg-red-50 p-6 transition-all hover:bg-red-100"
		>
			<span class="mb-2 text-3xl">❌</span>
			<span class="font-bold text-red-800">Error</span>
		</button>

		<button
			onclick={() =>
				trigger('warning', 'Kuota Hampir Habis', 'Sisa kuota upload Anda kurang dari 10%.')}
			class="flex flex-col items-center rounded-3xl border border-amber-200 bg-amber-50 p-6 transition-all hover:bg-amber-100"
		>
			<span class="mb-2 text-3xl">⚠️</span>
			<span class="font-bold text-amber-800">Warning</span>
		</button>

		<button
			onclick={() =>
				trigger('info', 'Pembaruan Sistem', 'Versi 2.1.0 kini tersedia dengan fitur baru.', 15000)}
			class="flex flex-col items-center rounded-3xl border border-blue-200 bg-blue-50 p-6 transition-all hover:bg-blue-100"
		>
			<span class="mb-2 text-3xl">ℹ️</span>
			<span class="font-bold text-blue-800">Info</span>
		</button>
	</div>

	<NotificationDialog
		bind:show={isModalVisible}
		theme={modalProps.theme}
		title={modalProps.title}
		description={modalProps.description}
		duration={modalProps.duration}
		autoClose={true}
	/>
</div>
