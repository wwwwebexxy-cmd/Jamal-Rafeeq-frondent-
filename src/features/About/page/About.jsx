import { useNavigate } from "react-router-dom";
import '../styles/About.css';

import AboutFirstimage from "../../../assets/automotive-parts-workshop.png";
import AboutSecondimage from "../../../assets/automotive-hero-workshop.png";

const About = () => {
    const navigate = useNavigate();

    const pillars = [
        {
            title: "International Reach",
            text: "We serve importers, distributors, and market partners across the GCC, Africa, and other international markets."
        },
        {
            title: "Trusted Sourcing",
            text: "We connect customers with dependable automotive parts and brands selected for consistent quality and market needs."
        },
        {
            title: "Trade with Clarity",
            text: "From product enquiry to shipment, we keep import and export communication responsive, practical, and straightforward."
        }
    ];

    return (
        <div className="about-modern-wrapper">
            
            {/* Hero Section */}
            <section className="about-modern-hero about-fade">
                <div className="hero-text-content">
                    <span className="hero-eyebrow">JAMAL RAFEEQ · AUTO PARTS TRADING LLC</span>
                    <h1 className="hero-display">
                        The right part.<br />
                        <span className="hero-italic">The right fit. Every journey.</span>
                    </h1>
                    <p className="hero-subtext">
                        Jamal Rafeeq is an international automotive parts sourcing, import, and export business serving the GCC, Africa, and markets beyond the region.
                    </p>
                    <button className="hero-modern-btn" onClick={() => navigate('/find-products')}>
                        Explore our range <span className="arrow">→</span>
                    </button>
                </div>
                <div className="hero-image-content">
                    <div className="image-frame">
                        <img src={AboutFirstimage} alt="Automotive parts prepared for cross-border supply" />
                    </div>
                </div>
            </section>

            {/* Split Story Section */}
            <section className="about-modern-story about-fade">
                <div className="story-left">
                    <div className="story-sticky">
                        <h2>Built for markets <i>beyond borders</i>.</h2>
                        <p>
                            Our work connects reliable automotive parts with customers in Oman, Qatar, Bahrain, Saudi Arabia, other GCC markets, and Africa.
                        </p>
                        <p>
                            We manage sourcing, import, and export with a clear understanding that every market has different vehicle populations, regulations, and supply needs.
                        </p>

                        <div className="story-highlights">
                            <div className="highlight-box">
                                <span className="highlight-title">Global sourcing</span>
                                <span className="highlight-text">We help partners identify dependable parts, brands, and supply routes for the markets they serve.</span>
                            </div>
                            <div className="highlight-box">
                                <span className="highlight-title">Trade made practical</span>
                                <span className="highlight-text">Our promise is simple: clear communication, dependable products, and a smoother route from enquiry to shipment.</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="story-right">
                    <img src={AboutSecondimage} alt="Automotive parts prepared for international supply" className="story-vibe-img" />
                </div>
            </section>

            {/* Values / Pillars - Humanized Grid */}
            <section className="about-human-values about-fade">
                <div className="values-header">
                    <h2>What drives us</h2>
                    <p>Reliable parts. Useful advice. Better journeys.</p>
                </div>
                <div className="values-grid">
                    {pillars.map((pillar, index) => (
                        <div className="value-card" key={index}>
                            <h3>{pillar.title}</h3>
                            <p>{pillar.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Editorial Quote */}
            <section className="about-modern-quote about-fade">
                <blockquote>
                    "Reliable parts, trusted trade, and stronger markets across borders."
                </blockquote>
                <div className="quote-author">— Jamal Rafeeq Auto Parts Trading LLC</div>
            </section>

        </div>
    );
};

export default About;
