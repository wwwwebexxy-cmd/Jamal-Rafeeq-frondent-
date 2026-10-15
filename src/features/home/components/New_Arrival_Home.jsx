import "../styles/New_Arrival_Home.css";
import Newarrival_Query from "../../newArrivals/queries/Newarrival_Query";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getImageUrl } from "../../../utils/imageUrl";
import defaultImage from "../../../assets/image_not_available.png";
import Product_Query from "../../sale/queries/Product_Query";
import DirhamAmount from "../../../components/DirhamAmount";
import { getHomepageProductPricing } from "../utils/productPricing";
import { getProductWhatsappUrl } from "../../../config/business";

const MAX_PRODUCTS_PER_SECTION = 9;
const hasValue = (value) => value !== null && value !== undefined && value !== "";

function getProductSelection(product) {
    const variant = product?.variants?.[0] || (hasValue(product?.default_variant_id)
        ? { id: product.default_variant_id, price_type: hasValue(product.default_variant_unit_id) ? "multiple" : "single" }
        : null);
    const size = variant?.price_type === "single"
        ? null
        : variant?.sizes?.[0] || variant?.units?.[0] || (hasValue(product?.default_variant_unit_id) ? { id: product.default_variant_unit_id } : null);
    return { variant, size };
}

function getProductImage(product) {
    return product?.product_image
        || product?.image
        || product?.variants?.[0]?.images?.find((image) => image.is_primary)?.image
        || product?.variants?.[0]?.images?.[0]?.image;
}

function New_Arrival_Home({
    products,
    totalCount,
    title = "New Arrivals",
    subtitle = "The latest parts and accessories for your vehicle.",
    viewAllTo = "/new-arrivals",
    showNewBadge = false,
    tone = "new",
}) {
    const navigate = useNavigate();
    const hasProvidedProducts = Array.isArray(products);
    const { data: rawData, isLoading: newArrivalsLoading, error: newArrivalsError } = Newarrival_Query({ enabled: !hasProvidedProducts });
    const { data: rawShopData, isLoading: shopLoading } = Product_Query({}, { enabled: !hasProvidedProducts });
    const data = hasProvidedProducts ? products : (rawData?.results || []);
    const shopData = hasProvidedProducts ? [] : (rawShopData?.results || []);
    const isLoading = !hasProvidedProducts && (newArrivalsLoading || shopLoading);
    const error = hasProvidedProducts ? null : newArrivalsError;
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setShowLoader(false), 700);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [isLoading]);

    const displayData = hasProvidedProducts
        ? data.slice(0, MAX_PRODUCTS_PER_SECTION)
        : [...data, ...shopData.filter((item) => !data.some((arrival) => String(arrival.id) === String(item.id)))].slice(0, MAX_PRODUCTS_PER_SECTION);
    const availableCount = Number(totalCount ?? (hasProvidedProducts ? data.length : rawData?.count ?? data.length));
    const showViewAll = availableCount > MAX_PRODUCTS_PER_SECTION || data.length > MAX_PRODUCTS_PER_SECTION;

    if (hasProvidedProducts && !data.length) return null;

    if (isLoading || showLoader) {
        return (
            <div className={`new-arrivals-wrapper new-arrivals-wrapper--${tone}`}>
                <section className="new-arrivals">
                    <div className="heading-container">
                        <div className="heading-text">
                            <h2>{title}</h2>
                            <p className="heading-sub">{subtitle}</p>
                        </div>
                        <div className="view-all-link skeleton" style={{ width: "80px", height: "24px", padding: 0 }} />
                    </div>
                    <div className="grid-container"><div className="new-arrivals-grid">{Array.from({ length: 16 }).map((_, index) => <div key={index} className="new-product-card"><div className="image-container skeleton" /><div className="product-details" style={{ marginTop: "15px" }}><div className="skeleton skeleton-text" style={{ width: "40%" }} /><div className="skeleton skeleton-text" style={{ width: "80%", height: "18px" }} /><div className="skeleton skeleton-text" style={{ width: "30%", marginTop: "8px" }} /></div></div>)}</div></div>
                </section>
            </div>
        );
    }

    if (error) return <p className="error-text">Failed to load products.</p>;
    if (!displayData.length) return null;

    return (
        <div className={`new-arrivals-wrapper new-arrivals-wrapper--${tone}`}>
            <section className="new-arrivals">
                <div className="heading-container">
                    <div className="heading-text">
                        <h2>{title}</h2>
                        <p className="heading-sub">{subtitle}</p>
                    </div>
                </div>

                <div className="grid-container">
                    <div className="new-arrivals-grid">
                        {displayData.map((item) => {
                            const { variant } = getProductSelection(item);
                            const image = getProductImage(item);
                            const { currentPrice, originalPrice, discountPercentage, hasOffer } = getHomepageProductPricing(item, variant);
                            const whatsappUrl = getProductWhatsappUrl(item, item.id);

                            return (
                                <article key={item.id} className="new-product-card">
                                    <div className="image-container" onClick={() => navigate(`/single/${item.id}`)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/single/${item.id}`); }}>
                                        <img
                                            src={image ? getImageUrl(image) : defaultImage}
                                            alt={`${item.name || "Product"} product image`}
                                            className="product-img"
                                            onError={(event) => { if (event.currentTarget.src !== defaultImage) event.currentTarget.src = defaultImage; }}
                                        />
                                        {hasOffer && <span className="badge-offer">{discountPercentage}% OFF</span>}
                                        {showNewBadge && item.is_active && <span className="badge-new">NEW</span>}
                                        <button type="button" className="quick-add-btn" onClick={(event) => { event.stopPropagation(); navigate(`/single/${item.id}`); }}>VIEW PRODUCT</button>
                                    </div>

                                    <div className="product-details">
                                        <span className="product-tag">{item.brand?.name || item.brand_name || "AUTOMOTIVE PRODUCT"}</span>
                                        <h3 className="newHome-product-title">{item.name || item.description || "Automotive product"}</h3>
                                        <div className="product-meta">
                                            <div className="price-area">
                                                {originalPrice !== null && <span className="old-price"><DirhamAmount value={originalPrice} fallback="Price unavailable" /></span>}
                                                <span className="product-price"><DirhamAmount value={currentPrice} fallback="Price unavailable" /></span>
                                            </div>
                                        </div>
                                        {whatsappUrl ? <a className="whatsapp-home-product-btn" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>Order via WhatsApp</a> : <span className="whatsapp-home-product-disabled">WhatsApp enquiry unavailable</span>}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>

                {showViewAll && <div className="view-all-bottom-container" style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                    <Link to={viewAllTo} className="view-all-btn">VIEW ALL<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="view-all-arrow"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></Link>
                </div>}
            </section>
        </div>
    );
}

export default New_Arrival_Home;
