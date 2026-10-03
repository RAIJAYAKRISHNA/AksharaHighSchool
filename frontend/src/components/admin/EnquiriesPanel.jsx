import { useState } from "react";

import AsyncState from "../common/AsyncState.jsx";
import useFetch from "../../hooks/useFetch.js";
import { getAdminEnquiries, updateEnquiryStatus } from "../../services/api.js";

const STATUSES = ["NEW", "CONTACTED", "CLOSED"];

function EnquiriesPanel({ onChanged }) {
    const { data, loading, error, retry } = useFetch(getAdminEnquiries);
    const [actionError, setActionError] = useState("");

    const handleStatusChange = async (id, status) => {
        setActionError("");
        try {
            await updateEnquiryStatus(id, status);
            retry();
            onChanged();
        } catch {
            setActionError("Could not update the status. Please try again.");
        }
    };

    const enquiries = data || [];

    return (
        <AsyncState
            loading={loading}
            error={error}
            onRetry={retry}
            loadingText="Loading enquiries..."
        >
            {actionError && (
                <div className="form-message form-message--error" role="alert">
                    {actionError}
                </div>
            )}

            {enquiries.length === 0 ? (
                <p className="section-note">No enquiries yet.</p>
            ) : (
                <div className="grid grid--2">
                    {enquiries.map((enquiry) => (
                        <article key={enquiry.id} className="card feature-card">
                            <h3>{enquiry.studentName}</h3>
                            <p>
                                <span
                                    className={
                                        enquiry.status === "NEW" ? "badge badge--sample" : "badge"
                                    }
                                >
                                    {enquiry.status}
                                </span>
                            </p>
                            <p>
                                <strong>Applying for:</strong> {enquiry.applyingFor}
                                <br />
                                <strong>Date of birth:</strong> {enquiry.dateOfBirth}
                                <br />
                                <strong>Parent:</strong> {enquiry.parentName}
                                <br />
                                <strong>Phone:</strong>{" "}
                                <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
                                <br />
                                <strong>Email:</strong>{" "}
                                <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
                                <br />
                                <strong>Received:</strong>{" "}
                                {new Date(enquiry.createdAt).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </p>
                            {enquiry.message && <p>"{enquiry.message}"</p>}

                            <div className="form-group">
                                <label htmlFor={`enquiry-status-${enquiry.id}`}>Status</label>
                                <select
                                    id={`enquiry-status-${enquiry.id}`}
                                    value={enquiry.status}
                                    onChange={(event) =>
                                        handleStatusChange(enquiry.id, event.target.value)
                                    }
                                >
                                    {STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </AsyncState>
    );
}

export default EnquiriesPanel;