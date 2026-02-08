import { API_URL } from '$env/static/private';
import type { PageServerLoad, Actions } from './$types';
import type { KategoriInformasi, Skpd } from '$lib/types/DokumenPublikTypes';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const token = cookies.get('access_token');

    try {
        // Fetch kategori list
        const kategoriResponse = await fetch(`${API_URL}/admin/master-data/kategori-informasi`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        let kategoriList: KategoriInformasi[] = [];
        if (kategoriResponse.ok) {
            const kategoriData = await kategoriResponse.json();
            // Handle paginated response - data is nested in data.data
            kategoriList = kategoriData.data?.data || kategoriData.data || [];
        }

        // Fetch SKPD list
        const skpdResponse = await fetch(`${API_URL}/admin/skpd`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        let skpdList: Skpd[] = [];
        if (skpdResponse.ok) {
            const skpdData = await skpdResponse.json();
            skpdList = skpdData.data || [];
        }

        return {
            kategoriList,
            skpdList
        };
    } catch (error) {
        console.error('Error loading form data:', error);
        return {
            kategoriList: [],
            skpdList: []
        };
    }
};

export const actions: Actions = {
    default: async ({ request, cookies, fetch }) => {
        const token = cookies.get('access_token');
        const formData = await request.formData();

        try {
            const response = await fetch(`${API_URL}/admin/dokumen-publik`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                throw redirect(303, '/admin/dokumen-publik?success=created');
            } else {
                return {
                    success: false,
                    errors: result.errors || {},
                    message: result.message || 'Terjadi kesalahan saat menyimpan data.'
                };
            }
        } catch (error) {
            if (error instanceof Response && error.status === 303) {
                throw error;
            }
            return {
                success: false,
                errors: {},
                message: 'Terjadi kesalahan saat menyimpan data.'
            };
        }
    }
};
