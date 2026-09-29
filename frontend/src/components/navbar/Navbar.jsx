import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import logo from "../../assets/logo/akshara-logo.png";
import Button from "../common/Button.jsx";
import { schoolInfo, navLinks } from "../../data/schoolData.js";

const MOBILE_BREAKPOINT = 1240;

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                setIsOpen(false);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", handleResize);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleResize);
        };
    }, [isOpen]);

    const menuClasses = ["navbar__menu", isOpen ? "navbar__menu--open" : ""]
        .filter(Boolean)
        .join(" ");

    const toggleClasses = [
        "navbar__toggle",
        isOpen ? "navbar__toggle--open" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <header className="navbar">
            <div className="navbar__inner">
                <Link
                    to="/"
                    className="navbar__brand"
                    aria-label={`${schoolInfo.name} home`}
                >
                    <img src={logo} alt="" className="navbar__logo" />
                    <span className="navbar__brand-text">{schoolInfo.name}</span>
                </Link>

                <button
                    type="button"
                    className={toggleClasses}
                    aria-expanded={isOpen}
                    aria-controls="primary-navigation"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    onClick={() => setIsOpen((open) => !open)}
                >
                    <span className="navbar__toggle-bar"></span>
                    <span className="navbar__toggle-bar"></span>
                    <span className="navbar__toggle-bar"></span>
                </button>

                <nav
                    id="primary-navigation"
                    className={menuClasses}
                    aria-label="Main navigation"
                >
                    <ul className="navbar__links">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    end={link.path === "/"}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "navbar__link navbar__link--active"
                                            : "navbar__link"
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <Button
                        to="/admissions"
                        variant="secondary"
                        size="sm"
                        className="navbar__cta"
                    >
                        Enquire Now
                    </Button>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;