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
    const fitments = Array.isArray(data.fitments) ? data.fitments : [];
    const whatsappUrl = getProductWhatsappUrl(data, id);
    const stock = Number(selectedVariant?.stock ?? 0);
    const availability = stock > 0 ? "In stock" : "Available on request";
    const productMeta = [
        data.brand?.name && { label: "Brand", value: data.brand.name },
        data.vehicle && { label: "Vehicle", value: data.vehicle },
        data.vehicle_year && { label: "Manufacturing year", value: data.vehicle_year },
        selectedVariant?.stock !== undefined && { label: "Availability", value: availability },
    ].filter(Boolean);

    if (isLoading) return <main className="single-product-page"><p className="single-product-state">Loading product details…</p></main>;
    if (error || !data?.id) return <main className="single-product-page"><p className="single-product-state" role="alert">This product is not available.</p><Link to="/find-products" className="single-product-back">Find Products</Link></main>;

    return <main className="single-product-page"><div className="single-product-breadcrumb"><Link to="/find-products">Find Products</Link><span>/</span><span>Product details</span><span>/</span><strong>{data.name}</strong></div><section className="single-product-layout">
        <div className="single-product-gallery"><div className="single-product-main-image"><span className="single-product-image-label">Jamal Rafeeq catalogue</span><img src={activeImage ? getImageUrl(activeImage) : defaultImage} alt={data.name} /></div>{selectedImages.length > 1 && <div className="single-product-thumbnails" aria-label="Product images">{selectedImages.map((item, index) => <button type="button" key={item.id || item.image} className={activeImage === item.image ? "active" : ""} onClick={() => setImage(item.image)} aria-label={`View product image ${index + 1}`}><img src={getImageUrl(item.image)} alt="" /></button>)}</div>}</div>
        <div className="single-product-copy"><div className="single-product-copy-panel"><p className="single-product-eyebrow">Automotive product</p><div className="single-product-title-row"><h1>{data.name}</h1><span className={`single-product-availability ${stock > 0 ? "is-available" : ""}`}>{availability}</span></div>{data.brand?.name && <p className="single-product-brand">{data.brand.name}</p>}<div className="single-product-price"><DirhamAmount value={data.discounted_price ?? data.starting_price} fallback="Price on enquiry" /></div>{productMeta.length > 0 && <div className="single-product-meta-grid">{productMeta.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>}<p className="single-product-description">{data.description || "Product details are available from the automotive team."}</p>{variants.length > 1 && <div className="single-product-options"><span>Variant</span><div>{variants.map((variant) => <button type="button" key={variant.id} className={String(selectedVariant?.id) === String(variant.id) ? "active" : ""} onClick={() => { setVariantId(variant.id); setImage(null); }}>{variant.color?.name || variant.sku || `Variant ${variant.id}`}</button>)}</div></div>}{whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="single-product-whatsapp">Enquire on WhatsApp</a> : <p className="single-product-note">WhatsApp enquiry is not configured.</p>}<p className="single-product-hint">Send a product enquiry directly to the business. No cart or checkout is required.</p></div></div>
    </section>{fitments.length > 0 && <section className="single-product-fitments"><div><p className="single-product-eyebrow">Vehicle compatibility</p><h2>Fits these vehicles</h2><p>Check the model and manufacturing years before ordering.</p></div><div className="single-product-fitment-list">{fitments.map((fitment, index) => <div key={fitment.id || index}><strong>{[fitment.vehicle_make, fitment.vehicle_model].filter(Boolean).join(" ")}</strong><span>{fitment.year_from}–{fitment.year_to}</span></div>)}</div></section>}{features.length > 0 && <section className="single-product-specs"><div><p className="single-product-eyebrow">Product overview</p><h2>Key features</h2></div><ul>{features.map((feature, index) => <li key={`${feature}-${index}`}>{feature}</li>)}</ul></section>}</main>;
}

export default Single_product;
