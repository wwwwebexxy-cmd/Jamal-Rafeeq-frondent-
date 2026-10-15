import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    SiAcura,
    SiAudi,
    SiBentley,
    SiBmw,
    SiBosch,
    SiCadillac,
    SiChevrolet,
    SiCitroen,
    SiFerrari,
    SiFord,
    SiHonda,
    SiHyundai,
    SiInfiniti,
    SiJeep,
    SiKia,
    SiLamborghini,
    SiMaserati,
    SiMazda,
    SiMini,
    SiMitsubishi,
    SiNissan,
    SiOpel,
    SiPeugeot,
    SiPorsche,
    SiRam,
    SiRenault,
    SiRollsroyce,
    SiSkoda,
    SiSubaru,
    SiSuzuki,
    SiToyota,
    SiVolkswagen,
    SiVolvo,
} from "react-icons/si";
import { TbBrandMercedes } from "react-icons/tb";
import { getImageUrl } from "../../../utils/imageUrl";

const normalizeBrandName = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const BRAND_LOGOS = {
    acura: SiAcura,
    audi: SiAudi,
    bentley: SiBentley,
    bmw: SiBmw,
    bosch: SiBosch,
    cadillac: SiCadillac,
    chevrolet: SiChevrolet,
    citroen: SiCitroen,
    ferrari: SiFerrari,
    ford: SiFord,
    honda: SiHonda,
    hyundai: SiHyundai,
    infiniti: SiInfiniti,
    jeep: SiJeep,
    kia: SiKia,
    lamborghini: SiLamborghini,
    maserati: SiMaserati,
    mazda: SiMazda,
    mercedes: TbBrandMercedes,
    mercedesbenz: TbBrandMercedes,
    mini: SiMini,
    mitsubishi: SiMitsubishi,
    nissan: SiNissan,
    opel: SiOpel,
    peugeot: SiPeugeot,
    porsche: SiPorsche,
    ram: SiRam,
    renault: SiRenault,
    rollsroyce: SiRollsroyce,
    skoda: SiSkoda,
    subaru: SiSubaru,
    suzuki: SiSuzuki,
    toyota: SiToyota,
    volkswagen: SiVolkswagen,
    volvo: SiVolvo,
};

const BRAND_WORDMARKS = {
    denso: "DENSO",
    gates: "GATES",
    kyb: "KYB",
    mahle: "MAHLE",
    mannfilter: "MANN-FILTER",
    valeo: "VALEO",
    varta: "VARTA",
};

const brandWithLogo = (brand) => {
    const name = brand.name || "Brand";
    const knownLogo = BRAND_LOGOS[normalizeBrandName(name)];

    return {
        ...brand,
        name,
        logoIcon: brand.logoIcon || knownLogo,
        wordmark: brand.wordmark || BRAND_WORDMARKS[normalizeBrandName(name)],
        markClass: brand.markClass || normalizeBrandName(name) || "generic",
    };
};

const FEATURED_BRANDS = [
    { id: "mercedes-benz", slug: "mercedes-benz", name: "Mercedes-Benz", logoIcon: TbBrandMercedes, markClass: "benz" },
    { id: "volkswagen", slug: "volkswagen", name: "Volkswagen", logoIcon: SiVolkswagen, markClass: "volkswagen" },
    { id: "toyota", slug: "toyota", name: "Toyota", logoIcon: SiToyota, markClass: "toyota" },
    { id: "bmw", slug: "bmw", name: "BMW", logoIcon: SiBmw, markClass: "bmw" },
    { id: "audi", slug: "audi", name: "Audi", logoIcon: SiAudi, markClass: "audi" },
    { id: "nissan", slug: "nissan", name: "Nissan", logoIcon: SiNissan, markClass: "nissan" },
];

function mergeBrands(brands) {
    const merged = new Map(FEATURED_BRANDS.map((brand) => [normalizeBrandName(brand.name), brandWithLogo(brand)]));

    if (Array.isArray(brands)) {
        brands
            .filter((brand) => brand?.id !== null && brand?.id !== undefined)
            .forEach((brand) => {
                const nextBrand = brandWithLogo(brand);
                const key = normalizeBrandName(nextBrand.name);
                merged.set(key, { ...merged.get(key), ...nextBrand });
            });
    }

    return [...merged.values()];
}

function BrandVisual({ brand, brandName, logoUrl }) {
    const [imageFailed, setImageFailed] = useState(false);
    const BrandLogo = brand.logoIcon;

    if (logoUrl && !imageFailed) {
        return <img src={logoUrl} alt="" onError={() => setImageFailed(true)} />;
    }

    if (BrandLogo) {
        return <BrandLogo className={`homepage-brand-carousel-logo homepage-brand-carousel-logo--${brand.markClass || "generic"}`} aria-hidden="true" />;
    }

    if (brand.wordmark) {
        return <span className={`homepage-brand-carousel-wordmark homepage-brand-carousel-wordmark--${brand.markClass || "generic"}`} aria-hidden="true">{brand.wordmark}</span>;
    }

    return <span className={`homepage-brand-carousel-mark homepage-brand-carousel-mark--${brand.markClass || "generic"}`} aria-hidden="true">{brand.mark || brandName.slice(0, 3).toUpperCase()}</span>;
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
                        // Use a canonical in-app mark/wordmark for known OEM and
                        // spare-parts brands. Uploaded backend artwork remains
                        // available for brands without a known canonical mark.
                        const logoUrl = brand.logoIcon || brand.wordmark ? null : getImageUrl(brand.logo);

                        return (
                            <button
                                type="button"
                                className="homepage-brand-carousel-item"
                                key={brandKey}
                                aria-label={`Shop ${brandName}`}
                                onClick={() => navigate(`/find-products?brand=${encodeURIComponent(brand.slug || brand.id)}`)}
                            >
                                <BrandVisual key={`${brandKey}-${logoUrl || ""}`} brand={brand} brandName={brandName} logoUrl={logoUrl} />
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
