import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { PermohonanInformasiDetailApiResponse } from '$lib/types/PermohonanInformasiTypes';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
    const token = cookies.get('access_token');
    const { id } = params;

    try {
        // Fetch permohonan detail
        const permohonanResponse = await fetch(`${API_URL}/admin/permohonan-informasi/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        if (!permohonanResponse.ok) {
            throw new Error('Failed to fetch permohonan detail');
        }

        const permohonanResult: PermohonanInformasiDetailApiResponse =
            await permohonanResponse.json();

        // Fetch current user to Identify SKPD
        const userResponse = await fetch(`${API_URL}/admin/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        let user = null;
        if (userResponse.ok) {
            user = await userResponse.json();
        }

        return {
            permohonan: permohonanResult.data,
            user
        };
    } catch (error) {
        console.error('Error loading permohonan detail:', error);
        throw error;
    }
};
