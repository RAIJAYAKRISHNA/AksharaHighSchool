import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import CTA from "../components/home/CTA.jsx";
import {
  studentLifeContent,
  schoolLife,
  sampleNotice,
} from "../data/schoolData.js";

function StudentLife() {
  const { eyebrow, title, subtitle, activities, beyondTitle, beyondSubtitle } =
    studentLifeContent;

  return (
    <main>
      <PageHeader
        title="Student Life"
        subtitle="Learning at Akshara goes beyond the classroom, with plenty of ways to explore, create and shine."
      />

      <section className="section">
        <div className="container">
          <div className="notice" role="note">
            <span aria-hidden="true">ℹ️</span>
            <p>{sampleNotice}</p>
          </div>

          <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />

          <div className="grid grid--3">
            {activities.map((activity) => (
              <article
                key={activity.title}
                className="card card--hover feature-card"
              >
                <span className="icon-circle" aria-hidden="true">
                  {activity.icon}
                </span>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionTitle
            eyebrow="School Life"
            title={beyondTitle}
            subtitle={beyondSubtitle}
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
        </div>
      </section>

      <CTA />
    </main>
  );
}

export default StudentLife;