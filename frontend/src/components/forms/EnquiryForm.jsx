import Button from "../common/Button.jsx";
import FormField from "./FormField.jsx";
import useForm, {
    isValidEmail,
    isValidPhone,
    normalizePhone,
} from "../../hooks/useForm.js";
import { submitEnquiry } from "../../services/api.js";
import { applyingForOptions } from "../../data/schoolData.js";

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

const initialValues = {
    studentName: "",
    dateOfBirth: "",
    applyingFor: "",
    parentName: "",
    phone: "",
    email: "",
    message: "",
};

const validate = (values) => {
    const errors = {};

    if (values.studentName.trim().length < 2) {
        errors.studentName = "Please enter the student's name.";
    }

    if (!values.dateOfBirth) {
        errors.dateOfBirth = "Please select the date of birth.";
    } else {
        const age =
            (Date.now() - new Date(values.dateOfBirth).getTime()) / MS_PER_YEAR;

        if (Number.isNaN(age)) {
            errors.dateOfBirth = "Please enter a valid date of birth.";
        } else if (age < 0) {
            errors.dateOfBirth = "Date of birth cannot be in the future.";
        } else if (age < 2 || age > 20) {
            errors.dateOfBirth = "Please check the date of birth.";
        }
    }

    if (!values.applyingFor) {
        errors.applyingFor = "Please select the class you are applying for.";
    }

    if (values.parentName.trim().length < 2) {
        errors.parentName = "Please enter the parent or guardian's name.";
    }

    if (!isValidPhone(values.phone)) {
        errors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (!isValidEmail(values.email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (values.message.length > 1000) {
        errors.message = "Message must be 1000 characters or fewer.";
    }

    return errors;
};

const submit = (values) =>
    submitEnquiry({
        studentName: values.studentName.trim(),
        dateOfBirth: values.dateOfBirth,
        applyingFor: values.applyingFor,
        parentName: values.parentName.trim(),
        phone: normalizePhone(values.phone),
        email: values.email.trim(),
        message: values.message.trim(),
    });

function EnquiryForm() {
    const { values, errors, status, feedback, handleChange, handleSubmit } =
        useForm({
            initialValues,
            validate,
            submit,
            successMessage:
                "Thank you! Your enquiry has been received. Our team will contact you soon.",
        });

    const today = new Date().toISOString().split("T")[0];
    const isSubmitting = status === "submitting";

    return (
        <form onSubmit={handleSubmit} noValidate aria-label="Admission enquiry form">
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
                id="enquiry-studentName"
                name="studentName"
                label="Student Name"
                value={values.studentName}
                onChange={handleChange}
                error={errors.studentName}
                required
                autoComplete="off"
            />

            <div className="grid grid--2">
                <FormField
                    id="enquiry-dateOfBirth"
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    max={today}
                    value={values.dateOfBirth}
                    onChange={handleChange}
                    error={errors.dateOfBirth}
                    required
                />
                <FormField
                    id="enquiry-applyingFor"
                    name="applyingFor"
                    label="Applying For"
                    as="select"
                    options={applyingForOptions}
                    placeholder="Select class"
                    value={values.applyingFor}
                    onChange={handleChange}
                    error={errors.applyingFor}
                    required
                />
            </div>

            <FormField
                id="enquiry-parentName"
                name="parentName"
                label="Parent Name"
                value={values.parentName}
                onChange={handleChange}
                error={errors.parentName}
                required
                autoComplete="name"
            />

            <div className="grid grid--2">
                <FormField
                    id="enquiry-phone"
                    name="phone"
                    label="Phone"
                    type="tel"
                    hint="10-digit mobile number"
                    value={values.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                    autoComplete="tel"
                />
                <FormField
                    id="enquiry-email"
                    name="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    autoComplete="email"
                />
            </div>

            <FormField
                id="enquiry-message"
                name="message"
                label="Message"
                as="textarea"
                placeholder="Tell us anything you would like us to know (optional)"
                maxLength={1000}
                value={values.message}
                onChange={handleChange}
                error={errors.message}
            />

            <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Enquiry"}
            </Button>
        </form>
    );
}

export default EnquiryForm;