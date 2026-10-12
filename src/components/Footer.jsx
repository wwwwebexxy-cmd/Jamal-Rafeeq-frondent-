import "./../Footer.css";

// import eehook from './../assets/eehook.jpeg'
import visa from './../assets/visa-payment.png'
import master from './../assets/master-payment.png'
import amc from './../assets/american-exp-payment.png'
import footerlogo from './../assets/jamal-rafeeq-logo-transparent.png'
import apple from './../assets/apple-payment.png'
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, } from "react-icons/fa";
import { getWhatsappUrl } from "../config/business";
function Footer() {
    const whatsappUrl = getWhatsappUrl("Hello, I would like to enquire about your automotive products.");


    return (
        <div>

            <footer className="footer">

                <div className="footer-container">

                    <div className="footer-column brand">
                        <img src={footerlogo} alt="Jamal Rafeeq Auto Parts Trading LLC" className="footer-logo" />
                        <p className="footer-brand-name">Jamal Rafeeq Auto Parts Trading LLC</p>
                    </div>

                    <div className="footer-column social-column">
                        <h3>Follow Us</h3>

                        <div className="social-icons">
                            <a href="https://www.instagram.com/eehookuae/" target="_blank" rel="noreferrer" aria-label="Jamal Rafeeq on Instagram">
                                <FaInstagram />
                            </a>
                            <a href="https://www.facebook.com/eehookuae/" target="_blank" rel="noreferrer" aria-label="Jamal Rafeeq on Facebook">
                                <FaFacebookF />
                            </a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3>Quick Links</h3>

                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/find-products">Find Products</Link></li>
                            <li><Link to="/find-products?offer=true">Offers</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Customer Care</h3>

                        <ul>
                            <li><Link to="/profile">My Account</Link></li>
                            <li><Link to="/myorders">Track Order</Link></li>
                            <li><Link to="/myorders">Shipping &amp; Delivery</Link></li>

                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Contact Us</h3>

                        <ul className="contact">
                            <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><FaPhoneAlt /> +971 50 123 4567</a></li>

                            <li>
                                <FaEnvelope />  <a href="mailto:info@eehook.com">info@eehook.com</a>
                            </li>

                            <li>
                                <FaMapMarkerAlt /> Dubai, United Arab Emirates
                            </li>
                        </ul>
                    </div>

                    <div className="footer-column payment">
                        <h3>We Accept</h3>

                        <div className="payment-icons">
                            <img src={visa} alt="payments" />
                            <img src={master} alt="" />
                            <img src={amc} alt="" />
                            <img src={apple} alt="" />
                        </div>
                    </div>

                </div>

            </footer>

            <div className="copyright">
                © 2026 Jamal Rafeeq Auto Parts Trading LLC. All Rights Reserved.
            </div>

        </div>
    )
}

export default Footer
