// src/lib/types/matriks-dip.ts
export interface MatriksDipItem {
	id: number;
	a: string; // Informasi/Judul
	b: string; // Ringkasan Isi
	c: string; // Pejabat/Unit
	d: string; // Penanggung Jawab
	e: string; // Waktu Pembuatan
	f: string; // Bentuk Tersedia
	g: string; // Jangka Waktu
	h: string; // Link/File
}

export interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
	page: number | null;
}

export interface MatriksDipResponse {
	success: boolean;
	data: {
		current_page: number;
		data: MatriksDipItem[];
		last_page: number;
		links: PaginationLink[];
		total: number;
		per_page: number;
	};
	filters: {
		search: string | null;
	};
}
