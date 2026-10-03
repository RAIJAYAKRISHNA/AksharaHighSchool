import { useState } from "react";

import AsyncState from "../../components/common/AsyncState.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import SectionTitle from "../../components/common/SectionTitle.jsx";
import EnquiriesPanel from "../../components/admin/EnquiriesPanel.jsx";
import EventsPanel from "../../components/admin/EventsPanel.jsx";
import GalleryPanel from "../../components/admin/GalleryPanel.jsx";
import MessagesPanel from "../../components/admin/MessagesPanel.jsx";
import StudentsPanel from "../../components/admin/StudentsPanel.jsx";
import ChangePasswordForm from "../../components/forms/ChangePasswordForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import useFetch from "../../hooks/useFetch.js";
import { getAdminSummary } from "../../services/api.js";

const TABS = [
    { id: "enquiries", label: "Enquiries" },
    { id: "messages", label: "Messages" },
    { id: "students", label: "Students" },
    { id: "events", label: "Events" },
    { id: "gallery", label: "Gallery" },
    { id: "account", label: "My Account" },
];

function AdminDashboard() {
    const { user } = useAuth();
    const summary = useFetch(getAdminSummary);
    const [tab, setTab] = useState("enquiries");

    const stats = summary.data;
    const cards = stats
        ? [
            { icon: "📝", label: "New enquiries", value: stats.newEnquiries },
            { icon: "✉️", label: "Unread messages", value: stats.unreadMessages },
            { icon: "🎓", label: "Students", value: stats.students },
            { icon: "📅", label: "Events", value: stats.events },
            { icon: "🖼️", label: "Gallery items", value: stats.galleryItems },
        ]
        : [];

    return (
        <main>
            <PageHeader
                title="Admin Dashboard"
                subtitle={`Signed in as ${user.username}`}
            />

            <section className="section">
                <div className="container">
                    <AsyncState
                        loading={summary.loading}
                        error={summary.error}
                        onRetry={summary.retry}
                        loadingText="Loading summary..."
                    >
                        <div className="grid grid--4">
                            {cards.map((card) => (
                                <article key={card.label} className="card highlight-card">
                                    <span className="icon-circle" aria-hidden="true">
                                        {card.icon}
                                    </span>
                                    <h3>{card.value}</h3>
                                    <p>{card.label}</p>
                                </article>
                            ))}
                        </div>
                    </AsyncState>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <SectionTitle title="Manage" />

                    <div className="filter-bar" role="group" aria-label="Dashboard sections">
                        {TABS.map((item) => (
                            <Button
                                key={item.id}
                                size="sm"
                                variant={item.id === tab ? "primary" : "outline"}
                                aria-pressed={item.id === tab}
                                onClick={() => setTab(item.id)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </div>

                    {tab === "enquiries" && <EnquiriesPanel onChanged={summary.retry} />}
                    {tab === "messages" && <MessagesPanel onChanged={summary.retry} />}
                    {tab === "students" && <StudentsPanel onChanged={summary.retry} />}
                    {tab === "events" && <EventsPanel onChanged={summary.retry} />}
                    {tab === "gallery" && <GalleryPanel onChanged={summary.retry} />}
                    {tab === "account" && (
                        <div className="card">
                            <h3>Change Password</h3>
                            <ChangePasswordForm />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default AdminDashboard;