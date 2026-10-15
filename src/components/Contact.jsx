import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./../Contact.css"
import { getAuthValue } from "../features/auth/authUtils";
import { getWhatsappUrl } from "../config/business";

const ContactUs = () => {
    const [searchParams] = useSearchParams();
    const topic = searchParams.get("topic");
    const initialSubject = topic === "import-export" ? "Import & Export Enquiry" : topic === "bulk-supply" ? "Bulk Supply Enquiry" : "";
    const [formData, setFormData] = useState(() => ({
        name: getAuthValue("first_name"),
        email: getAuthValue("email"),
        phone: "",
        subject: initialSubject,
        message: "",
    }));

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const sendWhatsApp = (e) => {
        e.preventDefault();

        const { name, email, phone, subject, message } = formData;

        if (!name || !email || !phone || !subject || !message) {
            alert("Please fill in all fields.");
            return;
        }

        const text = `Hello Jamal Rafeeq Team,

Name: ${name}

Email: ${email}

Phone: ${phone}

Subject: ${subject}

Message:
${message}

Thank you.`;

        const whatsappUrl = getWhatsappUrl(text);
        if (!whatsappUrl) {
            alert("WhatsApp contact is not configured.");
            return;
        }

        const messageWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        if (messageWindow) messageWindow.opener = null;
    };

    return (
        <div className="contact-page">

            <div className="contact-header">

                <span className="contact-tag">
                    CONTACT US
                </span>

                <h1>
                    We'd Love To Hear From You
                </h1>

                <p>
                    Have a question about our automotive range,
                    an import or export requirement, or a shipment?
                    Fill out the form below and send us
                    a message directly on WhatsApp.
                </p>

            </div>

            <div className="contact-container">

                {/* Left */}

                <div className="contact-info">

                    <h2>Get In Touch</h2>

                    <div className="info-box">

                        <h4>Business Hours</h4>

                        <p>
                            Monday - Friday
                        </p>

                        <p>
                            9:00 AM - 6:00 PM
                        </p>

                    </div>

                    <div className="info-box">

                        <h4>Response Time</h4>

                        <p>
                            We usually reply within a few hours on WhatsApp.
                        </p>

                    </div>

                    <div className="info-box">

                        <h4>Need Immediate Help?</h4>

                        <p>
                            Send us a WhatsApp message and our team will assist you as soon as possible.
                        </p>

                    </div>

                </div>

                {/* Right */}

                <form
                    className="contact-form"
                    onSubmit={sendWhatsApp}
                >

                    <div className="input-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />



                    </div>

                    <div className="input-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Subject
                        </label>

                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select a Subject
                            </option>

                            <option>
                                Product Enquiry
                            </option>

                            <option>
                                Import &amp; Export Enquiry
                            </option>

                            <option>
                                Bulk Supply Enquiry
                            </option>

                            <option>
                                Order Status
                            </option>

                            <option>
                                Returns & Exchanges
                            </option>

                            <option>
                                Payment Issue
                            </option>

                            <option>
                                Size & Fit Assistance
                            </option>

                            <option>
                                General Enquiry
                            </option>

                            <option>
                                Collaboration
                            </option>

                            <option>
                                Feedback & Suggestions
                            </option>

                        </select>

                    </div>

                    <div className="input-group">

                        <label>
                            Message
                        </label>

                        <textarea
                            rows="6"
                            name="message"
                            placeholder="Write your message..."
                            value={formData.message}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        className="whatsapp-btn"
                        type="submit"
                    >

                        Send via WhatsApp →

                    </button>

                </form>

            </div>

        </div>
    );
};

export default ContactUs;
