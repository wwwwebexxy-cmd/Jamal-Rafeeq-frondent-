import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoMenu, IoSearch } from "react-icons/io5";

import navbarlogo from "../assets/jamal-rafeeq-logo-transparent.png";
import Offer_Query from "../hooks/offers/queries/Offer_Query";
import Product_Query from "../features/sale/queries/Product_Query";
import "../Navbar.css";

const links = [
    { name: "Home", path: "/" },
    { name: "Find Products", path: "/find-products" },
    { name: "New Arrivals", path: "/find-products?sort=new" },
    { name: "About", path: "/about" },
];

function Navbar() {
    const navigate = useNavigate();
    const [showNavbar, setShowNavbar] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const lastScrollY = useRef(0);
    const { data: offers = [] } = Offer_Query();
    const offerActive = Array.isArray(offers) && offers.some((offer) => offer && offer.is_active !== false);
    const { data: suggestionData, isFetching: suggestionsLoading } = Product_Query(
        { search: debouncedSearch, page_size: 5 },
        { enabled: debouncedSearch.length >= 2 },
    );
    const suggestions = suggestionData?.results || [];

    useEffect(() => {
        const handleScroll = () => {
            const current = window.scrollY;
            setShowNavbar(current <= lastScrollY.current || current < 100);
            lastScrollY.current = current;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedSearch(searchText.trim()), 250);
        return () => window.clearTimeout(timer);
    }, [searchText]);

    const closeMenu = () => setMenuOpen(false);
    const closeSearch = () => { setSearchOpen(false); setSearchText(""); setDebouncedSearch(""); };
    const goToSearch = (value = searchText) => {
        const query = value.trim();
        if (!query) return;
        navigate(`/find-products?product=${encodeURIComponent(query)}`);
        closeSearch();
        closeMenu();
    };

    return <>
        <div className={`navbar ${showNavbar ? "show" : "hide"}`}>
            <div className="nav_main">
                <button type="button" className={`nav_toggle ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={menuOpen}><IoMenu size={26} /></button>
                <div className="nav_main2">
                    <NavLink to="/" className="logo-link topbar-logo-link"><img src={navbarlogo} alt="Jamal Rafeeq Auto Parts Trading LLC" className="navbar-logo topbar-logo" /></NavLink>
                    <ul className="navLinks">{links.map((link) => <li key={link.name}><NavLink to={link.path} className="nav_link">{link.name}</NavLink></li>)}{offerActive && <li><NavLink to="/find-products?offer=true" className="nav_link">Offers</NavLink></li>}</ul>
                    <div className="search_main">
                        <div className="search_wrapper">
                            <input className={`nav_search_input ${searchOpen ? "open" : ""}`} value={searchText} onChange={(event) => { setSearchText(event.target.value); setSearchOpen(true); }} onKeyDown={(event) => { if (event.key === "Enter") goToSearch(); if (event.key === "Escape") closeSearch(); }} placeholder="Search products" aria-label="Search products" />
                            <button type="button" className="input-search-button input_search_icon" onClick={() => searchOpen && searchText.trim() ? goToSearch() : setSearchOpen(true)} aria-label={searchOpen ? "Submit product search" : "Open product search"}><IoSearch size={22} /></button>
                            {searchOpen && debouncedSearch.length >= 2 && <div className="search-suggestions" role="listbox" aria-label="Product suggestions">{suggestionsLoading && <p>Searching…</p>}{!suggestionsLoading && suggestions.length === 0 && <p>No matching products</p>}{suggestions.map((product) => <button type="button" role="option" key={product.id} onClick={() => { navigate(`/single/${product.id}`); closeSearch(); }}>{product.name}</button>)}<button type="button" className="search-suggestion-all" onClick={() => goToSearch()}>See all results for “{debouncedSearch}”</button></div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={`mobile_menu ${menuOpen ? "show" : ""}`} id="mobile-navigation"><div className="mobile_header"><NavLink to="/" onClick={closeMenu}><img src={navbarlogo} alt="Jamal Rafeeq Auto Parts Trading LLC" className="navbar-logo" /></NavLink><button type="button" className="mobile-close-button" onClick={closeMenu} aria-label="Close navigation"><IoClose size={25} /></button></div><ul>{links.map((link) => <li key={link.name}><NavLink to={link.path} onClick={closeMenu}>{link.name}</NavLink></li>)}{offerActive && <li><NavLink to="/find-products?offer=true" onClick={closeMenu}>Offers</NavLink></li>}<li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li></ul></div>
        {menuOpen && <button type="button" className="mobile-menu-backdrop" onClick={closeMenu} aria-label="Close navigation overlay" />}
    </>;
}

export default Navbar;
