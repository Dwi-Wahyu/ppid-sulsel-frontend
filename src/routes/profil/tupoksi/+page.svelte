<script>
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let profil = $state({
		deskripsi: `
			<h2>Tugas Pokok</h2>
			<p>PPID memiliki tugas pokok melaksanakan penyimpanan, pendokumentasian, penyediaan, dan pelayanan informasi di lingkungan Pemerintah Provinsi Sulawesi Selatan.</p>
			
			<h2>Fungsi</h2>
			<ol>
				<li>Penghimpunan informasi publik dari seluruh unit kerja di lingkungan Pemprov Sulsel</li>
				<li>Penyediaan dan pelayanan informasi publik kepada masyarakat</li>
				<li>Pendokumentasian informasi publik secara sistematis dan terstruktur</li>
				<li>Pengujian konsekuensi informasi yang dikecualikan</li>
				<li>Pengelolaan dan pemeliharaan sistem informasi</li>
			</ol>
		`
	});
</script>

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[{ label: 'breadcrumb.profile', href: '#' }, { label: 'profile.tupoksi_title' }]}
		/>
		<div class="mt-4">
			<PageTitle title={m['profile.tupoksi_title']()} />
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-5xl space-y-8">
			<div
				class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-800"
			>
				<div class="prose max-w-none prose-slate dark:prose-invert">
					{@html profil.deskripsi}
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />
