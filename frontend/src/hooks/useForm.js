import { useState } from "react";

export const normalizePhone = (value) => {
    const compact = value.replace(/[\s\-()]/g, "");
    return compact.replace(/^(\+91|91|0)(?=\d{10}$)/, "");
};

export const isValidPhone = (value) => /^[6-9]\d{9}$/.test(normalizePhone(value));

export const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

const getErrorMessage = (error) => {
    if (!error || !error.response) {
        return "We could not reach the server. Please check your connection and try again.";
    }
    const data = error.response.data;
    return (data && data.message) || "Something went wrong. Please try again later.";
};

function useForm({ initialValues, validate, submit, successMessage }) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle");
    const [feedback, setFeedback] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) =>
            current[name] ? { ...current, [name]: "" } : current
        );

        if (status === "success") {
            setStatus("idle");
            setFeedback("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (status === "submitting") {
            return;
        }

        const form = event.currentTarget;
        const validationErrors = validate(values);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setStatus("error");
            setFeedback("Please correct the highlighted fields and try again.");
            requestAnimationFrame(() => {
                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
            return;
        }

        setErrors({});
        setStatus("submitting");
        setFeedback("");

        try {
            await submit(values);
            setValues(initialValues);
            setStatus("success");
            setFeedback(successMessage);
        } catch (error) {
            const serverErrors = error && error.response && error.response.data
                ? error.response.data.errors
                : null;

            if (serverErrors && typeof serverErrors === "object") {
                setErrors(serverErrors);
            }

            setStatus("error");
            setFeedback(getErrorMessage(error));
        }
    };

    return { values, errors, status, feedback, handleChange, handleSubmit };
}

export default useForm;