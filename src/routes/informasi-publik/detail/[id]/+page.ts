import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { env } from '$env/dynamic/public';

const BACKEND_URL = env.PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const load: PageLoad = async ({ params, fetch }) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/public/informasi/detail/${params.id}`);

        if (!response.ok) {
            throw error(response.status, 'Dokumen tidak ditemukan');
        }

        const result = await response.json();

        if (!result.success || !result.data) {
            throw error(404, 'Dokumen tidak ditemukan');
        }

        return {
            informasi: result.data
        };
    } catch (err) {
        console.error('Error loading document detail:', err);
        throw error(500, 'Terjadi kesalahan saat memuat detail dokumen');
    }
};
