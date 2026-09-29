import { Link } from "react-router-dom";

function Button({
    children,
    variant = "primary",
    size = "md",
    to,
    href,
    type = "button",
    onClick,
    disabled = false,
    fullWidth = false,
    className = "",
    ...rest
}) {
    const classes = [
        "btn",
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? "btn--full" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    if (to) {
        return (
            <Link to={to} className={classes} {...rest}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
}

export default Button;