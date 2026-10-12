import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import GetSingle_product_Query from "../queries/GetSingle_product_Query";
import { getProductWhatsappUrl } from "../../../config/business";
import { getImageUrl } from "../../../utils/imageUrl";
import defaultImage from "../../../assets/image_not_available.png";
import DirhamAmount from "../../../components/DirhamAmount";
import "../style/Single_product.css";

const toFeatures = (value) => {
    if (Array.isArray(value)) return value.map((item) => typeof item === "object" ? item.name || item.title || item.description : item).filter(Boolean);
    return String(value || "").split(/\r?\n|[•●▪◦]/).map((item) => item.replace(/^\s*[-*]\s*/, "").trim()).filter(Boolean);
};

function Single_product() {
    const { id } = useParams();
    const { data = {}, isLoading, error } = GetSingle_product_Query(id);
    const variants = Array.isArray(data.variants) ? data.variants : [];
    const [variantId, setVariantId] = useState(null);
    const selectedVariant = variants.find((item) => String(item.id) === String(variantId)) || variants[0];
    const [image, setImage] = useState(null);
    const selectedImages = selectedVariant?.images || [];
    const activeImage = image || selectedImages.find((item) => item.is_primary)?.image || selectedImages[0]?.image || data.image || data.product_image;
    const features = toFeatures(data.key_features);
    const whatsappUrl = getProductWhatsappUrl(data, id);

    if (isLoading) return <main className="single-product-page"><p className="single-product-state">Loading product details…</p></main>;
    if (error || !data?.id) return <main className="single-product-page"><p className="single-product-state" role="alert">This product is not available.</p><Link to="/find-products" className="single-product-back">Find Products</Link></main>;

    return <main className="single-product-page"><div className="single-product-breadcrumb"><Link to="/find-products">Find Products</Link><span>/</span><span>{data.name}</span></div><section className="single-product-layout">
        <div className="single-product-gallery"><div className="single-product-main-image"><img src={activeImage ? getImageUrl(activeImage) : defaultImage} alt={data.name} /></div>{selectedImages.length > 1 && <div className="single-product-thumbnails">{selectedImages.map((item) => <button type="button" key={item.id || item.image} className={activeImage === item.image ? "active" : ""} onClick={() => setImage(item.image)}><img src={getImageUrl(item.image)} alt="" /></button>)}</div>}</div>
        <div className="single-product-copy"><p className="single-product-eyebrow">Automotive product</p><h1>{data.name}</h1>{data.brand?.name && <p className="single-product-brand">Brand: {data.brand.name}</p>}<div className="single-product-price"><DirhamAmount value={data.discounted_price ?? data.starting_price} fallback="Price on enquiry" /></div><p className="single-product-description">{data.description || "Product details are available from the automotive team."}</p>{variants.length > 1 && <div className="single-product-options"><span>Variant</span><div>{variants.map((variant) => <button type="button" key={variant.id} className={String(selectedVariant?.id) === String(variant.id) ? "active" : ""} onClick={() => { setVariantId(variant.id); setImage(null); }}>{variant.color?.name || variant.sku || `Variant ${variant.id}`}</button>)}</div></div>}{whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="single-product-whatsapp">Order via WhatsApp</a> : <p className="single-product-note">WhatsApp enquiry is not configured.</p>}<p className="single-product-hint">Send a product enquiry directly to the business. No cart or checkout is required.</p></div>
    </section>{features.length > 0 && <section className="single-product-specs"><h2>Product information</h2><ul>{features.map((feature, index) => <li key={`${feature}-${index}`}>{feature}</li>)}</ul></section>}</main>;
}

export default Single_product;
