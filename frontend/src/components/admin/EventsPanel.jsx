import { useState } from "react";

import AsyncState from "../common/AsyncState.jsx";
import Button from "../common/Button.jsx";
import FormField from "../forms/FormField.jsx";
import useForm from "../../hooks/useForm.js";
import useFetch from "../../hooks/useFetch.js";
import {
    createEvent,
    deleteEvent,
    getEvents,
    updateEvent,
} from "../../services/api.js";

const emptyValues = { title: "", description: "", eventDate: "", location: "" };

const validate = (values) => {
    const errors = {};
    if (!values.title.trim()) {
        errors.title = "Please enter the event title.";
    } else if (values.title.length > 150) {
        errors.title = "Title must be 150 characters or fewer.";
    }
    if (!values.description.trim()) {
        errors.description = "Please enter a description.";
    } else if (values.description.length > 1000) {
        errors.description = "Description must be 1000 characters or fewer.";
    }
    if (values.location.length > 150) {
        errors.location = "Location must be 150 characters or fewer.";
    }
    return errors;
};

function EventForm({ event, onSaved, onCancel }) {
    const initialValues = event
        ? {
            title: event.title,
            description: event.description,
            eventDate: event.eventDate || "",
            location: event.location || "",
        }
        : emptyValues;

    const { values, errors, status, feedback, handleChange, handleSubmit } = useForm({
        initialValues,
        validate,
        submit: async (formValues) => {
            const payload = {
                title: formValues.title.trim(),
                description: formValues.description.trim(),
                eventDate: formValues.eventDate || null,
                location: formValues.location.trim(),
            };
            if (event) {
                await updateEvent(event.id, payload);
            } else {
                await createEvent(payload);
            }
            onSaved();
        },
        successMessage: event ? "Event updated." : "Event created.",
    });

    const isSubmitting = status === "submitting";

    return (
        <form onSubmit={handleSubmit} noValidate aria-label="Event form">
            {feedback && (
                <div
                    role={status === "error" ? "alert" : "status"}
                    className={`form-message ${status === "success" ? "form-message--success" : "form-message--error"
                        }`}
                >
                    {feedback}
                </div>
            )}

            <FormField
                id="event-title"
                name="title"
                label="Title"
                value={values.title}
                onChange={handleChange}
                error={errors.title}
                required
            />
            <FormField
                id="event-description"
                name="description"
                label="Description"
                as="textarea"
                maxLength={1000}
                value={values.description}
                onChange={handleChange}
                error={errors.description}
                required
            />
            <div className="grid grid--2">
                <FormField
                    id="event-eventDate"
                    name="eventDate"
                    label="Date"
                    type="date"
                    hint="Leave empty if the date is not announced yet"
                    value={values.eventDate}
                    onChange={handleChange}
                    error={errors.eventDate}
                />
                <FormField
                    id="event-location"
                    name="location"
                    label="Location"
                    value={values.location}
                    onChange={handleChange}
                    error={errors.location}
                />
            </div>

            <div className="btn-group">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Event"}
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}

function EventsPanel({ onChanged }) {
    const { data, loading, error, retry } = useFetch(getEvents);
    const [editing, setEditing] = useState(null);
    const [actionError, setActionError] = useState("");

    const refresh = () => {
        retry();
        onChanged();
    };

    const handleSaved = () => {
        setEditing(null);
        refresh();
    };

    const handleDelete = async (event) => {
        if (!window.confirm(`Delete "${event.title}"?`)) {
            return;
        }
        setActionError("");
        try {
            await deleteEvent(event.id);
            refresh();
        } catch {
            setActionError("Could not delete the event. Please try again.");
        }
    };

    const events = data || [];

    return (
        <div className="grid">
            <div className="btn-group">
                <Button size="sm" onClick={() => setEditing("new")}>
                    Add Event
                </Button>
            </div>

            {actionError && (
                <div className="form-message form-message--error" role="alert">
                    {actionError}
                </div>
            )}

            {editing && (
                <div className="card">
                    <h3>{editing === "new" ? "Add Event" : "Edit Event"}</h3>
                    <EventForm
                        key={editing === "new" ? "new" : editing.id}
                        event={editing === "new" ? null : editing}
                        onSaved={handleSaved}
                        onCancel={() => setEditing(null)}
                    />
                </div>
            )}

            <AsyncState
                loading={loading}
                error={error}
                onRetry={retry}
                loadingText="Loading events..."
            >
                {events.length === 0 ? (
                    <p className="section-note">No events yet.</p>
                ) : (
                    <div className="grid grid--2">
                        {events.map((event) => (
                            <article key={event.id} className="card feature-card">
                                <h3>{event.title}</h3>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {event.eventDate
                                        ? new Date(`${event.eventDate}T00:00:00`).toLocaleDateString("en-IN", {
                                            dateStyle: "medium",
                                        })
                                        : "To be announced"}
                                    {event.location && (
                                        <>
                                            <br />
                                            <strong>Location:</strong> {event.location}
                                        </>
                                    )}
                                </p>
                                <p>{event.description}</p>
                                <div className="btn-group">
                                    <Button size="sm" variant="outline" onClick={() => setEditing(event)}>
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDelete(event)}>
                                        Delete
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </AsyncState>
        </div>
    );
}

export default EventsPanel;