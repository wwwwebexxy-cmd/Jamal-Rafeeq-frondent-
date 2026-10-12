import HomepageBrandCarousel from "./HomepageBrandCarousel";

function HomepageBrandSection({ brands, video = null }) {
    const visibleBrands = Array.isArray(brands)
        ? brands.filter((brand) => brand?.id !== null && brand?.id !== undefined)
        : [];

    return (
        <section className="brand-showcase" aria-labelledby="homepage-shop-by-brand">
            <header className="brand-showcase-header">
                <div>
                    <p className="brand-showcase-eyebrow">DISCOVER YOUR NEXT FAVOURITE</p>
                    <h2 id="homepage-shop-by-brand">Shop by Brand</h2>
                    <p className="brand-showcase-copy">Move through the automotive brands we keep close to the road.</p>
                </div>
            </header>

            <HomepageBrandCarousel brands={visibleBrands} />
            {!visibleBrands.length && <p className="brand-showcase-empty-note">Brand logos will appear here as the live catalogue grows.</p>}
            {video && <div className="brand-showcase-video" aria-label="Automotive business video">{video}</div>}
        </section>
    );
}

export default HomepageBrandSection;
