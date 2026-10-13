import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

import client from "../../../lib/ApiClient";
import Product_card from "../components/Product_card";
import Product_Query from "../queries/Product_Query";
import "../styles/Sale_page.css";

const asArray = (value) => Array.isArray(value) ? value : Array.isArray(value?.results) ? value.results : [];

function Sale({ newArrivalsOnly = false }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilter, setShowFilter] = useState(false);
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("page_size") || 14);
    const product = searchParams.get("product") || searchParams.get("search") || "";
    const brand = searchParams.get("brand") || "";
    const vehicle = searchParams.get("vehicle") || "";
    const vehicleYear = searchParams.get("vehicle_year") || "";
    const sort = newArrivalsOnly ? "new" : searchParams.get("sort") || "";

    const filters = useMemo(() => ({
        ...(product.trim() ? { search: product.trim() } : {}),
        ...(brand ? { brand } : {}),
        ...(vehicle ? { vehicle } : {}),
        ...(vehicleYear ? { vehicle_year: vehicleYear } : {}),
        ...(sort ? { sort } : {}),
        page,
        page_size: pageSize,
    }), [brand, page, pageSize, product, sort, vehicle, vehicleYear]);

    const { data, isLoading, error } = Product_Query(filters);
    const products = data?.results || [];
    const { data: brands = [] } = useQuery({ queryKey: ["find-products-brands"], queryFn: async () => (await client.get("brands/")).data, staleTime: 300_000 });
    const { data: catalogFilters = {} } = useQuery({ queryKey: ["find-products-filter-options"], queryFn: async () => (await client.get("catalog-filter-options/")).data, staleTime: 300_000 });
    const vehicleOptions = asArray(catalogFilters.vehicles);
    const vehicleYearOptions = asArray(catalogFilters.vehicle_years);

    const updateFilter = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value); else next.delete(key);
        next.delete("page");
        if (key === "product") {
            next.delete("search");
        }
        setSearchParams(next);
    };

    const clearFilters = () => setSearchParams({});

    return <main className="salePage-main find-products-page">
        <header className="page_header">
            <div className="page_head"><p className="find-products-eyebrow">{newArrivalsOnly ? "LATEST PRODUCTS" : "AUTOMOTIVE CATALOGUE"}</p><h1 className="page_title">{newArrivalsOnly ? "New Arrivals" : "Find Products"}</h1><p className="title_description">{newArrivalsOnly ? "Browse the newest products added to the Jamal Rafeeq catalogue." : "Search cars, spare parts, services, and automotive products by product, brand, vehicle, or model year."}</p></div>
            <button type="button" className="product_count mobile-filter-toggle" onClick={() => setShowFilter((value) => !value)} aria-expanded={showFilter}>{showFilter ? "Close filters" : "Filters"}</button>
        </header>
        <nav className="find-products-shortcuts" aria-label="Find products shortcuts">
            <Link to="/find-products">All products</Link>
            <Link to="/new-arrivals">New products</Link>
            <Link to="/find-products?search=spare">Spare parts</Link>
            <Link to="/find-products?search=car">Cars</Link>
            <Link to="/contact?topic=car-sales">Car sales</Link>
            <Link to="/contact">Services &amp; support</Link>
        </nav>
        <div className="find-products-layout">
            <aside className={`find-products-sidebar ${showFilter ? "is-open" : ""}`} aria-label="Product filters">
                <div className="find-products-sidebar-heading"><h2>Filter products</h2><button type="button" onClick={clearFilters}>Clear all</button></div>
                <label className="find-products-filter"><span>Brand</span><select value={brand} onChange={(event) => updateFilter("brand", event.target.value)}><option value="">All brands</option>{asArray(brands).map((item) => <option key={item.id ?? item.slug ?? item.name} value={item.id ?? item.slug}>{item.name}</option>)}</select></label>
                <label className="find-products-filter"><span>Vehicle</span><select value={vehicle} onChange={(event) => updateFilter("vehicle", event.target.value)}><option value="">All vehicles</option>{vehicleOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                <label className="find-products-filter"><span>Manufacturing years</span><select value={vehicleYear} onChange={(event) => updateFilter("vehicle_year", event.target.value)}><option value="">All years</option>{vehicleYearOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                <label className="find-products-filter"><span>Product</span><input value={product} onChange={(event) => updateFilter("product", event.target.value)} placeholder="Search products" /></label>
            </aside>
            <section className="find-products-results" aria-live="polite">
                <div className="find-products-toolbar"><strong>{data?.count ?? products.length} products</strong><div className="find-products-toolbar-actions"><label className="find-products-inline-search"><span>Search</span><input value={product} onChange={(event) => updateFilter("product", event.target.value)} placeholder="Search products" /></label>{newArrivalsOnly ? <span className="find-products-sort-note">Newest first</span> : <label>Sort<select value={sort} onChange={(event) => updateFilter("sort", event.target.value)}><option value="">Newest</option><option value="price_low">Price: low to high</option><option value="price_high">Price: high to low</option><option value="new">Newest</option></select></label>}</div></div>
                <Product_card products={products} isLoading={isLoading} error={error} page={page} pageSize={pageSize} count={data?.count} onPageChange={(nextPage) => { const next = new URLSearchParams(searchParams); next.set("page", String(nextPage)); setSearchParams(next); }} />
            </section>
        </div>
    </main>;
}

export default Sale;
