import { Link } from "react-router-dom";

function PageHeader({ title, subtitle }) {
    return (
        <section className="page-header">
            <div className="container">
                <nav className="page-header__crumbs" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">{title}</span>
                </nav>
                <h1 className="page-header__title">{title}</h1>
                {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>
        </section>
    );
}

export default PageHeader;