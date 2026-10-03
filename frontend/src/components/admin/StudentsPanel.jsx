import { useState } from "react";

import AsyncState from "../common/AsyncState.jsx";
import Button from "../common/Button.jsx";
import FormField from "../forms/FormField.jsx";
import useForm, { isValidPhone, normalizePhone } from "../../hooks/useForm.js";
import useFetch from "../../hooks/useFetch.js";
import { applyingForOptions } from "../../data/schoolData.js";
import {
    activateStudent,
    createStudent,
    deactivateStudent,
    getAdminStudents,
    resetStudentPassword,
    updateStudent,
} from "../../services/api.js";

const emptyValues = {
    admissionNumber: "",
    fullName: "",
    className: "",
    section: "",
    guardianName: "",
    guardianPhone: "",
};

const validate = (values) => {
    const errors = {};
    const admission = values.admissionNumber.trim();

    if (admission.length < 3 || admission.length > 30 || !/^[A-Za-z0-9/-]+$/.test(admission)) {
        errors.admissionNumber = "Use 3 to 30 letters, numbers, / or -.";
    }
    if (values.fullName.trim().length < 2) {
        errors.fullName = "Please enter the student's name.";
    }
    if (!values.className) {
        errors.className = "Please select the class.";
    }
    if (values.section.length > 10) {
        errors.section = "Section must be 10 characters or fewer.";
    }
    if (values.guardianName.length > 100) {
        errors.guardianName = "Guardian name must be 100 characters or fewer.";
    }
    if (values.guardianPhone.trim() && !isValidPhone(values.guardianPhone)) {
        errors.guardianPhone = "Please enter a valid 10-digit mobile number.";
    }
    return errors;
};

function StudentForm({ student, onSaved, onCancel }) {
    const initialValues = student
        ? {
            admissionNumber: student.admissionNumber,
            fullName: student.fullName,
            className: student.className,
            section: student.section || "",
            guardianName: student.guardianName || "",
            guardianPhone: student.guardianPhone || "",
        }
        : emptyValues;

    const { values, errors, status, feedback, handleChange, handleSubmit } = useForm({
        initialValues,
        validate,
        submit: async (formValues) => {
            const payload = {
                admissionNumber: formValues.admissionNumber.trim(),
                fullName: formValues.fullName.trim(),
                className: formValues.className,
                section: formValues.section.trim(),
                guardianName: formValues.guardianName.trim(),
                guardianPhone: formValues.guardianPhone.trim()
                    ? normalizePhone(formValues.guardianPhone)
                    : "",
            };
            const response = student
                ? await updateStudent(student.id, payload)
                : await createStudent(payload);
            onSaved(response.data, !student);
        },
        successMessage: student ? "Student updated." : "Student created.",
    });

    const isSubmitting = status === "submitting";

    return (
        <form onSubmit={handleSubmit} noValidate aria-label="Student form">
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
                    id="student-admissionNumber"
                    name="admissionNumber"
                    label="Admission Number"
                    hint="This is the student's login username"
                    value={values.admissionNumber}
                    onChange={handleChange}
                    error={errors.admissionNumber}
                    required
                    autoComplete="off"
                />
                <FormField
                    id="student-fullName"
                    name="fullName"
                    label="Student Name"
                    value={values.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    required
                    autoComplete="off"
                />
            </div>

            <div className="grid grid--2">
                <FormField
                    id="student-className"
                    name="className"
                    label="Class"
                    as="select"
                    options={applyingForOptions}
                    placeholder="Select class"
                    value={values.className}
                    onChange={handleChange}
                    error={errors.className}
                    required
                />
                <FormField
                    id="student-section"
                    name="section"
                    label="Section"
                    value={values.section}
                    onChange={handleChange}
                    error={errors.section}
                    autoComplete="off"
                />
            </div>

            <div className="grid grid--2">
                <FormField
                    id="student-guardianName"
                    name="guardianName"
                    label="Parent or Guardian Name"
                    value={values.guardianName}
                    onChange={handleChange}
                    error={errors.guardianName}
                    autoComplete="off"
                />
                <FormField
                    id="student-guardianPhone"
                    name="guardianPhone"
                    label="Parent or Guardian Phone"
                    type="tel"
                    value={values.guardianPhone}
                    onChange={handleChange}
                    error={errors.guardianPhone}
                    autoComplete="off"
                />
            </div>

            <div className="btn-group">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Student"}
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}

function StudentsPanel({ onChanged }) {
    const { data, loading, error, retry } = useFetch(getAdminStudents);
    const [editing, setEditing] = useState(null);
    const [credentials, setCredentials] = useState(null);
    const [copied, setCopied] = useState(false);
    const [actionError, setActionError] = useState("");

    const refresh = () => {
        retry();
        onChanged();
    };

    const showCredentials = (student, temporaryPassword) => {
        setCopied(false);
        setCredentials({ admissionNumber: student.admissionNumber, temporaryPassword });
    };

    const handleSaved = (result, isNew) => {
        if (isNew) {
            showCredentials(result.student, result.temporaryPassword);
        }
        setEditing(null);
        refresh();
    };

    const handleToggle = async (student) => {
        setActionError("");
        try {
            if (student.enabled) {
                await deactivateStudent(student.id);
            } else {
                await activateStudent(student.id);
            }
            refresh();
        } catch {
            setActionError("Could not change the account status. Please try again.");
        }
    };

    const handleReset = async (student) => {
        if (!window.confirm(`Reset the password for ${student.fullName}?`)) {
            return;
        }
        setActionError("");
        try {
            const response = await resetStudentPassword(student.id);
            showCredentials(response.data.student, response.data.temporaryPassword);
            refresh();
        } catch {
            setActionError("Could not reset the password. Please try again.");
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(credentials.temporaryPassword);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    const students = data || [];

    return (
        <div className="grid">
            <div className="btn-group">
                <Button size="sm" onClick={() => setEditing("new")}>
                    Add Student
                </Button>
            </div>

            {credentials && (
                <div className="notice" role="status">
                    <span aria-hidden="true">🔑</span>
                    <div>
                        <p>
                            <strong>Save these sign-in details now. The password is shown only once.</strong>
                        </p>
                        <p>
                            Admission number: <strong>{credentials.admissionNumber}</strong>
                            <br />
                            Temporary password: <strong>{credentials.temporaryPassword}</strong>
                        </p>
                        <div className="btn-group">
                            <Button size="sm" onClick={handleCopy}>
                                {copied ? "Copied" : "Copy password"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setCredentials(null)}>
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {actionError && (
                <div className="form-message form-message--error" role="alert">
                    {actionError}
                </div>
            )}

            {editing && (
                <div className="card">
                    <h3>{editing === "new" ? "Add Student" : "Edit Student"}</h3>
                    <StudentForm
                        key={editing === "new" ? "new" : editing.id}
                        student={editing === "new" ? null : editing}
                        onSaved={handleSaved}
                        onCancel={() => setEditing(null)}
                    />
                </div>
            )}

            <AsyncState
                loading={loading}
                error={error}
                onRetry={retry}
                loadingText="Loading students..."
            >
                {students.length === 0 ? (
                    <p className="section-note">No students yet. Use "Add Student" to create the first one.</p>
                ) : (
                    <div className="grid grid--2">
                        {students.map((student) => (
                            <article key={student.id} className="card feature-card">
                                <h3>{student.fullName}</h3>
                                <p>
                                    <span className={student.enabled ? "badge" : "badge badge--sample"}>
                                        {student.enabled ? "Active" : "Deactivated"}
                                    </span>{" "}
                                    {student.mustChangePassword && (
                                        <span className="badge badge--sample">Has not changed password</span>
                                    )}
                                </p>
                                <p>
                                    <strong>Admission number:</strong> {student.admissionNumber}
                                    <br />
                                    <strong>Class:</strong> {student.className}
                                    {student.section ? `, Section ${student.section}` : ""}
                                    {student.guardianName && (
                                        <>
                                            <br />
                                            <strong>Guardian:</strong> {student.guardianName}
                                        </>
                                    )}
                                    {student.guardianPhone && (
                                        <>
                                            <br />
                                            <strong>Phone:</strong> {student.guardianPhone}
                                        </>
                                    )}
                                </p>
                                <div className="btn-group">
                                    <Button size="sm" variant="outline" onClick={() => setEditing(student)}>
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleReset(student)}>
                                        Reset Password
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleToggle(student)}>
                                        {student.enabled ? "Deactivate" : "Activate"}
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

export default StudentsPanel;