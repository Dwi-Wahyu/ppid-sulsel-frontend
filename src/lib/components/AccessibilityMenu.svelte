<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Svelte 5 runes for state management
	let isOpen = $state(false);
	let isDragging = $state(false);
	let hasMoved = $state(false);
	let pos = $state({ x: 24, y: 0 });

	let settings = $state({
		contrast: false,
		monochrome: false,
		dyslexic: false,
		bold: false,
		links: false,
		titles: false,
		speech: false,
		pause: false,
		cursor: false,
		mask: false,
		guide: false,
		dark: false,
		fontSize: 16,
		hideImages: false,
		textAlign: 'none',
		saturation: 'normal',
		textSpacing: false,
		widgetPosition: 'auto'
	});

	let speechHandler: ((e: MouseEvent) => void) | null = null;
	let realSpeechHandler: ((e: MouseEvent) => void) | null = null;

	onMount(() => {
		if (!browser) return;

		// Load settings from localStorage
		const savedSettings = {
			contrast: localStorage.getItem('acc-contrast') === 'true',
			monochrome: localStorage.getItem('acc-monochrome') === 'true',
			dyslexic: localStorage.getItem('acc-dyslexic') === 'true',
			bold: localStorage.getItem('acc-bold') === 'true',
			links: localStorage.getItem('acc-links') === 'true',
			titles: localStorage.getItem('acc-titles') === 'true',
			speech: localStorage.getItem('acc-speech') === 'true',
			pause: localStorage.getItem('acc-pause') === 'true',
			cursor: localStorage.getItem('acc-cursor') === 'true',
			mask: localStorage.getItem('acc-mask') === 'true',
			guide: localStorage.getItem('acc-guide') === 'true',
			dark: localStorage.getItem('theme') === 'dark',
			fontSize: parseInt(localStorage.getItem('acc-font-size') || '16'),
			hideImages: localStorage.getItem('acc-hideImages') === 'true',
			textAlign: localStorage.getItem('acc-textAlign') || 'none',
			saturation: localStorage.getItem('acc-saturation') || 'normal',
			textSpacing: localStorage.getItem('acc-textSpacing') === 'true',
			widgetPosition: localStorage.getItem('acc-widgetPosition') || 'auto'
		};

		Object.assign(settings, savedSettings);

		// Initialize position
		pos.x = parseInt(localStorage.getItem('acc-pos-x') || '24');
		pos.y = parseInt(localStorage.getItem('acc-pos-y') || String(window.innerHeight - 100));

		applyToBody();
		initSpeech();
	});

	$effect(() => {
		if (!browser) return;
		applyToBody();
	});

	function toggle(key: keyof typeof settings) {
		if (typeof settings[key] === 'boolean') {
			(settings[key] as boolean) = !(settings[key] as boolean);
			localStorage.setItem(`acc-${key}`, String(settings[key]));
			if (key === 'speech') initSpeech();
		}
	}

	function setTextAlign(align: string) {
		settings.textAlign = align;
		localStorage.setItem('acc-textAlign', align);
	}

	function setSaturation(level: string) {
		settings.saturation = level;
		localStorage.setItem('acc-saturation', level);
	}

	function setWidgetPosition(position: string) {
		settings.widgetPosition = position;
		localStorage.setItem('acc-widgetPosition', position);
		if (position === 'left') pos.x = 16;
		else if (position === 'right') pos.x = window.innerWidth - 70;
		localStorage.setItem('acc-pos-x', String(pos.x));
	}

	function adjustFont(val: number) {
		settings.fontSize = Math.max(12, Math.min(24, settings.fontSize + val));
		localStorage.setItem('acc-font-size', String(settings.fontSize));
	}

	function applyToBody() {
		if (!browser) return;
		const body = document.body;
		const doc = document.documentElement;

		body.classList.toggle('high-contrast', settings.contrast);
		body.classList.toggle('monochrome', settings.monochrome);
		body.classList.toggle('dyslexic-font', settings.dyslexic);
		body.classList.toggle('bold-text', settings.bold);
		body.classList.toggle('highlight-links', settings.links);
		body.classList.toggle('highlight-titles', settings.titles);
		body.classList.toggle('acc-cursor-big', settings.cursor);
		body.classList.toggle('acc-mask-mode', settings.mask);
		body.classList.toggle('acc-reading-guide', settings.guide);
		body.classList.toggle('reduce-motion', settings.pause);
		body.classList.toggle('acc-hide-images', settings.hideImages);
		body.classList.toggle('acc-text-spacing', settings.textSpacing);
		body.classList.toggle('acc-widget-hidden', settings.widgetPosition === 'hidden');

		doc.classList.toggle('dark', settings.dark);
		localStorage.setItem('theme', settings.dark ? 'dark' : 'light');

		doc.style.fontSize = `${settings.fontSize}px`;

		body.classList.remove('acc-text-left', 'acc-text-center', 'acc-text-right');
		if (settings.textAlign !== 'none') body.classList.add(`acc-text-${settings.textAlign}`);

		body.classList.remove('acc-high-saturation', 'acc-low-saturation');
		if (settings.saturation === 'high') body.classList.add('acc-high-saturation');
		else if (settings.saturation === 'low') body.classList.add('acc-low-saturation');
	}

	function initSpeech() {
		if (!browser) return;
		if (settings.speech) {
			document.body.classList.add('speech-mode');
			addSpeechListeners();
		} else {
			document.body.classList.remove('speech-mode');
			removeSpeechListeners();
			window.speechSynthesis.cancel();
		}
	}

	function addSpeechListeners() {
		if (speechHandler || !browser) return;

		speechHandler = (e: MouseEvent) => {
			if (!settings.speech) return;
			window.speechSynthesis.cancel();
			const target = (e.target as HTMLElement).closest(
				'h1, h2, h3, h4, h5, h6, p, a, span, li, button, input, label'
			) as HTMLElement;
			if (target && target.innerText && target.innerText.trim().length > 0) {
				const utterance = new SpeechSynthesisUtterance(target.innerText);
				utterance.lang = document.documentElement.lang || 'id-ID';
				utterance.rate = 1;
				window.speechSynthesis.speak(utterance);
			}
		};

		let timer: number;
		realSpeechHandler = (e: MouseEvent) => {
			clearTimeout(timer);
			timer = window.setTimeout(() => {
				if (speechHandler) speechHandler(e);
			}, 500);
		};
		document.addEventListener('mouseover', realSpeechHandler);
	}

	function removeSpeechListeners() {
		if (realSpeechHandler && browser) {
			document.removeEventListener('mouseover', realSpeechHandler);
			realSpeechHandler = null;
			speechHandler = null;
		}
	}

	// Reading Guide & Mask Logic
	let updateGuidePos = (e: MouseEvent) => {
		if (!browser) return;
		if (settings.guide) {
			document.documentElement.style.setProperty('--guide-y', `${e.clientY}px`);
		}
		if (settings.mask) {
			document.documentElement.style.setProperty('--mask-y-start', `${e.clientY - 50}px`);
			document.documentElement.style.setProperty('--mask-y-end', `${e.clientY + 50}px`);
		}
	};

	$effect(() => {
		if (!browser) return;
		if (settings.guide || settings.mask) {
			window.addEventListener('mousemove', updateGuidePos);
		} else {
			window.removeEventListener('mousemove', updateGuidePos);
		}
		return () => {
			if (browser) window.removeEventListener('mousemove', updateGuidePos);
		};
	});

	function reset() {
		Object.assign(settings, {
			contrast: false,
			monochrome: false,
			dyslexic: false,
			bold: false,
			links: false,
			titles: false,
			speech: false,
			pause: false,
			cursor: false,
			mask: false,
			guide: false,
			dark: false,
			fontSize: 16,
			hideImages: false,
			textAlign: 'none',
			saturation: 'normal',
			textSpacing: false,
			widgetPosition: 'auto'
		});
		localStorage.clear();
		applyToBody();
	}

	function startDragging(e: MouseEvent | TouchEvent) {
		isDragging = true;
		hasMoved = false;
		const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;

		const move = (event: MouseEvent | TouchEvent) => {
			if (!isDragging) return;
			const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
			const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
			const diffX = Math.abs(clientX - startX);
			const diffY = Math.abs(clientY - startY);
			if (diffX > 5 || diffY > 5) {
				hasMoved = true;
				pos.x = clientX - 28;
				pos.y = clientY - 28;
			}
		};

		const stop = () => {
			isDragging = false;
			if (hasMoved) {
				pos.x = pos.x + 28 > window.innerWidth / 2 ? window.innerWidth - 70 : 16;
				pos.y = Math.max(20, Math.min(window.innerHeight - 80, pos.y));
				localStorage.setItem('acc-pos-x', String(pos.x));
				localStorage.setItem('acc-pos-y', String(pos.y));
			}
			window.removeEventListener('mousemove', move);
			window.removeEventListener('mouseup', stop);
			window.removeEventListener('touchmove', move);
			window.removeEventListener('touchend', stop);
		};

		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', stop);
		window.addEventListener('touchmove', move, { passive: false });
		window.addEventListener('touchend', stop);
	}

	const features = [
		{ id: 'dark', label: 'Dark Mode', icon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' },
		{ id: 'contrast', label: 'Contrast', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' },
		{
			id: 'monochrome',
			label: 'Monochrome',
			icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z'
		},
		{ id: 'dyslexic', label: 'Dyslexic', icon: 'M4 7V4h16v3M9 20h6M12 4v16' },
		{
			id: 'bold',
			label: 'Bold Text',
			icon: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z'
		},
		{
			id: 'links',
			label: 'Underline Links',
			icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'
		},
		{ id: 'titles', label: 'Highlight Titles', icon: 'M6 12h12M6 20h12M6 4h12' },
		{
			id: 'speech',
			label: 'Speech Mode',
			icon: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8'
		},
		{
			id: 'pause',
			label: 'Pause Animation',
			icon: 'M10 15v-6 M14 15v-6 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'
		},
		{ id: 'cursor', label: 'Big Cursor', icon: 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z' },
		{ id: 'mask', label: 'Reading Mask', icon: 'M2 12h20 M4 6h16 M4 18h16' },
		{
			id: 'guide',
			label: 'Reading Guide',
			icon: 'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'
		},
		{
			id: 'hideImages',
			label: 'Hide Images',
			icon: 'M3 3l18 18M10.584 10.587a2 2 0 0 0 2.828 2.83M9.363 5.365A9.466 9.466 0 0 1 12 5c4 0 7.333 2.333 10 7-1.253 2.09-2.573 3.75-3.96 4.98'
		},
		{ id: 'textSpacing', label: 'Text Spacing', icon: 'M5 12h14M5 5v14M19 5v14' }
	] as const;
</script>

<div class="relative z-9999 font-sans" id="accessibility-widget">
	<button
		onmousedown={startDragging}
		ontouchstart={startDragging}
		onclick={() => {
			if (!hasMoved) isOpen = !isOpen;
		}}
		class="fixed z-9999 flex h-14 w-14 cursor-move items-center justify-center rounded-full border border-access-border-orange bg-access-primary text-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
		style="left: {pos.x}px; top: {pos.y}px;"
		aria-label="Accessibility Menu"
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
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M9 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
			<path d="M11 7l0 8l4 0l4 5" />
			<path d="M11 11l5 0" />
			<path d="M7 11.5a5 5 0 1 0 6 7.5" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="custom-scrollbar fixed z-9998 max-h-[90vh] w-96 overflow-hidden overflow-y-auto rounded-[24px] border border-access-border bg-access-bg shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
			style="top: {pos.y > (browser ? window.innerHeight / 2 : 500)
				? pos.y - 520
				: pos.y + 70}px; left: {pos.x > (browser ? window.innerWidth / 2 : 500)
				? pos.x - 380
				: pos.x}px;"
		>
			<div
				class="sticky top-0 z-10 flex items-center justify-between bg-access-primary p-5 text-white"
			>
				<h3 class="flex items-center gap-2 text-lg font-bold">Accessibility Menu</h3>
				<button
					onclick={() => (isOpen = false)}
					class="rounded-lg p-1 transition-colors hover:bg-white/20"
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				</button>
			</div>

			<div class="space-y-4 p-5">
				<div>
					<p class="mb-2 text-[10px] font-black tracking-widest text-access-text-muted uppercase">
						Font Size
					</p>
					<div class="flex items-center justify-between rounded-xl bg-access-bg-gray p-2">
						<button
							onclick={() => adjustFont(-2)}
							class="h-10 w-10 rounded-lg bg-white font-bold text-access-primary shadow-sm transition-colors hover:bg-access-button-hover"
							aria-label="Decrease font size">-</button
						>
						<span class="font-bold text-access-text">{settings.fontSize}px</span>
						<button
							onclick={() => adjustFont(2)}
							class="h-10 w-10 rounded-lg bg-white font-bold text-access-primary shadow-sm transition-colors hover:bg-access-button-hover"
							aria-label="Increase font size">+</button
						>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-3">
					{#each features as f}
						<button
							onclick={() => toggle(f.id as keyof typeof settings)}
							aria-label={f.label}
							class="group relative flex flex-col items-center justify-center rounded-2xl border p-3 shadow-sm transition-all duration-300 focus:outline-none {settings[
								f.id as keyof typeof settings
							]
								? 'border-access-primary bg-access-primary text-white shadow-lg shadow-access-primary/20'
								: 'border-transparent bg-access-bg-gray text-access-text hover:border-access-primary/20 hover:bg-access-primary/5 hover:text-access-primary'}"
						>
							<div
								class="mb-1.5 transition-all duration-300 group-hover:scale-125 group-active:scale-90"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d={f.icon} />
								</svg>
							</div>
							<span
								class="text-center text-[9px] leading-tight font-black tracking-tighter uppercase"
								>{f.label}</span
							>
							{#if settings[f.id as keyof typeof settings]}
								<div class="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white"></div>
							{/if}
						</button>
					{/each}
				</div>

				<div>
					<p class="mb-2 text-[10px] font-black tracking-widest text-access-text-muted uppercase">
						Text Align
					</p>
					<div class="grid grid-cols-3 gap-2">
						{#each ['left', 'center', 'right'] as align}
							<button
								onclick={() => setTextAlign(align)}
								aria-label="Align text {align}"
								class="rounded-lg px-3 py-2 text-xs font-bold transition-colors {settings.textAlign ===
								align
									? 'bg-access-primary text-white'
									: 'bg-access-bg-gray text-access-text hover:bg-access-button-hover'}"
							>
								{align.toUpperCase()}
							</button>
						{/each}
					</div>
				</div>

				<div>
					<p class="mb-2 text-[10px] font-black tracking-widest text-access-text-muted uppercase">
						Saturation
					</p>
					<div class="grid grid-cols-3 gap-2">
						{#each ['normal', 'high', 'low'] as level}
							<button
								onclick={() => setSaturation(level)}
								aria-label="{level} saturation"
								class="rounded-lg px-3 py-2 text-xs font-bold transition-colors {settings.saturation ===
								level
									? 'bg-access-primary text-white'
									: 'bg-access-bg-gray text-access-text hover:bg-access-button-hover'}"
							>
								{level.toUpperCase()}
							</button>
						{/each}
					</div>
				</div>

				<div>
					<p class="mb-2 text-[10px] font-black tracking-widest text-access-text-muted uppercase">
						Widget Position
					</p>
					<div class="grid grid-cols-3 gap-2">
						{#each ['left', 'right', 'hidden'] as position}
							<button
								onclick={() => setWidgetPosition(position)}
								aria-label="Widget position {position}"
								class="rounded-lg px-3 py-2 text-xs font-bold transition-colors {settings.widgetPosition ===
								position
									? 'bg-access-primary text-white'
									: 'bg-access-bg-gray text-access-text hover:bg-access-button-hover'}"
							>
								{position.toUpperCase()}
							</button>
						{/each}
					</div>
				</div>

				<button
					onclick={reset}
					class="w-full rounded-xl border border-dashed border-red-200 py-3 text-xs font-black text-red-500 uppercase transition-colors hover:bg-red-50"
				>
					Reset Settings
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.acc-reading-guide::after) {
		content: '';
		position: fixed;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--color-access-primary-hover);
		box-shadow: 0 0 20px rgba(128, 0, 32, 0.5);
		z-index: 9999;
		pointer-events: none;
		top: var(--guide-y, 50%);
	}

	:global(.acc-mask-mode::after) {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 9998;
		pointer-events: none;
		clip-path: polygon(
			0% 0%,
			100% 0%,
			100% 100%,
			0% 100%,
			0% var(--mask-y-start, 40%),
			100% var(--mask-y-start, 40%),
			100% var(--mask-y-end, 60%),
			0% var(--mask-y-end, 60%),
			0% var(--mask-y-start, 40%),
			0% 100%
		);
	}
</style>
