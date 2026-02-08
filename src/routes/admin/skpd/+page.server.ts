import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
    const token = cookies.get('access_token');

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };

    try {
        const search = url.searchParams.get('search') || '';

        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);

        const response = await fetch(`${API_URL}/admin/skpd?${queryParams.toString()}`, {
            headers
        });

        if (response.ok) {
            const result = await response.json();
            return {
                skpds: result.data || [],
                search
            };
        }

        return {
            skpds: [],
            search: ''
        };
    } catch (error) {
        console.error('Error loading SKPD data:', error);
        return {
            skpds: [],
            search: ''
        };
    }
};
