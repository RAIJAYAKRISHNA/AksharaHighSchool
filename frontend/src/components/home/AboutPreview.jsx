import Button from "../common/Button.jsx";
import SectionTitle from "../common/SectionTitle.jsx";
import { aboutPreview } from "../../data/schoolData.js";

function AboutPreview() {
    return (
        <section className="section">
            <div className="container about-preview">
                <div className="about-preview__content">
                    <SectionTitle
                        align="left"
                        eyebrow={aboutPreview.eyebrow}
                        title={aboutPreview.title}
                    />
                    {aboutPreview.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                    <Button to="/about" variant="outline">
                        Learn More About Us
                    </Button>
                </div>

                <div className="about-preview__panel">
                    <h3>{aboutPreview.panelTitle}</h3>
                    <ul className="check-list">
                        {aboutPreview.points.map((point) => (
                            <li key={point}>{point}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default AboutPreview;