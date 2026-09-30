function EventCard({ event }) {
    const date = event.eventDate ? new Date(`${event.eventDate}T00:00:00`) : null;
    const hasValidDate = date !== null && !Number.isNaN(date.getTime());

    return (
        <article className="card card--hover event-card">
            <div className="event-card__date">
                {hasValidDate ? (
                    <time dateTime={event.eventDate}>
                        <span className="event-card__day">{date.getDate()}</span>
                        <span className="event-card__month">
                            {date.toLocaleString("en-IN", { month: "short" })}{" "}
                            {date.getFullYear()}
                        </span>
                    </time>
                ) : (
                    <span className="event-card__tba">
                        Date
                        <br />
                        TBA
                    </span>
                )}
            </div>

            <div className="event-card__body">
                <h3>{event.title}</h3>
                {event.location && (
                    <p className="event-card__meta">
                        <span aria-hidden="true">📍 </span>
                        {event.location}
                    </p>
                )}
                <p>{event.description}</p>
                {event.isSample && (
                    <span className="badge badge--sample">Sample event</span>
                )}
            </div>
        </article>
    );
}

export default EventCard;