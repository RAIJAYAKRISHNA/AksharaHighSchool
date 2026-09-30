import Button from "../common/Button.jsx";
import FormField from "./FormField.jsx";
import useForm, {
    isValidEmail,
    isValidPhone,
    normalizePhone,
} from "../../hooks/useForm.js";
import { submitContactMessage } from "../../services/api.js";

const initialValues = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
};

const validate = (values) => {
    const errors = {};

    if (values.name.trim().length < 2) {
        errors.name = "Please enter your name.";
    }

    if (!isValidEmail(values.email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (values.phone.trim() && !isValidPhone(values.phone)) {
        errors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (values.subject.trim().length < 3) {
        errors.subject = "Please enter a subject.";
    }

    if (values.message.trim().length < 10) {
        errors.message = "Please write a message of at least 10 characters.";
    } else if (values.message.length > 1000) {
        errors.message = "Message must be 1000 characters or fewer.";
    }

    return errors;
};

const submit = (values) =>
    submitContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() ? normalizePhone(values.phone) : "",
        subject: values.subject.trim(),
        message: values.message.trim(),
    });

function ContactForm() {
    const { values, errors, status, feedback, handleChange, handleSubmit } =
        useForm({
            initialValues,
            validate,
            submit,
            successMessage:
                "Thank you! Your message has been sent. We will get back to you soon.",
        });

    const isSubmitting = status === "submitting";

    return (
        <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
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
                id="contact-name"
                name="name"
                label="Your Name"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                required
                autoComplete="name"
            />

            <div className="grid grid--2">
                <FormField
                    id="contact-email"
                    name="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    autoComplete="email"
                />
                <FormField
                    id="contact-phone"
                    name="phone"
                    label="Phone (optional)"
                    type="tel"
                    hint="10-digit mobile number"
                    value={values.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    autoComplete="tel"
                />
            </div>

            <FormField
                id="contact-subject"
                name="subject"
                label="Subject"
                value={values.subject}
                onChange={handleChange}
                error={errors.subject}
                required
            />

            <FormField
                id="contact-message"
                name="message"
                label="Message"
                as="textarea"
                maxLength={1000}
                value={values.message}
                onChange={handleChange}
                error={errors.message}
                required
            />

            <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}

export default ContactForm;