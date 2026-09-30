import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import CTA from "../components/home/CTA.jsx";
import { academicsContent, sampleNotice } from "../data/schoolData.js";

function Academics() {
  const {
    stagesTitle,
    stagesSubtitle,
    stages,
    approachTitle,
    approachSubtitle,
    approach,
  } = academicsContent;

  return (
    <main>
      <PageHeader
        title="Academics"
        subtitle="A clear learning path from Nursery to Class 10, built on understanding, practice and confidence."
      />

      <section className="section">
        <div className="container">
          <div className="notice" role="note">
            <span aria-hidden="true">ℹ️</span>
            <p>
              {sampleNotice} Descriptions here are proposed and not yet
              confirmed.
            </p>
          </div>

          <SectionTitle
            eyebrow="Stages"
            title={stagesTitle}
            subtitle={stagesSubtitle}
          />

          <div className="grid grid--2">
            {stages.map((stage) => (
              <article key={stage.title} className="card stage-card">
                <div className="stage-card__head">
                  <span className="icon-circle" aria-hidden="true">
                    {stage.icon}
                  </span>
                  <div>
                    <h3>{stage.title}</h3>
                    <span className="badge">{stage.classes}</span>
                  </div>
                </div>
                <p>{stage.description}</p>
                <ul className="check-list">
                  {stage.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionTitle
            eyebrow="Learning Approach"
            title={approachTitle}
            subtitle={approachSubtitle}
          />
          <div className="grid grid--3">
            {approach.map((item) => (
              <article
                key={item.title}
                className="card card--hover feature-card"
              >
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

      <CTA />
    </main>
  );
}

export default Academics;