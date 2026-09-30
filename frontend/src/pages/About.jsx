import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import CTA from "../components/home/CTA.jsx";
import { aboutContent, sampleNotice } from "../data/schoolData.js";

function About() {
    const { story, vision, mission, values, principal } = aboutContent;

    return (
        <main>
            <PageHeader
                title="About Us"
                subtitle="Learn about our story, our purpose and the values that guide everything we do."
            />

            <section className="section">
                <div className="container">
                    <div className="notice" role="note">
                        <span aria-hidden="true">ℹ️</span>
                        <p>{sampleNotice}</p>
                    </div>

                    <div className="about-preview">
                        <div>
                            <SectionTitle
                                align="left"
                                eyebrow={story.eyebrow}
                                title={story.title}
                            />
                            {story.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>

                        <div className="about-preview__panel">
                            <h3>{story.glanceTitle}</h3>
                            <ul className="check-list">
                                {story.glancePoints.map((point) => (
                                    <li key={point}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <div className="grid grid--2">
                        {[vision, mission].map((item) => (
                            <article key={item.title} className="card feature-card">
                                <span className="icon-circle" aria-hidden="true">
                                    {item.icon}
                                </span>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <SectionTitle
                        eyebrow="Core Values"
                        title="What We Believe In"
                        subtitle="These values shape our classrooms, our activities and how we treat one another."
                    />
                    <div className="grid grid--3">
                        {values.map((value) => (
                            <article
                                key={value.title}
                                className="card card--hover feature-card"
                            >
                                <span className="icon-circle" aria-hidden="true">
                                    {value.icon}
                                </span>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <SectionTitle eyebrow={principal.eyebrow} title={principal.title} />
                    <div className="principal">
                        <div className="principal__avatar" aria-hidden="true">
                            🧑‍🏫
                        </div>
                        <div className="principal__body">
                            <blockquote className="principal__message">
                                {principal.paragraphs.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </blockquote>
                            <p className="principal__name">{principal.name}</p>
                            <p className="principal__role">{principal.role}</p>
                        </div>
                    </div>
                </div>
            </section>

            <CTA />
        </main>
    );
}

export default About;