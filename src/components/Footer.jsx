import "./../Footer.css";

import footerlogo from './../assets/jamal-rafeeq-logo-transparent.png'
import jrcBrandLogo from './../assets/jrc-auto-parts-logo-transparent.png'
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, } from "react-icons/fa";
import { BUSINESS_ADDRESS, BUSINESS_EMAIL, BUSINESS_PHONE_NUMBERS, BUSINESS_WEBSITE, getWhatsappUrl } from "../config/business";
function Footer() {
    const whatsappUrl = getWhatsappUrl("Hello, I would like to enquire about your automotive products.");


    return (
        <div>

            <footer className="footer">

                <div className="footer-container">

                    <div className="footer-column brand">
                        <div className="footer-brand-logos" aria-label="Jamal Rafeeq and JRC Auto Parts">
                            <img src={footerlogo} alt="Jamal Rafeeq logo" className="footer-logo" />
                            <img src={jrcBrandLogo} alt="JRC Auto Parts logo" className="footer-partner-logo" />
                        </div>
                    </div>

                    <div className="footer-column social-column">
                        <h3>Follow Us</h3>

                        <div className="social-icons">
                            <a href="https://www.facebook.com/share/1JVhtNhpmk/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Jamal Rafeeq on Facebook">
                                <FaFacebookF />
                            </a>
                            <a href="https://www.instagram.com/jamal_rafeeq_auto_parts?stkn=ZDRkZDg2YTZmZG00" target="_blank" rel="noopener noreferrer" aria-label="Jamal Rafeeq on Instagram">
                                <FaInstagram />
                            </a>
                            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact Jamal Rafeeq on WhatsApp">
                                <FaWhatsapp />
                            </a>}
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3>Quick Links</h3>

                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/find-products">Find Products</Link></li>
                            <li><Link to="/new-arrivals">New Arrivals</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Customer Care</h3>

                        <ul>
                            <li><Link to="/find-products">Find Parts</Link></li>
                            <li><Link to="/contact">Business Support</Link></li>
                            {/* <li><Link to="/contact">Shipping &amp; Delivery</Link></li> */}

                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Contact Us</h3>

                        <ul className="contact">
                            {BUSINESS_PHONE_NUMBERS.map((phone) => <li key={phone.href}><a href={phone.href}><FaPhoneAlt /> {phone.display}</a></li>)}

                            <li>
                                <FaEnvelope />  <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
                            </li>

                            <li>
                                <FaGlobe /> <a href={BUSINESS_WEBSITE} target="_blank" rel="noopener noreferrer">www.jrautospareparts.com</a>
                            </li>

                            <li>
                                <FaMapMarkerAlt /> {BUSINESS_ADDRESS}
                            </li>
                        </ul>
                    </div>

                </div>

            </footer>

            <div className="copyright">
                © 2026 Jamal Rafeeq. All Rights Reserved.
            </div>

        </div>
    )
}

export default Footer
