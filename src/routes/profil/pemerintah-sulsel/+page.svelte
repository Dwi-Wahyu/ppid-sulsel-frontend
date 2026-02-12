<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

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
			const response = await fetch(`${PUBLIC_API_URL}/public/profil/pemerintah`);
			const result = await response.json();
			if (result.success && result.data) {
				profil.deskripsi = result.data.deskripsi;
				if (result.data.foto_gubernur) {
					profil.foto_gubernur = `${PUBLIC_API_URL}/storage/${result.data.foto_gubernur}`;
				}
				if (result.data.foto_wakil) {
					profil.foto_wakil = `${PUBLIC_API_URL}/storage/${result.data.foto_wakil}`;
				}
			}
		} catch (error) {
			console.error('Error fetching Government profile:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<div
	class="border-b border-gray-200 bg-white font-['Plus_Jakarta_Sans'] dark:border-slate-700 dark:bg-slate-800"
>
	<div class="container mx-auto px-4 py-6">
		<Breadcrumb
			items={[{ label: 'breadcrumb.profile', href: '#' }, { label: 'profile.government_profile' }]}
		/>
		<div class="mt-4">
			<PageTitle title={m['profile.government_profile']()} />
		</div>
	</div>
</div>

<main class="bg-gray-50 py-10 font-['Plus_Jakarta_Sans'] md:py-16 dark:bg-slate-900">
	<div class="container mx-auto px-4">
		<!-- Stats -->
		<div class="mx-auto mb-10 grid max-w-5xl gap-6 md:grid-cols-3">
			<div
				class="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-ppid-primary/10"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-6 w-6 text-ppid-primary dark:text-white"
					>
						<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
						<circle cx="12" cy="10" r="3" />
					</svg>
				</div>
				<p class="mb-1 text-2xl font-bold text-ppid-primary dark:text-white">46.717,48 km²</p>
				<p class="text-sm text-gray-600 dark:text-gray-300">{m['gov_profile.area_label']()}</p>
			</div>
			<div
				class="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-ppid-primary/10"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-6 w-6 text-ppid-primary dark:text-white"
					>
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
						<path d="M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
				</div>
				<p class="mb-1 text-2xl font-bold text-ppid-primary dark:text-white">9,07 Juta Jiwa</p>
				<p class="text-sm text-gray-600 dark:text-gray-300">
					{m['gov_profile.population_label']()}
				</p>
			</div>
			<div
				class="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
			>
				<div
					class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-ppid-primary/10"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-6 w-6 text-ppid-primary dark:text-white"
					>
						<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
						<path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
						<path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
						<path d="M10 6h4" />
						<path d="M10 10h4" />
						<path d="M10 14h4" />
						<path d="M10 18h4" />
					</svg>
				</div>
				<p class="mb-1 text-2xl font-bold text-ppid-primary dark:text-white">
					{m['gov_profile.districts_count']()}
				</p>
				<p class="text-sm text-gray-600 dark:text-gray-300">{m['gov_profile.districts_label']()}</p>
			</div>
		</div>

		<!-- Content Grid -->
		<div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="space-y-8 lg:col-span-2">
				<!-- Profil -->
				<div
					class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-5">
						<h2 class="mb-2 text-2xl font-bold text-ppid-primary dark:text-white">
							{m['gov_profile.profile_title']()}
						</h2>
						<div class="h-1 w-20 rounded-full bg-ppid-primary"></div>
					</div>
					<div class="prose max-w-none prose-slate dark:prose-invert">
						{@html profil.deskripsi}
					</div>
				</div>

				<!-- Data Geografis -->
				<div
					class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-5">
						<h2 class="mb-2 text-2xl font-bold text-ppid-primary dark:text-white">
							{m['gov_profile.geo_data_title']()}
						</h2>
						<div class="h-1 w-20 rounded-full bg-ppid-accent"></div>
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						{#each [{ label: m['gov_profile.capital_label'](), value: 'Makassar' }, { label: m['profile.governor'](), value: 'Andi Sudirman Sulaiman' }, { label: m['profile.vice_governor'](), value: 'Fatmawati Rusdi' }, { label: m['gov_profile.districts_sub_label'](), value: '304 Kecamatan' }, { label: m['gov_profile.subdistricts_label'](), value: '3.054 Kel/Desa' }] as item}
							<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-slate-900">
								<div class="h-2 w-2 shrink-0 rounded-full bg-ppid-primary"></div>
								<div>
									<p class="text-xs text-gray-600 dark:text-gray-300">{item.label}</p>
									<p class="text-sm font-bold text-gray-900 dark:text-white">{item.value}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Visi Misi -->
				<div
					class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="mb-5">
						<h2 class="mb-2 text-2xl font-bold text-ppid-primary dark:text-white">
							{m['profile.vision_mission_title']()}
						</h2>
						<div class="h-1 w-20 rounded-full bg-ppid-primary"></div>
					</div>

					<!-- Visi -->
					<div class="mb-6">
						<h3
							class="mb-3 text-sm font-bold tracking-wide text-ppid-primary uppercase dark:text-white"
						>
							{m['profile.vision_title']()}
						</h3>
						<div class="rounded-r-lg border-l-4 border-ppid-primary bg-ppid-primary/5 p-5">
							<p class="leading-relaxed font-medium text-gray-700">
								{m['gov_profile.vision_text']()}
							</p>
						</div>
					</div>

					<!-- Misi -->
					<div>
						<h3
							class="mb-3 text-sm font-bold tracking-wide text-ppid-primary uppercase dark:text-white"
						>
							{m['profile.mission_title']()}
						</h3>
						<div class="space-y-3">
							{#each [m['gov_profile.missions.m1'](), m['gov_profile.missions.m2'](), m['gov_profile.missions.m3'](), m['gov_profile.missions.m4'](), m['gov_profile.missions.m5']()] as item, index}
								<div class="flex items-start gap-3">
									<div
										class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-ppid-primary text-xs font-bold text-white"
									>
										{index + 1}
									</div>
									<p class="flex-1 pt-0.5 text-sm leading-relaxed text-gray-700">{item}</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Pejabat -->
				<div
					class="sticky top-24 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
				>
					<div class="bg-ppid-primary px-5 py-4">
						<h3 class="font-bold text-white">{m['gov_profile.officials_title']()}</h3>
					</div>

					<div class="space-y-4 p-5">
						<!-- Gubernur -->
						<div class="rounded-lg border border-ppid-primary/10 bg-ppid-primary/5 p-4">
							<div class="mb-3 aspect-3/4 overflow-hidden rounded-lg">
								{#if profil.foto_gubernur}
									<img
										src={profil.foto_gubernur}
										alt="Gubernur Sulawesi Selatan"
										class="h-full w-full object-cover"
									/>
								{:else}
									<div
										class="flex h-full w-full items-center justify-center bg-linear-to-br from-ppid-primary to-ppid-text text-white"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-16 w-16"
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
							<p class="text-sm font-bold text-ppid-primary dark:text-white">
								Andi Sudirman Sulaiman
							</p>
							<p class="text-xs font-medium text-ppid-accent">
								{m['profile.governor']()} Sulawesi Selatan
							</p>
						</div>

						<!-- Wakil Gubernur -->
						<div class="rounded-lg border border-ppid-accent/20 bg-ppid-accent/5 p-4">
							<div class="mb-3 aspect-3/4 overflow-hidden rounded-lg">
								{#if profil.foto_wakil}
									<img
										src={profil.foto_wakil}
										alt="Wakil Gubernur Sulawesi Selatan"
										class="h-full w-full object-cover"
									/>
								{:else}
									<div
										class="flex h-full w-full items-center justify-center bg-linear-to-br from-ppid-accent to-[#B08D26] text-white"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-16 w-16"
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
							<p class="text-sm font-bold text-ppid-primary dark:text-white">Fatmawati Rusdi</p>
							<p class="text-xs font-medium text-[#B08D26]">
								{m['profile.vice_governor']()} Sulawesi Selatan
							</p>
						</div>
					</div>
				</div>

				<!-- Potensi -->
				<div class="rounded-xl bg-linear-to-br from-ppid-primary to-ppid-text p-6 text-white">
					<h4 class="mb-3 font-bold">{m['gov_profile.potential_title']()}</h4>
					<div class="space-y-2 text-sm text-white/90">
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
</main>
