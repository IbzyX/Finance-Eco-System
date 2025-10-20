const API_URL = import.meta.env.VITE_API_URL;

export async function getProfile(accessToken) {
    const res = await fetch (`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.json();
}