import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
    const token = cookies.get('access_token');

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };

    try {
        // Get query parameters for search and pagination
        const search = url.searchParams.get('search') || '';
        const page = url.searchParams.get('page') || '1';

        // Build query string
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        queryParams.append('page', page);

        const response = await fetch(`${API_URL}/admin/matriks-dip?${queryParams.toString()}`, {
            headers
        });

        if (response.ok) {
            const result = await response.json();
            return {
                items: result.data || {},
                search
            };
        }

        return {
            items: { data: [], total: 0, current_page: 1, last_page: 1 },
            search: ''
        };
    } catch (error) {
        console.error('Error loading MatriksDip data:', error);
        return {
            items: { data: [], total: 0, current_page: 1, last_page: 1 },
            search: ''
        };
    }
};
