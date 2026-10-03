import Button from "../common/Button.jsx";
import FormField from "./FormField.jsx";
import useForm from "../../hooks/useForm.js";
import { changePassword } from "../../services/api.js";

const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const validate = (values) => {
    const errors = {};

    if (!values.currentPassword) {
        errors.currentPassword = "Please enter your current password.";
    }

    if (values.newPassword.length < 8 || values.newPassword.length > 64) {
        errors.newPassword = "Password must be 8 to 64 characters.";
    } else if (!/[A-Za-z]/.test(values.newPassword) || !/\d/.test(values.newPassword)) {
        errors.newPassword = "Password must include at least one letter and one number.";
    }

    if (values.confirmPassword !== values.newPassword) {
        errors.confirmPassword = "The two passwords do not match.";
    }

    return errors;
};

function ChangePasswordForm({ onChanged }) {
    const { values, errors, status, feedback, handleChange, handleSubmit } = useForm({
        initialValues,
        validate,
        submit: async (formValues) => {
            await changePassword({
                currentPassword: formValues.currentPassword,
                newPassword: formValues.newPassword,
            });
            if (onChanged) {
                await onChanged();
            }
        },
        successMessage: "Your password has been changed.",
    });

    const isSubmitting = status === "submitting";

    return (
        <form onSubmit={handleSubmit} noValidate aria-label="Change password">
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
                id="cp-current"
                name="currentPassword"
                label="Current Password"
                type="password"
                value={values.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
                required
                autoComplete="current-password"
            />
            <FormField
                id="cp-new"
                name="newPassword"
                label="New Password"
                type="password"
                hint="8 to 64 characters, with at least one letter and one number"
                value={values.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                required
                autoComplete="new-password"
            />
            <FormField
                id="cp-confirm"
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
            />

            <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Change Password"}
            </Button>
        </form>
    );
}

export default ChangePasswordForm;