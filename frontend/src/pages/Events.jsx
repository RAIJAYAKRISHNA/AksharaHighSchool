import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import EventCard from "../components/events/EventCard.jsx";
import {
  eventsContent,
  sampleEvents,
  sampleNotice,
} from "../data/schoolData.js";

const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const isPastEvent = (event, startOfToday) =>
  Boolean(event.eventDate) &&
  new Date(`${event.eventDate}T00:00:00`) < startOfToday;

function Events() {
  const startOfToday = getStartOfToday();

  const upcomingEvents = sampleEvents.filter(
    (event) => !isPastEvent(event, startOfToday)
  );
  const pastEvents = sampleEvents.filter((event) =>
    isPastEvent(event, startOfToday)
  );

  return (
    <main>
      <PageHeader
        title="Events"
        subtitle="Programmes, competitions and celebrations that bring our school community together."
      />

      <section className="section">
        <div className="container">
          <div className="notice" role="note">
            <span aria-hidden="true">ℹ️</span>
            <p>
              {sampleNotice} Event names and dates are placeholders until the
              school shares its calendar.
            </p>
          </div>

          <SectionTitle
            eyebrow="Events"
            title={eventsContent.upcomingTitle}
            subtitle={eventsContent.upcomingSubtitle}
          />

          {upcomingEvents.length > 0 ? (
            <div className="grid grid--2">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="section-note">{eventsContent.upcomingEmpty}</p>
          )}
        </div>
      </section>

      {pastEvents.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <SectionTitle
              eyebrow="Archive"
              title={eventsContent.pastTitle}
              subtitle={eventsContent.pastSubtitle}
            />
            <div className="grid grid--2">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Events;