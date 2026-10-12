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
import vedio1 from "../../assets/eehook-video-one.mp4";
import vedio2 from "../../assets/eehook-video-two.mp4";
import videoOnePoster from "../../assets/automotive-hero-workshop.png";
import videoTwoPoster from "../../assets/dubai-our-promise-bg.png";
import automotiveWorkshopPoster from "../../assets/automotive-parts-workshop.png";

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

function DeferredHeritageVideo({ source, poster, label }) {
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

    return <video ref={videoRef} className="heritage-video" autoPlay muted loop playsInline preload="metadata" poster={poster} aria-label={label}>
        {shouldLoad && <source src={source} type="video/mp4" />}
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
    const hasHomepageNewArrivals = Array.isArray(homepageData.new_arrivals)
        || Array.isArray(homepageData.new_arrivals?.results)
        || Array.isArray(homepageData.new_arrivals?.items);
    const newArrivals = hasHomepageNewArrivals ? asArray(homepageData.new_arrivals) : undefined;
    const topDeals = homepageData.top_deals;
    const bestSellers = homepageData.best_sellers;
    const shopByBrand = homepageBrands.length ? homepageBrands : brandsFromProducts(brandProducts);
    return (
        <main className="homepage-discovery">
            <Heropage heroBanners={heroBanners} />

            <New_Arrival_Home products={newArrivals} totalCount={homepageData.new_arrivals?.count} showNewBadge tone="new" />
            <Offer_poster />
            <HomepageProductSection title="Top deals" eyebrow="Best value" section={topDeals} tone="deals" />
            <HomepageProductSection title="Best sellers" eyebrow="Customer favourites" section={bestSellers} tone="bestsellers" />

            <HomepageBrandSection
                brands={shopByBrand}
                video={<DeferredHeritageVideo source={vedio1} poster={automotiveWorkshopPoster} label="Jamal Rafeeq automotive parts showcase" />}
            />

            <HomepageTrustBenefits benefits={asArray(homepageData.trust_benefits)} />

            <section className="section-heritage">
                <div className="section-heritage-text">
                    <span className="heritage-tag">OUR PROMISE</span>
                    <h2>Our promise is confidence on every road.</h2>
                    <p>Jamal Rafeeq Auto Parts Trading LLC helps drivers and workshops in Dubai find dependable parts selected for quality, fit, and everyday performance.</p>
                    <p>From the first search to the final fit, our team is here with practical guidance, reliable supply, and support you can reach when you need it.</p>
                </div>

                <div className="section-heritage-gallery">
                    <DeferredHeritageVideo source={vedio1} poster={videoOnePoster} label="Jamal Rafeeq automotive parts showcase" />
                    <DeferredHeritageVideo source={vedio2} poster={videoTwoPoster} label="Lifestyle collection preview" />
                </div>
            </section>

            <ContactUs />
        </main>
    );
}

export default Home;
