<script>
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let profil = $state({
		deskripsi: `
			<h2>Visi</h2>
			<p><strong>Mewujudkan PPID yang Profesional, Transparan, dan Akuntabel dalam Pelayanan Informasi Publik</strong></p>
			
			<h2>Misi</h2>
			<ol>
				<li>Meningkatkan kualitas pengelolaan dan pelayanan informasi publik</li>
				<li>Membangun sistem informasi dan dokumentasi yang terintegrasi</li>
				<li>Meningkatkan kapasitas SDM dalam pengelolaan informasi publik</li>
				<li>Memperkuat koordinasi dengan PPID Pembantu di lingkungan Pemprov Sulsel</li>
				<li>Mendorong partisipasi masyarakat dalam pengawasan keterbukaan informasi</li>
			</ol>
		`
	});
</script>

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[
				{ label: 'breadcrumb.profile', href: '#' },
				{ label: 'profile.vision_mission_title' }
			]}
		/>
		<div class="mt-4">
			<PageTitle title={m['profile.vision_mission_title']()} />
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-7xl">
			<div class="mx-auto max-w-5xl">
				<div class="space-y-6 sm:space-y-8">
					<div
						class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-800"
					>
						<div class="prose max-w-none prose-slate dark:prose-invert">
							{@html profil.deskripsi}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />
