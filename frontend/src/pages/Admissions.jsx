import Button from "../components/common/Button.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import EnquiryForm from "../components/forms/EnquiryForm.jsx";
import { admissionsContent, sampleNotice } from "../data/schoolData.js";

function Admissions() {
  const {
    eyebrow,
    title,
    subtitle,
    processTitle,
    processSubtitle,
    process,
    detailsTitle,
    detailsSubtitle,
    documentsTitle,
    documents,
    helpTitle,
    helpText,
    formTitle,
    formIntro,
  } = admissionsContent;

  return (
    <main>
      <PageHeader
        title="Admissions"
        subtitle="Nursery to Class 10. We are happy to help you take the first step."
      />

      <section className="section">
        <div className="container">
          <div className="notice" role="note">
            <span aria-hidden="true">ℹ️</span>
            <p>
              {sampleNotice} The admission process and document list are
              proposed and not yet confirmed.
            </p>
          </div>

          <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />

          <div className="btn-group btn-group--center">
            <Button href="#enquiry" size="lg">
              Enquire Online
            </Button>
            <Button to="/contact" variant="outline" size="lg">
              Contact the School
            </Button>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionTitle
            eyebrow="Admission Process"
            title={processTitle}
            subtitle={processSubtitle}
          />

          <ol className="journey">
            {process.map((step, index) => (
              <li key={step.title} className="journey__step">
                <span className="journey__number" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="journey__title">{step.title}</h3>
                <p className="journey__text">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="enquiry">
        <div className="container">
          <SectionTitle
            eyebrow="Enquiry"
            title={detailsTitle}
            subtitle={detailsSubtitle}
          />

          <div className="grid grid--2">
            <div className="grid">
              <article className="card">
                <h3>{documentsTitle}</h3>
                <ul className="check-list">
                  {documents.map((document) => (
                    <li key={document}>{document}</li>
                  ))}
                </ul>
              </article>

              <article className="card">
                <h3>{helpTitle}</h3>
                <p>{helpText}</p>
                <Button to="/contact" variant="outline">
                  Contact Us
                </Button>
              </article>
            </div>

            <div className="card">
              <h3>{formTitle}</h3>
              <p>{formIntro}</p>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Admissions;