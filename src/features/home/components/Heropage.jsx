import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Heropage.css";
import { getImageUrl } from "../../../utils/imageUrl";
import Hero_Query from "../queries/Hero_Query";
import defaultHeroImage from "../../../assets/automotive-hero-workshop.png";

const DEFAULT_HERO_SLIDE = {
  id: "default-tech-hero",
  subtitle: "International automotive parts trade",
  title: "Source globally. Supply confidently.",
  description: "We source, import, and export dependable automotive parts for partners across the GCC, Africa, and international markets.",
  button_text: "Find products",
  image: defaultHeroImage,
};

const getHeroImageUrl = (image) => image === defaultHeroImage ? image : getImageUrl(image);

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const hasUsableCopy = (value) => {
  const normalized = String(value || "").trim();
  return normalized && normalized !== "." && normalized !== "-";
};

const copyValue = (value) => String(value ?? "").trim();

const normalizeHeroSlide = (slide) => ({
  ...slide,
  subtitle: copyValue(slide?.subtitle),
  title: copyValue(slide?.title || slide?.heading),
  description: copyValue(slide?.description || slide?.text),
  button_text: copyValue(slide?.button_text),
});

const Heropage = ({ heroBanners }) => {
  const providedHeroBanners = asArray(heroBanners);
  const hasHeroBanners = providedHeroBanners.length > 0;
  const { data: rawHeroBanners } = Hero_Query({ enabled: !hasHeroBanners });
  const queriedHeroBanners = asArray(rawHeroBanners);
  const sourceHeroBanners = hasHeroBanners ? providedHeroBanners : queriedHeroBanners;
  const heroSlides = sourceHeroBanners.length > 0
    ? sourceHeroBanners.map(normalizeHeroSlide)
    : [DEFAULT_HERO_SLIDE];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = Math.min(currentSlide, heroSlides.length - 1);

  useEffect(() => {
    if (heroSlides.length < 2 || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setCurrentSlide((slideIndex) => (slideIndex + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [heroSlides.length, isPaused]);

  const nextSlide = () => setCurrentSlide((slideIndex) => (slideIndex + 1) % heroSlides.length);
  const previousSlide = () => setCurrentSlide((slideIndex) => (slideIndex - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="hero-page-wrapper">
      <section className="hero-split-layout single">
        <div
          className="hero-carousel-section"
          aria-roledescription="carousel"
          aria-label="Featured automotive banners"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
          }}
        >
          {heroSlides.map((heroSlide, index) => (
            <div
              key={heroSlide.id || `hero-slide-${index}`}
              className={`hero-slide ${activeSlide === index ? "active" : ""}`}
              aria-hidden={activeSlide !== index}
            >
              <img src={getHeroImageUrl(heroSlide.image || heroSlide.banner_image || heroSlide.image_url)} alt={heroSlide.title || heroSlide.heading || "Featured collection"} className="hero-image" />
              <div className="hero-overlay"></div>
              <div className="hero-content">
                {hasUsableCopy(heroSlide.subtitle || heroSlide.eyebrow) && <span className="hero-subtitle">{heroSlide.subtitle || heroSlide.eyebrow}</span>}
                {hasUsableCopy(heroSlide.title || heroSlide.heading) && <h1>{heroSlide.title || heroSlide.heading}</h1>}
                {hasUsableCopy(heroSlide.description || heroSlide.text) && <p>{heroSlide.description || heroSlide.text}</p>}
                {hasUsableCopy(heroSlide.button_text) && <Link to="/find-products" className="shop-btn-premium">{heroSlide.button_text} <span className="arrow">→</span></Link>}
              </div>
            </div>
          ))}

          {heroSlides.length > 1 && <>
            <button type="button" className="carousel-nav-btn prev-btn" onClick={previousSlide} aria-label="Previous hero slide">‹</button>
            <button type="button" className="carousel-nav-btn next-btn" onClick={nextSlide} aria-label="Next hero slide">›</button>
            <div className="hero-dots" aria-label="Choose hero slide">
              {heroSlides.map((heroSlide, index) => (
                <button
                  type="button"
                  key={heroSlide.id || `hero-dot-${index}`}
                  className={`modern-dot ${activeSlide === index ? "active-modern-dot" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={activeSlide === index ? "true" : undefined}
                />
              ))}
            </div>
          </>}
        </div>
      </section>
    </div>
  );
};

export default Heropage;
