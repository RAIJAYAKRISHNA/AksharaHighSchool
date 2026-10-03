import { Navigate } from "react-router-dom";

import Button from "../components/common/Button.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import FormField from "../components/forms/FormField.jsx";
import { getDashboardPath, useAuth } from "../context/AuthContext.jsx";
import useForm from "../hooks/useForm.js";

const initialValues = { username: "", password: "" };

const validate = (values) => {
    const errors = {};
    if (!values.username.trim()) {
        errors.username = "Please enter your username.";
    }
    if (!values.password) {
        errors.password = "Please enter your password.";
    }
    return errors;
};

function Login() {
    const { user, login } = useAuth();

    const { values, errors, status, feedback, handleChange, handleSubmit } = useForm({
        initialValues,
        validate,
        submit: (formValues) => login(formValues.username.trim(), formValues.password),
        successMessage: "Signed in.",
    });

    if (user) {
        return <Navigate to={getDashboardPath(user.role)} replace />;
    }

    const isSubmitting = status === "submitting";

    return (
        <main>
            <PageHeader
                title="Sign In"
                subtitle="Students and school staff can sign in to their dashboard here."
            />

            <section className="section">
                <div className="container">
                    <div className="grid grid--2">
                        <div className="card">
                            <h3>Welcome Back</h3>
                            <form onSubmit={handleSubmit} noValidate aria-label="Sign in">
                                {feedback && (
                                    <div
                                        role={status === "error" ? "alert" : "status"}
                                        className={`form-message ${status === "success"
                                                ? "form-message--success"
                                                : "form-message--error"
                                            }`}
                                    >
                                        {feedback}
                                    </div>
                                )}

                                <FormField
                                    id="login-username"
                                    name="username"
                                    label="Username"
                                    hint="Students: your admission number"
                                    value={values.username}
                                    onChange={handleChange}
                                    error={errors.username}
                                    required
                                    autoComplete="username"
                                />
                                <FormField
                                    id="login-password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    required
                                    autoComplete="current-password"
                                />

                                <Button type="submit" fullWidth disabled={isSubmitting}>
                                    {isSubmitting ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>
                        </div>

                        <div className="card feature-card">
                            <h3>Need Help Signing In?</h3>
                            <p>
                                Student accounts are created by the school office. If you have
                                not received your admission number and temporary password, or
                                you have forgotten your password, please contact the school
                                office.
                            </p>
                            <Button to="/contact" variant="outline">
                                Contact the School
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;