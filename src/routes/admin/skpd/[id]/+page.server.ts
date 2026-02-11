import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
    const token = cookies.get('access_token');

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };

    try {
        const response = await fetch(`${API_URL}/admin/skpd`, {
            headers
        });

        if (response.ok) {
            const result = await response.json();
            const skpds = result.data || [];
            const skpd = skpds.find((s: any) => s.id_skpd === params.id);

            if (!skpd) {
                throw error(404, 'SKPD tidak ditemukan');
            }

            return {
                skpd
            };
        }

        throw error(500, 'Gagal memuat data SKPD');
    } catch (err: any) {
        if (err.status) throw err;
        throw error(500, 'Terjadi kesalahan pada server');
    }
};
