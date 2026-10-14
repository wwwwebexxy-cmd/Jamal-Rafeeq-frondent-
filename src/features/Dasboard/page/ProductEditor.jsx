import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { FiChevronDown, FiImage, FiSave, FiX } from "react-icons/fi";
import { LoadingState } from "../components/AdminPrimitives";
import { createResource, deleteResource, flattenApiErrors, getErrorMessage, getResource, listResource, updateResource } from "../services/adminApi";
import { getImageUrl } from "../../../utils/imageUrl";
import "../styles/ProductEditor.css";

const emptyProduct = {
    name: "",
    description: "",
    key_features: "",
    brand: "",
    vehicle: "",
    vehicle_year: "",
    manufacturer: "",
    offer: "",
    seller_name: "",
    shipping_fee: "0",
    estimated_delivery_time: "",
    warranty_info: "",
    current_viewers_count: "0",
    promotional_banner_image: null,
    promotional_banner_link: "",
    is_active: true,
    related_product_mode: "none",
    related_product_ids: [],
    manual_related_products: [],
};

const rows = (payload) => Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : [];
const idOf = (item) => item?.id ?? item?.pk ?? item?.uuid;
const valueOf = (item) => typeof item === "object" && item !== null ? item.id ?? item.pk : item ?? "";
const labelOf = (item) => item?.name || item?.title || item?.email || item?.code || `#${idOf(item)}`;

function toOptions(payload) {
    return rows(payload).map((item) => ({ value: idOf(item), label: labelOf(item) }));
}

export default function ProductEditor({ readOnly = false }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const editing = Boolean(id);
    const [product, setProduct] = useState(emptyProduct);
    const [variants, setVariants] = useState([]);
    const [stock, setStock] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(editing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [initialSnapshot, setInitialSnapshot] = useState(() => editing ? "" : JSON.stringify({ product: emptyProduct, stock: "", price: "", images: [] }));
    const [open, setOpen] = useState(true);

    useEffect(() => {
        let active = true;
        listResource("brands", { page_size: 500 })
            .then((response) => { if (active) setBrands(toOptions(response.data)); })
            .catch((requestError) => { if (active) setError(getErrorMessage(requestError, "Could not load vehicle brands.")); });

        if (!editing) return () => { active = false; };

        loadProduct(id)
            .then((loaded) => {
                if (!active) return;
                const loadedStock = loaded.variants[0]?.stock ?? "";
                const loadedPrice = loaded.variants[0]?.price ?? "";
                setProduct(loaded.product);
                setVariants(loaded.variants);
                setStock(String(loadedStock));
                setPrice(String(loadedPrice));
                setImages(loaded.images);
                setInitialSnapshot(JSON.stringify({ product: loaded.product, stock: String(loadedStock), price: String(loadedPrice), images: loaded.images.map(imageKey) }));
            })
            .catch((requestError) => { if (active) setError(getErrorMessage(requestError, "Could not load product.")); })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; };
    }, [editing, id]);

    const currentSnapshot = JSON.stringify({ product, stock, price, images: images.map(imageKey) });
    const hasUnsavedChanges = Boolean(initialSnapshot && initialSnapshot !== currentSnapshot);

    useEffect(() => {
        const warn = (event) => {
            if (hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [hasUnsavedChanges]);

    const leaveEditor = () => {
        if (!hasUnsavedChanges || window.confirm("You have unsaved changes. Leave without saving?")) navigate("/automotive-dashboard/products");
    };

    const updateProduct = (name, value) => setProduct((current) => ({ ...current, [name]: value }));

    const addImages = (fileList) => {
        const files = Array.from(fileList || []);
        if (!files.length) return;
        setImages((current) => [...current, ...files.map((file) => ({ file, image: "", preview: URL.createObjectURL(file) }))]);
    };

    const removeImage = (index) => setImages((current) => {
        const image = current[index];
        if (idOf(image)) setDeletedImageIds((deleted) => [...deleted, idOf(image)]);
        return current.filter((_, imageIndex) => imageIndex !== index);
    });

    const validate = () => {
        const errors = {};
        if (!String(product.name || "").trim()) errors.name = "Product is required.";
        if (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0) errors.price = "Price is required and cannot be negative.";
        if (stock === "" || !Number.isFinite(Number(stock)) || Number(stock) < 0) errors.stock = "Stock is required and cannot be negative.";
        return errors;
    };

    const save = async (event) => {
        event.preventDefault();
        if (readOnly) return;

        const validation = validate();
        if (Object.keys(validation).length) {
            setFieldErrors(validation);
            setError(Object.values(validation).join(" "));
            return;
        }
        if (!window.confirm(editing ? "Save changes to this product?" : "Create this product?")) return;

        setSaving(true);
        setError("");
        setFieldErrors({});
        try {
            const productPayload = makeProductPayload(product);
            const productResponse = editing
                ? await updateResource("products", id, productPayload)
                : await createResource("products", productPayload);
            const productId = id || idOf(productResponse.data);
            if (!productId) throw new Error("The product response did not contain an id.");

            const currentVariant = variants[0];
            let savedVariantId = idOf(currentVariant);
            if (currentVariant) {
                await updateResource("product-variants", idOf(currentVariant), { price: Number(price), stock: Number(stock) });
            } else {
                const variantResponse = await createResource("product-variants", { product: productId, color: null, price_type: "single", price: Number(price), stock: Number(stock) });
                savedVariantId = idOf(variantResponse.data);
            }
            if (savedVariantId) await saveImages(savedVariantId, images, deletedImageIds);

            toast.success(editing ? "Product updated successfully" : "Product created successfully");
            navigate(`/automotive-dashboard/products/${productId}`, { replace: true });
        } catch (requestError) {
            const backendErrors = flattenApiErrors(requestError?.response?.data);
            setFieldErrors(backendErrors);
            setError(getErrorMessage(requestError, "Could not save product."));
            toast.error(getErrorMessage(requestError, "Could not save product."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-page"><LoadingState label="Loading product editor..." /></div>;

    return <div className="admin-page product-editor-page">
        <button className="admin-back-link" onClick={leaveEditor}>Back to Products</button>
        <div className="admin-page-header">
            <div>
                <p className="admin-eyebrow">PRODUCT MANAGEMENT</p>
                <h2>{editing ? "Edit Product" : "Create Product"}</h2>
                <p>Enter the vehicle and stock details for this product.</p>
            </div>
            <button className="admin-button primary" onClick={save} disabled={saving}><FiSave /> {saving ? "Saving..." : "Save Product"}</button>
        </div>
        {error && <div className="admin-form-error product-editor-error">{error}</div>}
        <form onSubmit={save}>
            <section className="product-editor-section">
                <button type="button" className="product-section-heading" onClick={() => setOpen((current) => !current)}>
                    <strong>Product Details</strong>
                    <FiChevronDown className={open ? "section-open" : ""} />
                </button>
                {open && <div className="product-section-content"><div className="product-form-grid">
                    <SelectField label="Vehicle Brand" value={product.brand} options={brands} emptyLabel="Select vehicle brand" onChange={(value) => updateProduct("brand", value)} />
                    <TextField label="Vehicle" value={product.vehicle} onChange={(value) => updateProduct("vehicle", value)} />
                    <NumberField label="Manufacturing years" min="1900" max="2100" step="1" value={product.vehicle_year} onChange={(value) => updateProduct("vehicle_year", value)} />
                    <NumberField label="Stock" min="0" step="1" value={stock} onChange={setStock} error={fieldErrors.stock} />
                    <TextField label="Product" required value={product.name} onChange={(value) => updateProduct("name", value)} error={fieldErrors.name} />
                    <NumberField label="Price" min="0" step="0.01" value={price} onChange={setPrice} error={fieldErrors.price} />
                </div></div>}
            </section>
            <section className="product-editor-section product-images-section">
                <div className="product-section-heading product-section-heading-static"><strong>Product Images</strong><label className="admin-button secondary product-image-upload"><FiImage /> Add Images<input hidden type="file" accept="image/*" multiple onChange={(event) => { addImages(event.target.files); event.target.value = ""; }} /></label></div>
                <div className="product-section-content">
                    <p className="field-hint">Add as many product images as you need.</p>
                    {images.length > 0 && <div className="product-image-grid">{images.map((image, index) => <div className="product-image-item" key={idOf(image) || image.preview || `${image.image}-${index}`}><img src={image.preview || getImageUrl(image.image)} alt={`Product image ${index + 1}`} /><button type="button" className="product-image-remove" onClick={() => removeImage(index)} aria-label={`Remove product image ${index + 1}`}><FiX /></button></div>)}</div>}
                </div>
            </section>
            <div className="product-editor-footer">
                <button type="button" className="admin-button secondary" onClick={leaveEditor}>Cancel</button>
                <button className="admin-button primary" disabled={saving}><FiSave /> {saving ? "Saving..." : "Save Product"}</button>
            </div>
        </form>
    </div>;
}

async function loadProduct(id) {
    const [productResponse, variantResponse] = await Promise.all([
        getResource("products", id),
        listResource("product-variants", { product: id, page_size: 500 }),
    ]);
    const variants = rows(variantResponse.data).map((variant) => ({
        ...variant,
        product: valueOf(variant.product) || id,
        stock: variant.stock ?? "",
    }));
    const imageResponse = variants[0]
        ? await listResource("product-images", { variant: idOf(variants[0]), page_size: 500 }).catch(() => ({ data: [] }))
        : { data: [] };
    const images = rows(imageResponse.data).sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)).map((image) => ({
        ...image,
        file: null,
        preview: getImageUrl(image.image),
    }));
    return { product: normalizeProduct(productResponse.data), variants, images };
}

function normalizeProduct(data = {}) {
    const productData = { ...data };
    delete productData.category;
    delete productData.subcategory;
    delete productData.emi_available;
    delete productData.emi_starting_price;
    return {
        ...emptyProduct,
        ...productData,
        brand: valueOf(data.brand),
        offer: valueOf(data.offer),
        vehicle_year: data.vehicle_year ?? "",
    };
}

function makeProductPayload(product) {
    const values = {
        ...product,
        name: String(product.name || "").trim(),
        // The database requires a description, but it is intentionally not
        // exposed in the compact form.
        description: String(product.description || product.name || "Automotive product").trim(),
        brand: product.brand || null,
        vehicle_year: product.vehicle_year === "" ? null : Number(product.vehicle_year),
        offer: product.offer || null,
        shipping_fee: product.shipping_fee === "" ? 0 : Number(product.shipping_fee),
        current_viewers_count: product.current_viewers_count === "" ? 0 : Number(product.current_viewers_count),
    };
    delete values.category;
    delete values.subcategory;
    delete values.product_type;
    delete values.has_variants;
    delete values.variants;
    delete values.units;
    delete values.images;
    delete values.regions;
    delete values.emi_available;
    delete values.emi_starting_price;
    delete values.manual_related_products;
    delete values.promotional_banner_image;
    return values;
}

function imageKey(image) {
    return idOf(image) || image.image || image.file?.name || image.preview || "";
}

async function saveImages(variantId, images, deletedImageIds) {
    for (const imageId of deletedImageIds) await deleteResource("product-images", imageId);
    const primaryIndex = images.findIndex((image) => image.is_primary);
    for (let position = 0; position < images.length; position += 1) {
        const image = images[position];
        const isPrimary = primaryIndex >= 0 ? position === primaryIndex : position === 0;
        if (image.file) {
            const form = new FormData();
            form.append("variant", String(variantId));
            form.append("image", image.file);
            form.append("position", String(position));
            form.append("is_primary", String(isPrimary));
            await createResource("product-images", form);
        } else if (idOf(image)) {
            await updateResource("product-images", idOf(image), { position, is_primary: isPrimary });
        }
    }
}

function TextField({ label, value, onChange, error, required }) {
    return <label className={`product-field ${error ? "has-error" : ""}`}><span>{label}{required && " *"}</span><input value={value || ""} onChange={(event) => onChange(event.target.value)} />{error && <small>{error}</small>}</label>;
}

function NumberField({ label, value, onChange, min, max, step = "0.01", error }) {
    return <label className={`product-field ${error ? "has-error" : ""}`}><span>{label}</span><input type="number" min={min} max={max} step={step} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />{error && <small>{error}</small>}</label>;
}

function SelectField({ label, value, options, onChange, error, required, emptyLabel = "Select" }) {
    return <label className={`product-field ${error ? "has-error" : ""}`}><span>{label}{required && " *"}</span><select value={value || ""} onChange={(event) => onChange(event.target.value)}><option value="">{emptyLabel}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{error && <small>{error}</small>}</label>;
}
