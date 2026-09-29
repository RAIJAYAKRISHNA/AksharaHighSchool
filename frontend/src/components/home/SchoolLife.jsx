import Button from "../common/Button.jsx";
import SectionTitle from "../common/SectionTitle.jsx";
import { schoolLife } from "../../data/schoolData.js";

function SchoolLife() {
    return (
        <section className="section section--alt">
            <div className="container">
                <SectionTitle
                    eyebrow="School Life"
                    title="Life at Akshara"
                    subtitle="Every day brings something to learn, enjoy and celebrate."
                />

                <div className="life-grid">
                    {schoolLife.map((item) => (
                        <article key={item.title} className="life-tile">
                            <span className="life-tile__icon" aria-hidden="true">
                                {item.icon}
                            </span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>

                <p className="section-note">
                    Placeholder tiles. Real school photos will be added later.
                </p>

                <div className="section-cta">
                    <Button to="/student-life" variant="primary">
                        Explore Student Life
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default SchoolLife;