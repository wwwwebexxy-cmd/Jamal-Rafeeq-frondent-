const configuredWhatsappNumber = String(import.meta.env.VITE_WHATSAPP_NUMBER || "")
    .replace(/[^0-9]/g, "");

export const WHATSAPP_NUMBER = configuredWhatsappNumber;
export const BUSINESS_PHONE_NUMBERS = [
    { display: "+971 50 873 6155", href: "tel:+971508736155" },
    { display: "+971 58 895 9179", href: "tel:+971588959179" },
];
export const BUSINESS_EMAIL = "jrautopartsdubai@gmail.com";
export const BUSINESS_WEBSITE = "https://www.jrautospareparts.com";
export const BUSINESS_ADDRESS = "Bin Thani Building, Shop No: 21, Deira, Dubai - UAE";

export function getWhatsappUrl(message) {
    if (!WHATSAPP_NUMBER) return "";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getProductWhatsappUrl(product, productId) {
    const productUrl = typeof window === "undefined"
        ? `/single/${productId}`
        : `${window.location.origin}/single/${productId}`;
    const message = [
        "Hello, I would like to enquire about this product.",
        "",
        `Product: ${product?.name || "Automotive product"}`,
        `Product link: ${productUrl}`,
        "",
        "Please confirm availability and pricing.",
    ].join("\n");
    return getWhatsappUrl(message);
}
