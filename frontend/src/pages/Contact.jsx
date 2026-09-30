import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import ContactForm from "../components/forms/ContactForm.jsx";
import { contactContent, schoolInfo, sampleNotice } from "../data/schoolData.js";

function Contact() {
  const { eyebrow, title, subtitle, detailsTitle, formTitle, formIntro } =
    contactContent;

  const details = [
    { icon: "📍", label: "Address", value: schoolInfo.address },
    { icon: "📞", label: "Phone", value: schoolInfo.phone },
    { icon: "✉️", label: "Email", value: schoolInfo.email },
    { icon: "🕘", label: "Office Hours", value: schoolInfo.officeHours },
  ];

  return (
    <main>
      <PageHeader
        title="Contact Us"
        subtitle="We are here to answer your questions about admissions, visits and school life."
      />

      <section className="section">
        <div className="container">
          <div className="notice" role="note">
            <span aria-hidden="true">ℹ️</span>
            <p>
              {sampleNotice} Contact details will be added once the school
              confirms them.
            </p>
          </div>

          <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />

          <div className="grid grid--2">
            <article className="card feature-card">
              <h3>{detailsTitle}</h3>
              {details.map((item) => (
                <p key={item.label}>
                  <span aria-hidden="true">{item.icon} </span>
                  <strong>{item.label}</strong>
                  <br />
                  {item.value}
                </p>
              ))}
            </article>

            <div className="card">
              <h3>{formTitle}</h3>
              <p>{formIntro}</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;