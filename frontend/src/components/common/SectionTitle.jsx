function SectionTitle({
    eyebrow,
    title,
    subtitle,
    align = "center",
    light = false,
}) {
    const classes = [
        "section-title",
        `section-title--${align}`,
        light ? "section-title--light" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classes}>
            {eyebrow && <span className="section-title__eyebrow">{eyebrow}</span>}
            <h2 className="section-title__heading">{title}</h2>
            {subtitle && <p className="section-title__subtitle">{subtitle}</p>}
        </div>
    );
}

export default SectionTitle;