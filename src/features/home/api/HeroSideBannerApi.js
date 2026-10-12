import client from "../../../lib/ApiClient";

export const getHeroSideBanner = async () => {
    const response = await client.get("hero-side-banner/");
    return response.data;
};
