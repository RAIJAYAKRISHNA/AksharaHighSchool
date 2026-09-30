import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import CTA from "../components/home/CTA.jsx";
import { facilities, sampleNotice } from "../data/schoolData.js";

function Facilities() {
  return (
    <main>
      <PageHeader
        title="Facilities"
        subtitle="Learning spaces and services designed to support every child."
      />

      <section className="section">
        <div className="container">
          <div className="notice" role="note">
            <span aria-hidden="true">ℹ️</span>
            <p>
              {sampleNotice} Facilities marked "Sample, to be confirmed" have
              not yet been verified.
            </p>
          </div>

          <SectionTitle
            eyebrow="Our Facilities"
            title="Spaces Designed for Learning and Growth"
            subtitle="From classrooms to the playground, every space has a purpose."
          />

          <div className="grid grid--4">
            {facilities.map((facility) => (
              <article
                key={facility.title}
                className="card card--hover feature-card facility-card"
              >
                <span className="icon-circle" aria-hidden="true">
                  {facility.icon}
                </span>
                <h3>{facility.title}</h3>
                <p>{facility.description}</p>
                <span className="badge badge--sample">
                  Sample, to be confirmed
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}

export default Facilities;