import Button from "../components/common/Button.jsx";
import Loading from "../components/common/Loading.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import EventCard from "../components/events/EventCard.jsx";
import useFetch from "../hooks/useFetch.js";
import { getEvents } from "../services/api.js";
import { eventsContent } from "../data/schoolData.js";

const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const isPastEvent = (event, startOfToday) =>
  Boolean(event.eventDate) &&
  new Date(`${event.eventDate}T00:00:00`) < startOfToday;

function Events() {
  const { data, loading, error, retry } = useFetch(getEvents);

  const events = data || [];
  const startOfToday = getStartOfToday();
  const upcomingEvents = events.filter((event) => !isPastEvent(event, startOfToday));
  const pastEvents = events.filter((event) => isPastEvent(event, startOfToday));

  return (
    <main>
      <PageHeader
        title="Events"
        subtitle="Programmes, competitions and celebrations that bring our school community together."
      />

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Events"
            title={eventsContent.upcomingTitle}
            subtitle={eventsContent.upcomingSubtitle}
          />

          {loading && <Loading text="Loading events..." />}

          {!loading && error && (
            <div className="form-message form-message--error" role="alert">
              <p>{error}</p>
              <Button size="sm" variant="outline" onClick={retry}>
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && upcomingEvents.length > 0 && (
            <div className="grid grid--2">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {!loading && !error && upcomingEvents.length === 0 && (
            <p className="section-note">{eventsContent.upcomingEmpty}</p>
          )}
        </div>
      </section>

      {!loading && !error && pastEvents.length > 0 && (
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