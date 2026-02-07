class SidebarState {
	// State reaktif menggunakan rune $state
	isOpen = $state(true);

	// Method untuk mengubah state
	toggle() {
		this.isOpen = !this.isOpen;
	}

	// Method untuk menutup (misal: saat pindah rute di mobile)
	close() {
		this.isOpen = false;
	}
}

// Export instance tunggal (Singleton)
export const sidebar = new SidebarState();
