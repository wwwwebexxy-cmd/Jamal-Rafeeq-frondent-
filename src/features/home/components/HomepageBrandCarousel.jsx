import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utils/imageUrl";

function HomepageBrandCarousel({ brands = [] }) {
    const navigate = useNavigate();
    const items = Array.isArray(brands)
        ? brands.filter((brand) => brand?.id !== null && brand?.id !== undefined)
        : [];

    if (!items.length) return null;

    const movingItems = [...items, ...items];

    return (
        <div className="homepage-brand-carousel" aria-label="Moving automotive brand logos">
            <div className="homepage-brand-carousel-viewport">
                <div className="homepage-brand-carousel-track">
                    {movingItems.map((brand, index) => {
                        const brandName = brand.name || "Brand";
                        const brandKey = `${brand.id}-${index}`;

                        return (
                            <button
                                type="button"
                                className="homepage-brand-carousel-item"
                                key={brandKey}
                                aria-label={`Shop ${brandName}`}
                                onClick={() => navigate(`/find-products?brand=${encodeURIComponent(brand.slug || brand.id)}`)}
                            >
                                {getImageUrl(brand.logo) ? (
                                    <img src={getImageUrl(brand.logo)} alt="" />
                                ) : (
                                    <span className="homepage-brand-carousel-mark" aria-hidden="true">{brandName.slice(0, 3).toUpperCase()}</span>
                                )}
                                <span>{brandName}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default HomepageBrandCarousel;
