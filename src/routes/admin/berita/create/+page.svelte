<script lang="ts">
	import TinyMCE from '$lib/components/TinyMCE.svelte';
	import FilePond from '$lib/components/FilePond.svelte';
	// Assuming there's a way to check roles, for now we just use a mock or prop
	// In a real SvelteKit app, this would come from data or a store
	let { data } = $props();

	let judul = $state('');
	let id_skpd = $state('');
	let verify = $state('n');
	let gambar = $state(null);
	let konten = $state('');

	// Mock SKPD list
	const skpdList = [
		{ id: '1', name: 'Dinas Komunikasi dan Informatika' },
		{ id: '2', name: 'Dinas Pendidikan' },
		{ id: '3', name: 'Dinas Kesehatan' }
	];

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		console.log('Form submitted:', { judul, id_skpd, verify, gambar, konten });
		// Implement submission logic
	};
</script>

<svelte:head>
	<title>Tambah Berita - Admin PPID</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<div
		class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"
	>
		<div class="border-b border-slate-100 p-6 dark:border-white/10">
			<h3 class="text-lg font-bold text-ppid-primary dark:text-white">Form Tambah Berita</h3>
		</div>

		<form onsubmit={handleSubmit} class="space-y-6 p-6">
			<!-- Judul -->
			<div>
				<label for="judul" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
					>Judul Berita</label
				>
				<input
					type="text"
					id="judul"
					bind:value={judul}
					class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
					placeholder="Masukkan judul berita"
					required
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- SKPD -->
				<div class="space-y-2">
					<label for="id_skpd" class="text-sm font-medium text-slate-700 dark:text-slate-300"
						>SKPD Terkait</label
					>
					<select
						id="id_skpd"
						bind:value={id_skpd}
						class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
						required
					>
						<option value="">-- Pilih SKPD --</option>
						{#each skpdList as skpd}
							<option value={skpd.id}>{skpd.name}</option>
						{/each}
					</select>
				</div>

				<!-- Status Verifikasi -->
				<div class="space-y-2">
					<label for="verify" class="block text-sm font-medium text-slate-700 dark:text-slate-300"
						>Status Verifikasi</label
					>
					<select
						id="verify"
						bind:value={verify}
						class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-ppid-accent focus:ring-1 focus:ring-ppid-accent focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
						required
					>
						<option value="n">Belum Verifikasi</option>
						<option value="y">Terverifikasi</option>
						<option value="t">Ditolak</option>
					</select>
				</div>
			</div>

			<!-- Gambar -->
			<div>
				<label
					for="gambar"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
					>Gambar Sampul</label
				>
				<FilePond bind:value={gambar} name="img_berita" />
			</div>

			<!-- Konten -->
			<div>
				<label
					for="konten"
					class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
					>Konten Berita</label
				>
				<TinyMCE bind:value={konten} placeholder="Tulis konten berita di sini..." height={500} />
			</div>

			<div class="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-white/10">
				<a
					href="/admin/berita"
					class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					Batal
				</a>
				<button
					type="submit"
					class="hover:bg-ppid-dark rounded-lg bg-ppid-primary px-4 py-2 text-sm font-medium text-white transition-colors"
				>
					Simpan Berita
				</button>
			</div>
		</form>
	</div>
</div>
