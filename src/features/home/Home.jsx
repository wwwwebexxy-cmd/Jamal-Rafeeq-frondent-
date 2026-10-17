import { useEffect, useRef, useState } from "react";
import "./Home.css";
import Heropage from "./components/Heropage";
import New_Arrival_Home from "./components/New_Arrival_Home";
import HomepageProductSection from "./components/HomepageProductSection";
import HomepageBrandSection from "./components/HomepageBrandSection";
import HomepageTrustBenefits from "./components/HomepageTrustBenefits";
import Homepage_Query from "./queries/Homepage_Query";
import Product_Query from "../sale/queries/Product_Query";
import Offer_poster from "../../hooks/offers/page/Offer_poster";
import ContactUs from "../../components/Contact";
import sparePartsEngineVideo from "../../assets/homepage-spare-parts-engine.mp4";
import sparePartsInventoryVideo from "../../assets/homepage-spare-parts-inventory.mp4";
import sparePartsShippingVideo from "../../assets/homepage-spare-parts-shipping.mp4";
import videoOnePoster from "../../assets/automotive-hero-workshop.png";
import videoTwoPoster from "../../assets/dubai-our-promise-bg.png";
import automotiveWorkshopPoster from "../../assets/automotive-parts-workshop.png";
import { getVideoMimeType } from "./homepageMedia";

const asArray = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.results)) return value.results;
    if (Array.isArray(value?.items)) return value.items;
    return [];
};

const brandsFromProducts = (products) => {
    const brands = new Map();

    asArray(products).forEach((product) => {
        const brand = product?.brand;
        const id = brand?.id ?? brand?.pk;
        if (id === null || id === undefined) return;

        const current = brands.get(String(id));
        brands.set(String(id), {
            ...brand,
            id,
            product_count: (current?.product_count || 0) + 1,
        });
    });

    return [...brands.values()];
};

function HomeLoading() {
    return (
        <main className="homepage-discovery homepage-loading" aria-busy="true" aria-label="Loading homepage">
            <div className="homepage-loading-hero skeleton" />
            <div className="homepage-loading-section">
                <div className="skeleton skeleton-text" />
                <div className="homepage-loading-grid">{Array.from({ length: 8 }).map((_, index) => <div className="homepage-loading-card skeleton" key={index} />)}</div>
            </div>
        </main>
    );
}

function DeferredHeritageVideo({ source, fallbackSource, poster, label }) {
    const videoRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !("IntersectionObserver" in window)) {
            setShouldLoad(true);
            return undefined;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            setShouldLoad(true);
            observer.disconnect();
        }, { rootMargin: "240px 0px" });

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!shouldLoad) return;
        videoRef.current?.play?.().catch(() => {
            // Playback is optional; the poster remains useful if a browser blocks it.
        });
    }, [shouldLoad]);

    return <video key={`${source}|${fallbackSource || ""}`} ref={videoRef} className="heritage-video" autoPlay muted loop playsInline preload="metadata" poster={poster} aria-label={label}>
        {shouldLoad && <>
            <source src={source} type={getVideoMimeType(source)} />
            {fallbackSource && fallbackSource !== source && <source src={fallbackSource} type={getVideoMimeType(fallbackSource)} />}
        </>}
    </video>;
}

function Home() {
    const { data: homepageData = {}, isLoading, isError, error, refetch } = Homepage_Query();
    const homepageBrands = asArray(homepageData.shop_by_brand);
    const { data: brandProducts } = Product_Query(
        { page_size: 100 },
        { enabled: !isLoading && !isError && homepageBrands.length === 0 }
    );
    if (isLoading) return <HomeLoading />;

    if (isError) {
        return (
            <main className="homepage-discovery homepage-state" role="alert">
                <h1>We couldn&apos;t load the home page</h1>
                <p>{error?.response?.data?.detail || "Please try again in a moment."}</p>
                <button type="button" onClick={() => refetch()}>Try again</button>
            </main>
        );
    }

    const heroBanners = asArray(homepageData.hero_banners);
    const homepageNewArrivals = asArray(homepageData.new_arrivals);
    // An empty embedded list should still allow New_Arrival_Home to use the
    // dedicated new-arrivals endpoint, so the home section does not disappear
    // when the homepage payload has no arrivals yet.
    const newArrivals = homepageNewArrivals.length ? homepageNewArrivals : undefined;
    const topDeals = homepageData.top_deals;
    const bestSellers = homepageData.best_sellers;
    const shopByBrand = homepageBrands.length ? homepageBrands : brandsFromProducts(brandProducts);
    const brandShowcaseSource = sparePartsEngineVideo;
    const globalReachPortraitSource = sparePartsInventoryVideo;
    const globalReachLandscapeSource = sparePartsShippingVideo;
    return (
        <main className="homepage-discovery">
            <Heropage heroBanners={heroBanners} />

            <New_Arrival_Home
                products={newArrivals}
                totalCount={newArrivals ? homepageData.new_arrivals?.count : undefined}
                showNewBadge
                tone="new"
            />
            <Offer_poster />
            <HomepageProductSection title="Top deals" eyebrow="Best value" section={topDeals} tone="deals" />
            <HomepageProductSection title="Best sellers" eyebrow="Customer favourites" section={bestSellers} tone="bestsellers" />

            <HomepageBrandSection
                brands={shopByBrand}
                video={<DeferredHeritageVideo source={brandShowcaseSource} fallbackSource={sparePartsEngineVideo} poster={automotiveWorkshopPoster} label="Jamal Rafeeq automotive spare parts showcase" />}
            />

            <HomepageTrustBenefits benefits={asArray(homepageData.trust_benefits)} />

            <section className="section-heritage">
                <div className="section-heritage-text">
                    <span className="heritage-tag">OUR GLOBAL REACH</span>
                    <h2>Automotive parts, moving across borders.</h2>
                    <p>Jamal Rafeeq Auto Parts Trading LLC sources, imports, and exports dependable automotive parts for customers across the GCC, Africa, and international markets.</p>
                    <p>From Oman, Qatar, Bahrain, and Saudi Arabia to partners across Africa and beyond, we make sourcing and cross-border supply clear, practical, and dependable.</p>
                </div>

                <div className="section-heritage-gallery">
                    <DeferredHeritageVideo source={globalReachPortraitSource} fallbackSource={sparePartsInventoryVideo} poster={videoOnePoster} label="Jamal Rafeeq spare parts inventory" />
                    <DeferredHeritageVideo source={globalReachLandscapeSource} fallbackSource={sparePartsShippingVideo} poster={videoTwoPoster} label="Jamal Rafeeq spare parts shipping" />
                </div>
            </section>

            <ContactUs />
        </main>
    );
}

export default Home;
