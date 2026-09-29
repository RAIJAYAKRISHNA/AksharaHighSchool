function Loading({ text = "Loading...", fullPage = false }) {
    const classes = ["loading", fullPage ? "loading--full" : ""]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classes} role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true"></span>
            <span className="loading__text">{text}</span>
        </div>
    );
}

export default Loading;