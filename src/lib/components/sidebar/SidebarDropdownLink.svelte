<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		href: string;
		label: string;
	}

	let { href, label }: Props = $props();

	let isActive = $derived(page.url.pathname === href || page.url.pathname.startsWith(href + '/'));
</script>

<li>
	<a
		{href}
		class="group relative mx-3 flex items-center rounded-xl py-2 pr-4 pl-11 text-sm font-medium transition-all duration-200 {isActive
			? 'text-ppid-accent'
			: 'text-slate-400 hover:bg-white/5 hover:text-white'}"
	>
		<!-- Indicator Dot -->
		<span
			class="absolute left-7 h-1.5 w-1.5 rounded-full transition-all duration-200 {isActive
				? 'scale-125 bg-ppid-accent'
				: 'bg-slate-500'}"
			style={isActive ? 'view-transition-name: active-sidebar-dot;' : ''}
		></span>

		<span class="truncate">{label}</span>
	</a>
</li>
