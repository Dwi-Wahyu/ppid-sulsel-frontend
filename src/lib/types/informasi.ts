export interface SkpdItem {
	id_skpd: string;
	nm_skpd: string;
	alamat?: string;
	email?: string;
	situs?: string;
	no_tlp?: string;
	kadis?: string;
	jenis?: string;
}

export interface InformasiItem {
	id_informasi: number;
	id_kat_info: number;
	id_skpd: string;
	judul: string;
	file: string;
	tgl_upload: string;
	download: number;
	verify: string;
	ket: string;
	jumlah_download: number | null;
	skpd: SkpdItem;
	kategori?: {
		id_kat_info: number;
		nm_kat_info: string;
		slug: string;
	};
}

export interface TahunResponse {
	success: boolean;
	year: string;
	data: {
		current_page: number;
		data: InformasiItem[];
		per_page: number;
		total: number;
		last_page: number;
		links: PaginationLink[];
		next_page_url: string | null;
		prev_page_url: string | null;
	};
	available_years: YearOption[];
}

export interface KategoriInfo {
	id: number;
	name: string;
}

export interface YearOption {
	id: number;
	waktu: string;
}

export interface PaginationLink {
	url: string | null;
	label: string;
	page: number | null;
	active: boolean;
}

export interface KategoriResponse {
	success: boolean;
	category: KategoriInfo;
	data: {
		current_page: number;
		data: InformasiItem[];
		per_page: number;
		total: number;
		last_page: number;
		links: PaginationLink[];
		next_page_url: string | null;
		prev_page_url: string | null;
	};
	available_years: YearOption[];
}
