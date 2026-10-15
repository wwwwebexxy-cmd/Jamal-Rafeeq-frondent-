import { useNavigate } from "react-router-dom";
import { SiAudi, SiBmw, SiNissan, SiToyota, SiVolkswagen } from "react-icons/si";
import { TbBrandMercedes } from "react-icons/tb";
import { getImageUrl } from "../../../utils/imageUrl";

const FEATURED_BRANDS = [
    { id: "mercedes-benz", slug: "mercedes-benz", name: "Mercedes-Benz", logoIcon: TbBrandMercedes, markClass: "benz" },
    { id: "volkswagen", slug: "volkswagen", name: "Volkswagen", logoIcon: SiVolkswagen, markClass: "volkswagen" },
    { id: "toyota", slug: "toyota", name: "Toyota", logoIcon: SiToyota, markClass: "toyota" },
    { id: "bmw", slug: "bmw", name: "BMW", logoIcon: SiBmw, markClass: "bmw" },
    { id: "audi", slug: "audi", name: "Audi", logoIcon: SiAudi, markClass: "audi" },
    { id: "nissan", slug: "nissan", name: "Nissan", logoIcon: SiNissan, markClass: "nissan" },
];

function mergeBrands(brands) {
    const merged = new Map(FEATURED_BRANDS.map((brand) => [brand.name.toLowerCase(), brand]));

    if (Array.isArray(brands)) {
        brands
            .filter((brand) => brand?.id !== null && brand?.id !== undefined)
            .forEach((brand) => {
                const name = brand.name || "Brand";
                const key = name.toLowerCase();
                merged.set(key, { ...merged.get(key), ...brand, name });
            });
    }

    return [...merged.values()];
}

function HomepageBrandCarousel({ brands = [] }) {
    const navigate = useNavigate();
    const items = mergeBrands(brands);

    const movingItems = [...items, ...items];

    return (
        <div className="homepage-brand-carousel" aria-label="Moving automotive brand logos">
            <div className="homepage-brand-carousel-viewport">
                <div className="homepage-brand-carousel-track">
                    {movingItems.map((brand, index) => {
                        const brandName = brand.name || "Brand";
                        const brandKey = `${brand.id}-${index}`;
                        const logoUrl = getImageUrl(brand.logo);
                        const BrandLogo = brand.logoIcon;

                        return (
                            <button
                                type="button"
                                className="homepage-brand-carousel-item"
                                key={brandKey}
                                aria-label={`Shop ${brandName}`}
                                onClick={() => navigate(`/find-products?brand=${encodeURIComponent(brand.slug || brand.id)}`)}
                            >
                                {logoUrl ? (
                                    <img src={logoUrl} alt="" />
                                ) : BrandLogo ? (
                                    <BrandLogo className={`homepage-brand-carousel-logo homepage-brand-carousel-logo--${brand.markClass || "generic"}`} aria-hidden="true" />
                                ) : (
                                    <span className={`homepage-brand-carousel-mark homepage-brand-carousel-mark--${brand.markClass || "generic"}`} aria-hidden="true">{brand.mark || brandName.slice(0, 3).toUpperCase()}</span>
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
