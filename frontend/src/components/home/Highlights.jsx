import { highlights } from "../../data/schoolData.js";

function Highlights() {
    return (
        <section className="highlights" aria-label="School highlights">
            <div className="container">
                <div className="grid grid--4">
                    {highlights.map((item) => (
                        <article
                            key={item.title}
                            className="card card--hover highlight-card"
                        >
                            <span className="icon-circle" aria-hidden="true">
                                {item.icon}
                            </span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
                <p className="section-note">
                    Sample content, to be confirmed by the school.
                </p>
            </div>
        </section>
    );
}

export default Highlights;