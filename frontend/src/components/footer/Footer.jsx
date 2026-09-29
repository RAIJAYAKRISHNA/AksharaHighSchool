import { Link } from "react-router-dom";

import logo from "../../assets/logo/akshara-logo.png";
import { schoolInfo, footerColumns } from "../../data/schoolData.js";

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                        <Link
                            to="/"
                            className="footer__logo-wrap"
                            aria-label={`${schoolInfo.name} home`}
                        >
                            <img src={logo} alt={`${schoolInfo.name} logo`} className="footer__logo" />
                        </Link>
                        <p className="footer__tagline">{schoolInfo.tagline}</p>
                        <p>{schoolInfo.description}</p>
                    </div>

                    {footerColumns.map((column) => (
                        <nav key={column.title} aria-label={column.title}>
                            <h3 className="footer__heading">{column.title}</h3>
                            <ul className="footer__links">
                                {column.links.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}

                    <div>
                        <h3 className="footer__heading">Contact</h3>
                        <address className="footer__contact">
                            <p>{schoolInfo.address}</p>
                            <p>{schoolInfo.phone}</p>
                            <p>{schoolInfo.email}</p>
                            <p>{schoolInfo.officeHours}</p>
                        </address>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>
                        &copy; {year} {schoolInfo.name}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;