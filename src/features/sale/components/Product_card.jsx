import { useEffect } from "react";
import "../styles/ProductCard.css";
import { useNavigate } from "react-router-dom";

import { getProductWhatsappUrl } from "../../../config/business";
import { getImageUrl } from "../../../utils/imageUrl";
import defaultImage from "../../../assets/image_not_available.png";
import DirhamAmount from "../../../components/DirhamAmount";

const hasValue = (value) => value !== null && value !== undefined && value !== "";

function getFirstVariant(product) {
    return product?.variants?.[0] || null;
}

function getFirstUnit(variant) {
    if (!variant || variant.price_type === "single") return null;
    return variant.sizes?.[0] || variant.units?.[0] || null;
}

function getProductImage(product, variant) {
    return product?.image
        || product?.product_image
        || variant?.images?.find((item) => item.is_primary)?.image
        || variant?.images?.[0]?.image;
}

function getAvailability(product, variant, unit) {
    if (hasValue(product?.availability)) return String(product.availability);
    if (hasValue(product?.stock_status)) return String(product.stock_status);
    if (product?.in_stock === true) return "In stock";
    if (product?.in_stock === false) return "Out of stock";

    const stock = product?.stock ?? unit?.stock ?? variant?.stock;
    if (hasValue(stock)) return Number(stock) > 0 ? "In stock" : "Out of stock";
    if (product?.is_available === false) return "Out of stock";
    return "Availability varies";
}

function getPricing(product, variant) {
    const originalPrice = product?.original_price ?? variant?.price ?? product?.starting_price;
    const currentPrice = product?.current_price ?? product?.discounted_price ?? product?.starting_price ?? variant?.discounted_price ?? variant?.price;
    const discountedPrice = product?.discounted_price ?? variant?.discounted_price;
    const hasOffer = product?.has_offer === true || (hasValue(product?.discount_percentage) && Number(product.discount_percentage) > 0);
    return { originalPrice, currentPrice, discountedPrice, hasOffer };
}

function Product_card({ products = [], isLoading, error, page = 1, pageSize = 14, count = 0, onPageChange, showPagination = true }) {
    const navigate = useNavigate();
    const totalPages = Math.max(1, Math.ceil(Number(count || products.length) / pageSize));

    useEffect(() => { window.scrollTo(0, 0); }, [page]);

    if (isLoading) {
        return <div className="catalog-container homepage-product-catalog"><section className="products shop-many-products">{Array.from({ length: 8 }).map((_, index) => <div className="product_card skeleton-card" key={index}><div className="product_img skeleton" /><div className="product_info"><div className="skeleton skeleton-text category-skeleton" /><div className="skeleton skeleton-text title-skeleton" /><div className="skeleton skeleton-text price-skeleton" /></div></div>)}</section></div>;
    }
    if (error) return <p className="error-state">Unable to load products. Please try again.</p>;
    if (!products.length) return <p className="empty-state">No products matched your search.</p>;

    return <div className="catalog-container homepage-product-catalog"><section className={`products ${products.length <= 3 ? "shop-few-products" : "shop-many-products"}`}>
        {products.map((product) => {
            const firstVariant = getFirstVariant(product);
            const firstUnit = getFirstUnit(firstVariant);
            const { originalPrice, currentPrice, discountedPrice, hasOffer } = getPricing(product, firstVariant);
            const image = getProductImage(product, firstVariant);
            const displayPrice = hasOffer && hasValue(discountedPrice) ? discountedPrice : currentPrice;
            const showOriginalPrice = hasOffer && hasValue(originalPrice) && hasValue(displayPrice) && String(originalPrice) !== String(displayPrice);
            const availability = getAvailability(product, firstVariant, firstUnit);
            const whatsappUrl = getProductWhatsappUrl(product, product.id);
            const openProduct = () => navigate(`/single/${product.id}`);

            return <article className="product_card" key={product.id} role="link" tabIndex={0} aria-label={`View ${product.name || "product"}`} onClick={openProduct} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openProduct(); } }}>
                <div className="product_img">
                    {hasOffer && hasValue(product.discount_percentage) && <div className="offer-badge">{product.discount_percentage}% OFF</div>}
                    <img src={image ? getImageUrl(image) : defaultImage} alt={product.name || "Product"} />
                </div>
                <div className="product_info">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-footer">
                        <div className="price-box">
                            {showOriginalPrice && <span className="old-price"><DirhamAmount value={originalPrice} fallback="Price unavailable" /></span>}
                            <span className={showOriginalPrice ? "new-price" : "price"}><DirhamAmount value={displayPrice} fallback="Price unavailable" /></span>
                        </div>
                    </div>
                    <span className={`product-availability ${availability.toLowerCase().includes("out") ? "is-unavailable" : ""}`}>{availability}</span>
                    {whatsappUrl ? <a className="whatsapp-product-btn" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>Order via WhatsApp</a> : <span className="whatsapp-product-disabled">WhatsApp enquiry unavailable</span>}
                </div>
            </article>;
        })}
    </section>
    {showPagination && totalPages > 1 && <div className="pagination-wrapper" aria-label="Product pages"><div className="numbers"><button type="button" className="page-num pagination-arrow" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>‹</button>{Array.from({ length: totalPages }, (_, index) => index + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((number) => <button type="button" key={number} className={`page-num ${page === number ? "active" : ""}`} onClick={() => onPageChange?.(number)}>{number}</button>)}<button type="button" className="page-num pagination-arrow" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>›</button></div></div>}
    </div>;
}

export default Product_card;
