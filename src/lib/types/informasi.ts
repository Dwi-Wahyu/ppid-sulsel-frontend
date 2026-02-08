export interface InformasiItem {
	id_informasi: number;
	judul: string;
	file: string;
	tgl_upload: string;
	skpd: {
		nm_skpd: string;
	};
}

export interface KategoriInfo {
	id: number;
	name: string;
}

export interface YearOption {
	id: number;
	waktu: string;
}

export interface KategoriResponse {
	success: boolean;
	category: KategoriInfo;
	data: {
		current_page: number;
		data: InformasiItem[];
		per_page: number;
		links: Array<{ url: string | null; label: string; active: boolean }>;
	};
	available_years: YearOption[];
}
