import Button from "../common/Button.jsx";
import SectionTitle from "../common/SectionTitle.jsx";
import { academicJourney } from "../../data/schoolData.js";

function AcademicJourney() {
    return (
        <section className="section section--alt">
            <div className="container">
                <SectionTitle
                    eyebrow="Academic Journey"
                    title="A Clear Path From Nursery to Class 10"
                    subtitle="Each stage builds on the one before, so children grow with confidence."
                />

                <ol className="journey">
                    {academicJourney.map((stage, index) => (
                        <li key={stage.title} className="journey__step">
                            <span className="journey__number" aria-hidden="true">
                                {index + 1}
                            </span>
                            <h3 className="journey__title">{stage.title}</h3>
                            <p className="journey__classes">{stage.classes}</p>
                            <p className="journey__text">{stage.description}</p>
                        </li>
                    ))}
                </ol>

                <div className="section-cta">
                    <Button to="/academics" variant="primary">
                        Explore Academics
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default AcademicJourney;