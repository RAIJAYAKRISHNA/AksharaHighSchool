import SectionTitle from "../common/SectionTitle.jsx";
import { whyChooseUs } from "../../data/schoolData.js";

function WhyChooseUs() {
    return (
        <section className="section">
            <div className="container">
                <SectionTitle
                    eyebrow="Why Choose Akshara"
                    title="A Strong Foundation, Every Step of the Way"
                    subtitle="Learning, character and confidence grow together here."
                />

                <div className="grid grid--3">
                    {whyChooseUs.map((item) => (
                        <article key={item.title} className="card card--hover feature-card">
                            <span className="icon-circle" aria-hidden="true">
                                {item.icon}
                            </span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;