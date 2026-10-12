import { useNavigate } from "react-router-dom";
import '../styles/About.css';

import AboutFirstimage from "../../../assets/automotive-parts-workshop.png";
import AboutSecondimage from "../../../assets/dubai-our-promise-bg.png";

const About = () => {
    const navigate = useNavigate();

    const pillars = [
        {
            title: "Fitment First",
            text: "We focus on the parts that match the vehicle, the application, and the road ahead. Clear guidance matters as much as the product itself."
        },
        {
            title: "Dependable Supply",
            text: "Our range is built around dependable brands and practical availability, helping drivers and workshops spend less time waiting."
        },
        {
            title: "Local, Human Support",
            text: "From a quick compatibility question to a larger workshop requirement, our team is close by and ready to help."
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
                        We help drivers, workshops, and businesses across Dubai find dependable automotive parts with practical guidance and service that keeps moving.
                    </p>
                    <button className="hero-modern-btn" onClick={() => navigate('/shop')}>
                        Explore auto parts <span className="arrow">→</span>
                    </button>
                </div>
                <div className="hero-image-content">
                    <div className="image-frame">
                        <img src={AboutFirstimage} alt="Organized automotive parts showroom in Dubai" />
                    </div>
                </div>
            </section>

            {/* Split Story Section */}
            <section className="about-modern-story about-fade">
                <div className="story-left">
                    <div className="story-sticky">
                        <h2>Built around the way <i>Dubai moves</i>.</h2>
                        <p>
                            Dubai roads demand parts that can handle heat, traffic, and long working days. Jamal Rafeeq was built to make finding those parts clearer, quicker, and more dependable.
                        </p>
                        <p>
                            We bring together trusted automotive brands, useful product information, and a responsive team so every enquiry starts with confidence.
                        </p>

                        <div className="story-highlights">
                            <div className="highlight-box">
                                <span className="highlight-title">Clearer choices</span>
                                <span className="highlight-text">Search the range with a real team behind it, ready to help you narrow down the right option.</span>
                            </div>
                            <div className="highlight-box">
                                <span className="highlight-title">Ready for the road</span>
                                <span className="highlight-text">Our promise is simple: dependable products, honest support, and a smoother route from enquiry to fitment.</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="story-right">
                    <img src={AboutSecondimage} alt="Dubai skyline and road at sunset" className="story-vibe-img" />
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
                    "A confident drive starts with the right part, the right advice, and a team that stays close."
                </blockquote>
                <div className="quote-author">— Jamal Rafeeq Auto Parts Trading LLC</div>
            </section>

        </div>
    );
};

export default About;
