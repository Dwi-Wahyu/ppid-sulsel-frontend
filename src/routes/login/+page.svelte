<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let props = $props();

	// Sertakan 'enhance' untuk menangani pengiriman form secara reaktif
	const { form, errors, enhance, delayed } = superForm(props.data.form);
</script>

<form method="POST" use:enhance class="mx-auto max-w-md p-6">
	{#if $errors._errors}
		<div class="mb-4 rounded bg-ppid-error/10 p-3 text-sm font-medium text-ppid-error">
			{$errors._errors}
		</div>
	{/if}

	<div class="mb-4">
		<label for="username" class="block text-sm font-medium text-ppid-text">Username</label>
		<input
			type="text"
			name="username"
			bind:value={$form.username}
			class="mt-1 w-full rounded border p-2 {$errors.username
				? 'border-ppid-error'
				: 'border-gray-300'}"
		/>
		{#if $errors.username}
			<p class="mt-1 text-xs text-ppid-error">{$errors.username}</p>
		{/if}
	</div>

	<div class="mb-6">
		<label for="password" class="block text-sm font-medium text-ppid-text">Password</label>
		<input
			type="password"
			name="password"
			bind:value={$form.password}
			class="mt-1 w-full rounded border p-2 {$errors.password
				? 'border-ppid-error'
				: 'border-gray-300'}"
		/>
		{#if $errors.password}
			<p class="mt-1 text-xs text-ppid-error">{$errors.password}</p>
		{/if}
	</div>

	<button
		type="submit"
		disabled={$delayed}
		class="w-full rounded bg-ppid-primary px-4 py-2 font-bold text-white transition-colors hover:bg-ppid-primary-hover"
	>
		{$delayed ? 'Memproses...' : 'Login'}
	</button>
</form>
