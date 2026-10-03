import { useState } from "react";

import AsyncState from "../common/AsyncState.jsx";
import Button from "../common/Button.jsx";
import FormField from "../forms/FormField.jsx";
import useForm from "../../hooks/useForm.js";
import useFetch from "../../hooks/useFetch.js";
import { galleryCategoryIcons } from "../../data/schoolData.js";
import {
    createGalleryItem,
    deleteGalleryItem,
    getGalleryItems,
    updateGalleryItem,
} from "../../services/api.js";

const emptyValues = { title: "", description: "", category: "", imageUrl: "" };

const validate = (values) => {
    const errors = {};
    if (!values.title.trim()) {
        errors.title = "Please enter a title.";
    } else if (values.title.length > 150) {
        errors.title = "Title must be 150 characters or fewer.";
    }
    if (values.description.length > 500) {
        errors.description = "Description must be 500 characters or fewer.";
    }
    if (!values.category) {
        errors.category = "Please select a category.";
    }
    const url = values.imageUrl.trim();
    if (url && !/^https?:\/\/.+/i.test(url)) {
        errors.imageUrl = "The image link must start with http:// or https://.";
    } else if (url.length > 500) {
        errors.imageUrl = "Image link must be 500 characters or fewer.";
    }
    return errors;
};

function GalleryForm({ item, onSaved, onCancel }) {
    const initialValues = item
        ? {
            title: item.title,
            description: item.description || "",
            category: item.category,
            imageUrl: item.imageUrl || "",
        }
        : emptyValues;

    const categories = Array.from(
        new Set([...Object.keys(galleryCategoryIcons), ...(item ? [item.category] : [])])
    );

    const { values, errors, status, feedback, handleChange, handleSubmit } = useForm({
        initialValues,
        validate,
        submit: async (formValues) => {
            const payload = {
                title: formValues.title.trim(),
                description: formValues.description.trim(),
                category: formValues.category,
                imageUrl: formValues.imageUrl.trim(),
            };
            if (item) {
                await updateGalleryItem(item.id, payload);
            } else {
                await createGalleryItem(payload);
            }
            onSaved();
        },
        successMessage: item ? "Gallery item updated." : "Gallery item added.",
    });

    const isSubmitting = status === "submitting";

    return (
        <form onSubmit={handleSubmit} noValidate aria-label="Gallery item form">
            {feedback && (
                <div
                    role={status === "error" ? "alert" : "status"}
                    className={`form-message ${status === "success" ? "form-message--success" : "form-message--error"
                        }`}
                >
                    {feedback}
                </div>
            )}

            <div className="grid grid--2">
                <FormField
                    id="gallery-title"
                    name="title"
                    label="Title"
                    value={values.title}
                    onChange={handleChange}
                    error={errors.title}
                    required
                />
                <FormField
                    id="gallery-category"
                    name="category"
                    label="Category"
                    as="select"
                    options={categories}
                    placeholder="Select category"
                    value={values.category}
                    onChange={handleChange}
                    error={errors.category}
                    required
                />
            </div>
            <FormField
                id="gallery-description"
                name="description"
                label="Description"
                as="textarea"
                rows={3}
                maxLength={500}
                value={values.description}
                onChange={handleChange}
                error={errors.description}
            />
            <FormField
                id="gallery-imageUrl"
                name="imageUrl"
                label="Image Link"
                type="url"
                hint="A link starting with https://. Leave empty to show a placeholder tile."
                value={values.imageUrl}
                onChange={handleChange}
                error={errors.imageUrl}
                autoComplete="off"
            />

            <div className="btn-group">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Item"}
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}

function GalleryPanel({ onChanged }) {
    const { data, loading, error, retry } = useFetch(getGalleryItems);
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

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete "${item.title}"?`)) {
            return;
        }
        setActionError("");
        try {
            await deleteGalleryItem(item.id);
            refresh();
        } catch {
            setActionError("Could not delete the item. Please try again.");
        }
    };

    const items = data || [];

    return (
        <div className="grid">
            <div className="btn-group">
                <Button size="sm" onClick={() => setEditing("new")}>
                    Add Gallery Item
                </Button>
            </div>

            {actionError && (
                <div className="form-message form-message--error" role="alert">
                    {actionError}
                </div>
            )}

            {editing && (
                <div className="card">
                    <h3>{editing === "new" ? "Add Gallery Item" : "Edit Gallery Item"}</h3>
                    <GalleryForm
                        key={editing === "new" ? "new" : editing.id}
                        item={editing === "new" ? null : editing}
                        onSaved={handleSaved}
                        onCancel={() => setEditing(null)}
                    />
                </div>
            )}

            <AsyncState
                loading={loading}
                error={error}
                onRetry={retry}
                loadingText="Loading gallery..."
            >
                {items.length === 0 ? (
                    <p className="section-note">No gallery items yet.</p>
                ) : (
                    <div className="grid grid--2">
                        {items.map((item) => (
                            <article key={item.id} className="card feature-card">
                                <h3>{item.title}</h3>
                                <p>
                                    <span className="badge">{item.category}</span>{" "}
                                    {!item.imageUrl && <span className="badge badge--sample">Placeholder</span>}
                                </p>
                                {item.description && <p>{item.description}</p>}
                                {item.imageUrl && (
                                    <p>
                                        <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                                            Open image
                                        </a>
                                    </p>
                                )}
                                <div className="btn-group">
                                    <Button size="sm" variant="outline" onClick={() => setEditing(item)}>
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDelete(item)}>
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

export default GalleryPanel;