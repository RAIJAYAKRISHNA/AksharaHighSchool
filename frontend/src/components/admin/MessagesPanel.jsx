import { useState } from "react";

import Button from "../common/Button.jsx";
import AsyncState from "../common/AsyncState.jsx";
import useFetch from "../../hooks/useFetch.js";
import { getAdminMessages, markMessageRead } from "../../services/api.js";

function MessagesPanel({ onChanged }) {
    const { data, loading, error, retry } = useFetch(getAdminMessages);
    const [actionError, setActionError] = useState("");

    const handleMarkRead = async (id) => {
        setActionError("");
        try {
            await markMessageRead(id);
            retry();
            onChanged();
        } catch {
            setActionError("Could not update the message. Please try again.");
        }
    };

    const messages = data || [];

    return (
        <AsyncState
            loading={loading}
            error={error}
            onRetry={retry}
            loadingText="Loading messages..."
        >
            {actionError && (
                <div className="form-message form-message--error" role="alert">
                    {actionError}
                </div>
            )}

            {messages.length === 0 ? (
                <p className="section-note">No messages yet.</p>
            ) : (
                <div className="grid grid--2">
                    {messages.map((message) => (
                        <article key={message.id} className="card feature-card">
                            <h3>{message.subject}</h3>
                            <p>
                                <span className={message.read ? "badge" : "badge badge--sample"}>
                                    {message.read ? "Read" : "New"}
                                </span>
                            </p>
                            <p>
                                <strong>From:</strong> {message.name}
                                <br />
                                <strong>Email:</strong>{" "}
                                <a href={`mailto:${message.email}`}>{message.email}</a>
                                {message.phone && (
                                    <>
                                        <br />
                                        <strong>Phone:</strong>{" "}
                                        <a href={`tel:${message.phone}`}>{message.phone}</a>
                                    </>
                                )}
                                <br />
                                <strong>Received:</strong>{" "}
                                {new Date(message.createdAt).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </p>
                            <p>{message.message}</p>
                            {!message.read && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleMarkRead(message.id)}
                                >
                                    Mark as Read
                                </Button>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </AsyncState>
    );
}

export default MessagesPanel;