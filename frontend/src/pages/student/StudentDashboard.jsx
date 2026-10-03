import Button from "../../components/common/Button.jsx";
import AsyncState from "../../components/common/AsyncState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import SectionTitle from "../../components/common/SectionTitle.jsx";
import EventCard from "../../components/events/EventCard.jsx";
import ChangePasswordForm from "../../components/forms/ChangePasswordForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import useFetch from "../../hooks/useFetch.js";
import { getEvents, getStudentProfile } from "../../services/api.js";

function StudentDashboard() {
    const { user, refreshUser } = useAuth();
    const profile = useFetch(getStudentProfile);
    const events = useFetch(getEvents);

    if (user.mustChangePassword) {
        return (
            <main>
                <PageHeader
                    title={`Welcome, ${user.fullName}`}
                    subtitle="Student Dashboard"
                />
                <section className="section">
                    <div className="container">
                        <div className="notice" role="note">
                            <span aria-hidden="true">🔒</span>
                            <p>Please choose a new password to continue.</p>
                        </div>
                        <div className="card">
                            <h3>Set a New Password</h3>
                            <ChangePasswordForm onChanged={refreshUser} />
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    const details = profile.data;
    const upcoming = (events.data || []).slice(0, 4);

    return (
        <main>
            <PageHeader
                title={`Welcome, ${user.fullName}`}
                subtitle="Student Dashboard"
            />

            <section className="section">
                <div className="container">
                    <div className="grid grid--2">
                        <article className="card feature-card">
                            <h3>My Profile</h3>
                            <AsyncState
                                loading={profile.loading}
                                error={profile.error}
                                onRetry={profile.retry}
                                loadingText="Loading your profile..."
                            >
                                {details && (
                                    <>
                                        <p>
                                            <strong>Name</strong>
                                            <br />
                                            {details.fullName}
                                        </p>
                                        <p>
                                            <strong>Admission number</strong>
                                            <br />
                                            {details.admissionNumber}
                                        </p>
                                        <p>
                                            <strong>Class</strong>
                                            <br />
                                            {details.className}
                                            {details.section ? `, Section ${details.section}` : ""}
                                        </p>
                                        {details.guardianName && (
                                            <p>
                                                <strong>Parent or guardian</strong>
                                                <br />
                                                {details.guardianName}
                                            </p>
                                        )}
                                    </>
                                )}
                            </AsyncState>
                        </article>

                        <div className="card">
                            <h3>Change Password</h3>
                            <ChangePasswordForm onChanged={refreshUser} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <SectionTitle
                        eyebrow="School Events"
                        title="Upcoming Events"
                        subtitle="What is happening at Akshara."
                    />
                    <AsyncState
                        loading={events.loading}
                        error={events.error}
                        onRetry={events.retry}
                        loadingText="Loading events..."
                    >
                        {upcoming.length > 0 ? (
                            <div className="grid grid--2">
                                {upcoming.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <p className="section-note">No events to show right now.</p>
                        )}
                    </AsyncState>
                    <div className="section-cta">
                        <Button to="/events" variant="outline">
                            See All Events
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default StudentDashboard;