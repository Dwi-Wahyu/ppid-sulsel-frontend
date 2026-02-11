export interface Skpd {
    id_skpd: string;
    nm_skpd: string;
}

export interface PengajuanKeberatan {
    id_pengajuan: number;
    no_pendaftaran: string;
    nama_pemohon: string;
    kasus: string;
    id_skpd?: string;
    status: string; // n, p, d, a, t, y
    status_label: string;
    status_color: string;
    created_at: string;
    updated_at: string;
    skpd?: Skpd;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PengajuanKeberatanPaginatedResponse {
    current_page: number;
    data: PengajuanKeberatan[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface PengajuanKeberatanApiResponse {
    success: boolean;
    data: PengajuanKeberatanPaginatedResponse;
}
