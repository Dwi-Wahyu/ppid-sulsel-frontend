import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const token = cookies.get('access_token');

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };

    try {
        // Fetch the authenticated OPD user's SKPD data
        const response = await fetch(`${API_URL}/opd/profil-skpd`, {
            headers
        });

        if (response.ok) {
            const result = await response.json();
            return {
                skpd: result.data || null
            };
        }

        return {
            skpd: null
        };
    } catch (error) {
        console.error('Error loading SKPD profile:', error);
        return {
            skpd: null
        };
    }
};
