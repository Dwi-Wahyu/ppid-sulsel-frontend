<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let profil = $state({
		deskripsi: `
			<p>Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
			<p>Segala puji bagi Allah SWT yang telah memberikan rahmat dan karunia-Nya sehingga kita dapat menjalankan tugas dan tanggung jawab dalam melayani masyarakat.</p>
			<p>Kami menyambut baik kehadiran Anda di portal Pejabat Pengelola Informasi dan Dokumentasi (PPID) Provinsi Sulawesi Selatan. Portal ini merupakan wujud komitmen kami dalam menerapkan prinsip ket erbukaan informasi publik sebagaimana diamanatkan dalam Undang-Undang Nomor 14 Tahun 2008.</p>
			<p>Melalui portal ini, kami berharap dapat memberikan kemudahan bagi masyarakat dalam mengakses informasi publik yang akurat, relevan, dan terkini. Transparansi merupakan kunci untuk membangun kepercayaan publik dan mewujudkan tata kelola pemerintahan yang baik.</p>
			<p>Kami terus berkomitmen untuk meningkatkan kualitas pelayanan informasi publik. Kritik dan saran dari masyarakat sangat kami harapkan untuk perbaikan berkelanjutan.</p>
		`,
		foto_kepala: null
	});
</script>

<Header />

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[{ label: 'breadcrumb.profile', href: '#' }, { label: 'profile.greeting_title' }]}
		/>

		<div class="mt-4">
			<PageTitle
				title={m['profile.greeting_title']()}
				subtitle={m['profile.greeting_subtitle']()}
			/>
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
			<div class="gap-8 md:col-span-2">
				<div class="w-full space-y-6">
					<!-- Opening Quote -->
					<div class="relative overflow-hidden rounded-xl bg-ppid-primary p-8 text-white md:p-10">
						<div class="absolute -top-6 -right-6 text-[120px] leading-none text-white/10">"</div>
						<div class="relative">
							<p class="mb-4 text-lg leading-relaxed italic md:text-xl">
								Transparansi adalah kunci untuk membangun kepercayaan publik dan mewujudkan tata
								kelola pemerintahan yang baik
							</p>
							<div class="flex items-center gap-3">
								<div class="h-0.5 w-12 bg-white dark:bg-slate-800/50"></div>
								<span class="text-sm text-white/90">Komitmen PPID Sulawesi Selatan</span>
							</div>
						</div>
					</div>

					<!-- Main Content -->
					<div class="prose max-w-none prose-slate dark:prose-invert">
						{@html profil.deskripsi}
					</div>

					<!-- Closing -->
					<div class="mt-8 border-t border-gray-200 pt-6 dark:border-slate-700">
						<p class="mb-6 font-medium text-gray-900 dark:text-white">
							Wassalamu'alaikum Warahmatullahi Wabarakatuh
						</p>

						<div class="flex items-start gap-4">
							<div class="h-20 w-1 rounded-full bg-ppid-accent"></div>
							<div>
								<p class="text-lg font-bold text-gray-900 dark:text-white">Kepala PPID</p>
								<p class="text-sm text-gray-600 dark:text-gray-300">Provinsi Sulawesi Selatan</p>
								<p class="mt-1 text-xs text-gray-500">
									Pejabat Pengelola Informasi dan Dokumentasi
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<aside class="space-y-6">
				<div
					class="sticky top-24 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="bg-ppid-primary px-5 py-4">
						<h3 class="font-bold text-white">Kepala PPID Utama</h3>
					</div>
					<div class="p-5">
						<div class="rounded-lg border border-ppid-primary/10 bg-ppid-primary/5 p-4">
							<div class="mb-3 aspect-[3/4] overflow-hidden rounded-lg border-4 border-ppid-accent">
								{#if profil.foto_kepala}
									<img
										src={profil.foto_kepala}
										alt="Kepala PPID Utama Sulawesi Selatan"
										class="h-full w-full object-cover"
									/>
								{:else}
									<div
										class="flex h-full w-full items-center justify-center bg-gradient-to-br from-ppid-primary to-ppid-text text-white"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-20 w-20"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="1.5"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
								{/if}
							</div>
							<p class="mb-1 text-sm font-bold text-ppid-primary dark:text-white">
								Dr. H. Andi Sudirman Sulaiman, SE., MM
							</p>
							<p class="mb-2 text-xs font-semibold text-ppid-accent">Kepala Dinas Kominfo</p>
							<div class="mb-2 h-0.5 w-12 rounded-full bg-ppid-accent"></div>
							<p class="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
								PPID Utama Provinsi Sulawesi Selatan
							</p>
						</div>
					</div>
				</div>
			</aside>
		</div>
	</div>
</main>

<Footer />
