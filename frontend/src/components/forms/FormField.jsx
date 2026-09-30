function FormField({
    id,
    name,
    label,
    as = "input",
    type = "text",
    value,
    onChange,
    error,
    required = false,
    hint,
    options = [],
    rows = 5,
    placeholder,
    ...rest
}) {
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const describedBy =
        [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") ||
        undefined;

    const sharedProps = {
        id,
        name,
        value,
        onChange,
        "aria-invalid": error ? "true" : "false",
        "aria-required": required ? "true" : undefined,
        "aria-describedby": describedBy,
        ...rest,
    };

    let control;

    if (as === "select") {
        control = (
            <select {...sharedProps}>
                <option value="">{placeholder || "Select an option"}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    } else if (as === "textarea") {
        control = <textarea rows={rows} placeholder={placeholder} {...sharedProps} />;
    } else {
        control = <input type={type} placeholder={placeholder} {...sharedProps} />;
    }

    return (
        <div className="form-group">
            <label htmlFor={id}>
                {label}
                {required && <span aria-hidden="true"> *</span>}
            </label>
            {control}
            {hint && <small id={hintId}>{hint}</small>}
            {error && (
                <span id={errorId} className="form-error">
                    {error}
                </span>
            )}
        </div>
    );
}

export default FormField;