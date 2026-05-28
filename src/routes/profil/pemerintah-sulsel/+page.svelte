<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { getImageUrl } from '$lib/get-image-url';
	import { api } from '$lib/api';

	interface ProfilData {
		deskripsi: string;
		foto_gubernur: string | null;
		foto_wakil: string | null;
	}

	let profil = $state<ProfilData>({
		deskripsi: '',
		foto_gubernur: null,
		foto_wakil: null
	});

	let isLoading = $state(true);

	onMount(async () => {
		try {
			const result = await api.get('/public/profil/pemerintah');
			if (result.success && result.data) {
				profil.deskripsi = result.data.deskripsi;
				if (result.data.foto_gubernur) {
					profil.foto_gubernur = getImageUrl(result.data.foto_gubernur);
				}
				if (result.data.foto_wakil) {
					profil.foto_wakil = getImageUrl(result.data.foto_wakil);
				}
			}
		} catch (error) {
			console.error('Error fetching Government profile:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>{m['gov_profile.title']()} - PPID Provinsi Sulawesi Selatan</title>
</svelte:head>

<main class="min-h-screen bg-white transition-colors dark:bg-slate-900">
	<PageTitle title={m['gov_profile.title']()} />

	<div class="container mx-auto px-4 py-12">
		<div class="mx-auto max-w-6xl">
			<Breadcrumb
				items={[{ label: m['common.home'](), href: '/' }, { label: m['gov_profile.title']() }]}
				class="mb-10"
			/>

			<!-- Leaders Showcase -->
			<div class="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Gubernur -->
				<div class="group relative overflow-hidden rounded-[2.5rem] bg-slate-50 dark:bg-slate-800">
					<div class="aspect-[3/4] overflow-hidden">
						{#if isLoading}
							<div class="flex h-full w-full animate-pulse items-center justify-center bg-slate-200 dark:bg-slate-700"></div>
						{:else}
							<img
								src={profil.foto_gubernur || '/images/gubernur.jpg'}
								alt="Gubernur Sulawesi Selatan"
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						{/if}
					</div>
					<div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
					<div class="absolute right-0 bottom-0 left-0 p-8 text-white">
						<span class="mb-2 inline-block text-xs font-bold tracking-widest text-ppid-accent uppercase">
							{m['leadership.gov_pos']()}
						</span>
						<h2 class="text-2xl font-black md:text-3xl">
							{m['leadership.gov_name']()}
						</h2>
					</div>
				</div>

				<!-- Wakil Gubernur -->
				<div class="group relative overflow-hidden rounded-[2.5rem] bg-slate-50 dark:bg-slate-800">
					<div class="aspect-[3/4] overflow-hidden">
						{#if isLoading}
							<div class="flex h-full w-full animate-pulse items-center justify-center bg-slate-200 dark:bg-slate-700"></div>
						{:else}
							<img
								src={profil.foto_wakil || '/images/wakil-gubernur.jpg'}
								alt="Wakil Gubernur Sulawesi Selatan"
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						{/if}
					</div>
					<div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
					<div class="absolute right-0 bottom-0 left-0 p-8 text-white">
						<span class="mb-2 inline-block text-xs font-bold tracking-widest text-ppid-accent uppercase">
							{m['leadership.vice_gov_pos']()}
						</span>
						<h2 class="text-2xl font-black md:text-3xl">
							{m['leadership.vice_gov_name']()}
						</h2>
					</div>
				</div>
			</div>

			<!-- Main Content -->
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
				<div class="lg:col-span-2">
					<div class="prose prose-lg max-w-none dark:prose-invert prose-headings:font-black prose-headings:text-ppid-primary prose-a:text-ppid-primary">
						{#if isLoading}
							<div class="space-y-4">
								<div class="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
								<div class="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
								<div class="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
							</div>
						{:else}
							{@html profil.deskripsi || '<p>Deskripsi profil belum tersedia.</p>'}
						{/if}
					</div>
				</div>

				<!-- Sidebar Quick Facts -->
				<div class="space-y-6">
					<div class="rounded-3xl border border-slate-100 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-800/50">
						<h3 class="mb-6 border-l-4 border-ppid-accent pl-4 text-lg font-bold text-ppid-primary dark:text-white">
							{m['gov_profile.province_info']()}
						</h3>
						<dl class="space-y-6">
							<div>
								<dt class="text-xs font-bold text-slate-400 uppercase tracking-wider">{m['gov_profile.capital']()}</dt>
								<dd class="mt-1 font-bold text-slate-900 dark:text-white">Makassar</dd>
							</div>
							<div>
								<dt class="text-xs font-bold text-slate-400 uppercase tracking-wider">{m['gov_profile.area']()}</dt>
								<dd class="mt-1 font-bold text-slate-900 dark:text-white">46.717,48 km²</dd>
							</div>
							<div>
								<dt class="text-xs font-bold text-slate-400 uppercase tracking-wider">{m['gov_profile.population']()}</dt>
								<dd class="mt-1 font-bold text-slate-900 dark:text-white">± 9 Juta Jiwa</dd>
							</div>
							<div>
								<dt class="text-xs font-bold text-slate-400 uppercase tracking-wider">{m['gov_profile.admin_units']()}</dt>
								<dd class="mt-1 font-bold text-slate-900 dark:text-white">21 Kabupaten & 3 Kota</dd>
							</div>
						</dl>
					</div>

					<div class="rounded-3xl bg-ppid-primary p-8 text-white">
						<h3 class="mb-4 text-lg font-bold">{m['gov_profile.potentials_title']()}</h3>
						<div class="space-y-3 text-sm text-white/90">
							<div>• {m['gov_profile.potentials.p1']()}</div>
							<div>• {m['gov_profile.potentials.p2']()}</div>
							<div>• {m['gov_profile.potentials.p3']()}</div>
							<div>• {m['gov_profile.potentials.p4']()}</div>
							<div>• {m['gov_profile.potentials.p5']()}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />
