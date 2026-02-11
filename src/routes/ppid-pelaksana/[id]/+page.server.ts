import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
    try {
        const response = await fetch(`${API_URL}/public/skpd/${params.id}`, {
            headers: {
                Accept: 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            if (result.data) {
                return {
                    skpd: result.data
                };
            }
        }

        throw error(404, 'SKPD tidak ditemukan');
    } catch (err: any) {
        if (err.status) throw err;
        throw error(500, 'Terjadi kesalahan pada server');
    }
};
