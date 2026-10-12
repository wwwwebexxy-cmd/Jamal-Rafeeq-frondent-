import client from "../../../lib/ApiClient";

export const getPromoBanners = async () => {
    const response = await client.get("promo-banners/");
    return response.data;
};
