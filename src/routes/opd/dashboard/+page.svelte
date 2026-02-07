<script lang="ts">
	import LogoutButton from '$lib/components/LogoutButton.svelte';

	// Menggunakan snippet $props di Svelte 5
	let { data } = $props();

	// Svelte 5 menggunakan reactive runes ($derived) jika ingin membuat variable turunan
	let user = $derived(data.user);
</script>

{#if user}
	<div>
		<h1>Halo, {user.name}</h1>
		<p>Username: {user.username}</p>

		{#if user.id_skpd}
			<span class="badge">OPD: {user.id_skpd}</span>
		{/if}

		<LogoutButton />
	</div>
{:else}
	<p>Silakan login terlebih dahulu.</p>
{/if}
