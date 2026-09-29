import Button from "../components/common/Button.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import Loading from "../components/common/Loading.jsx";

const swatches = [
  { name: "Primary 600", value: "var(--color-primary-600)" },
  { name: "Primary 900", value: "var(--color-primary-900)" },
  { name: "Primary 100", value: "var(--color-primary-100)" },
  { name: "Accent 500", value: "var(--color-accent-500)" },
  { name: "Background Alt", value: "var(--color-bg-alt)" },
];

function Home() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Design System Preview"
            title="Akshara High School"
            subtitle="Temporary preview page. The real homepage arrives in Phase 5."
          />
          <div className="btn-group" style={{ justifyContent: "center" }}>
            <Button to="/about">Explore Our School</Button>
            <Button to="/admissions" variant="secondary">
              Enquire Now
            </Button>
            <Button to="/contact" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionTitle
            title="Cards and Badges"
            subtitle="Cards lift slightly on hover."
          />
          <div className="grid grid--3">
            <article className="card card--hover">
              <h3>Nursery to Class 10</h3>
              <p>A complete school journey under one roof.</p>
              <span className="badge badge--sample">Sample content</span>
            </article>
            <article className="card card--hover">
              <h3>Holistic Learning</h3>
              <p>Academics, activities and life skills together.</p>
              <span className="badge">Verified</span>
            </article>
            <article className="card card--hover">
              <h3>Safe Environment</h3>
              <p>A caring and supportive place for every child.</p>
              <span className="badge badge--sample">Sample content</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--primary">
        <div className="container">
          <SectionTitle
            light
            eyebrow="Dark Section"
            title="Give Your Child a Strong Foundation for Tomorrow."
            subtitle="Buttons and titles have light versions for dark backgrounds."
          />
          <div className="btn-group" style={{ justifyContent: "center" }}>
            <Button variant="light">Enquire Now</Button>
            <Button variant="outline-light">Contact Us</Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle title="Palette and Loading" />
          <div className="grid grid--4">
            {swatches.map((s) => (
              <div key={s.name} className="text-center">
                <div
                  style={{
                    background: s.value,
                    height: "72px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <p style={{ marginTop: "0.5rem", fontSize: "var(--fs-sm)" }}>
                  {s.name}
                </p>
              </div>
            ))}
          </div>
          <Loading text="Loading events..." />
        </div>
      </section>
    </main>
  );
}

export default Home;