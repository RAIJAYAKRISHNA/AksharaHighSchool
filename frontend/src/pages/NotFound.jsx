import { Link } from "react-router-dom";

import Button from "../components/common/Button.jsx";
import { navLinks } from "../data/schoolData.js";

function NotFound() {
  const pageLinks = navLinks.filter((link) => link.path !== "/");

  return (
    <main className="not-found">
      <div className="container text-center">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1>Page Not Found</h1>
        <p>
          Sorry, we could not find the page you were looking for. It may have
          moved, or the address may be incorrect.
        </p>

        <div className="btn-group btn-group--center">
          <Button to="/" size="lg">
            Back to Home
          </Button>
          <Button to="/contact" variant="outline" size="lg">
            Contact Us
          </Button>
        </div>

        <ul className="not-found__links">
          {pageLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default NotFound;