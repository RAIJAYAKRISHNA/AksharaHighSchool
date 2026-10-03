# Information to confirm with the school

The website currently shows **sample content**. Please collect and confirm the following, then replace the sample text.

## Contact details (Footer and Contact page)
- [ ] Full postal address
- [ ] Phone number(s) and email address
- [ ] Office hours
- [ ] Social media links (if any)

## About
- [ ] School history or story (only facts the school confirms)
- [ ] Vision, mission and core values as the school words them
- [ ] Principal's name, photo (with permission) and message

## Academics and facilities
- [ ] Board or curriculum, medium of instruction, and which classes are offered
- [ ] The real list of facilities (each one must be actually available)
- [ ] Transport details, if offered
- [ ] Subjects, activities, clubs and sports actually run

## Admissions
- [ ] Admission process, dates and eligibility (age rules per class)
- [ ] Required documents list
- [ ] Fee information, if the school wants it published
- [ ] Who follows up on enquiries, and the expected reply time

## Events and gallery
- [ ] Yearly event calendar
- [ ] Photos for the gallery, and **written consent** to publish photos of children (from parents or guardians)

## Branding
- [ ] Final logo files (a high-resolution PNG, plus SVG if available)
- [ ] Official brand colors
- [ ] Preferred domain name

## Legal and data protection
- [ ] A privacy policy covering enquiry data, student accounts and photos
- [ ] Consent process for student accounts (minors)
- [ ] Who may see enquiries, messages and student records
- [ ] How long enquiry and message data is kept

## After the content is confirmed
Delete the yellow "sample content" notice blocks (`<div className="notice" ...>`) from these pages:
`About.jsx`, `Academics.jsx`, `Facilities.jsx`, `StudentLife.jsx`, `Admissions.jsx`, `Contact.jsx`,
and the "Sample, to be confirmed" badges from `Facilities.jsx`. Update `schoolInfo` in `frontend/src/data/schoolData.js`.
Load real events and photos through the admin dashboard, and do not load `database/seed.sql` in production.