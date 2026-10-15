import { API_URL } from "../lib/apiUrl";

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (/^(https?:)?\/\//i.test(imagePath)) {
        return imagePath;
    }

    // Django serves uploaded media from /media/, outside the /api/ prefix.
    // Keep root-relative media URLs at the site root so uploaded videos and
    // brand logos do not incorrectly become /api/media/... URLs.
    if (String(imagePath).startsWith("/")) {
        if (API_URL.startsWith("/")) return imagePath;
        return `${new URL(API_URL).origin}${imagePath}`;
    }

    return `${API_URL.replace(/\/$/, "")}/${String(imagePath).replace(/^\//, "")}`;
};
