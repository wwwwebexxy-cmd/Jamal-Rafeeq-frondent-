import HomepageBrandCarousel from "./HomepageBrandCarousel";

function HomepageBrandSection({ brands, video = null }) {
    const visibleBrands = Array.isArray(brands)
        ? brands.filter((brand) => brand?.id !== null && brand?.id !== undefined)
        : [];

    return (
        <section className="brand-showcase" aria-labelledby="homepage-shop-by-brand">
            <header className="brand-showcase-header">
                <h2 id="homepage-shop-by-brand">Shop by Brand</h2>
            </header>

            <HomepageBrandCarousel brands={visibleBrands} />
            {video && <div className="brand-showcase-video" aria-label="Automotive business video">{video}</div>}
        </section>
    );
}

export default HomepageBrandSection;
