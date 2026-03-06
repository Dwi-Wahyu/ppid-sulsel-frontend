import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const token = cookies.get('access_token')

    try {
        const response = await fetch(`${API_URL}/admin/dashboard`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return {
                stats: null,
                notifications: [],
                error: 'Gagal mengambil data dari server'
            };
        }

        const result = await response.json();

        return {
            stats: result.data.stats,
            notifications: result.data.notifications
        };
    } catch (err) {
        console.error('Dashboard Load Error:', err);
        return {
            stats: null,
            notifications: [],
            error: 'Terjadi kesalahan koneksi'
        };
    }
};