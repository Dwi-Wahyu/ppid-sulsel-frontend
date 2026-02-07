class ThemeState {
	// Ambil nilai awal dari localStorage jika ada
	darkMode = $state(false);

	constructor() {
		// Hanya jalankan di browser
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('theme');
			this.darkMode =
				saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
			this.apply();
		}
	}

	toggle() {
		this.darkMode = !this.darkMode;
		this.apply();
	}

	private apply() {
		if (typeof document === 'undefined') return;

		if (this.darkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
}

export const theme = new ThemeState();
