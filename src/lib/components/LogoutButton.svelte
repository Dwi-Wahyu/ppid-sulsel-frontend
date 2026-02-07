<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form action="/logout" method="POST" use:enhance>
	<button type="submit" class="nav-link">
		<svg>...</svg> <span>Keluar</span>
	</button>
</form>

<style>
	button {
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
