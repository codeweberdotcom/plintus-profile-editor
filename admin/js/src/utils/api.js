const API_URL = window.plintusEditor?.apiUrl || '/wp-json/plintus/v1/';
const NONCE = window.plintusEditor?.nonce || '';

export async function loadProfileData(profileId) {
    try {
        const response = await fetch(`${API_URL}profiles/${profileId}/data`, {
            method: 'GET',
            headers: {
                'X-WP-Nonce': NONCE,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to load profile data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading profile data:', error);
        return null;
    }
}

export async function saveProfileData(profileId, data) {
    try {
        const response = await fetch(`${API_URL}profiles/${profileId}/data`, {
            method: 'POST',
            headers: {
                'X-WP-Nonce': NONCE,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            throw new Error('Failed to save profile data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving profile data:', error);
        return null;
    }
}

