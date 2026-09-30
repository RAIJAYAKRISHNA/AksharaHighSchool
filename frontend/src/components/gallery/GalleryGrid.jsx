const GalleryGrid = ({ images = [] }) => {
    return (
        <div className="gallery-grid">
            {images.map((image, index) => (
                <div className="gallery-item" key={image.id || index}>
                    <img
                        src={image.src}
                        alt={image.alt || "Akshara High School"}
                    />
                </div>
            ))}
        </div>
    );
};

export default GalleryGrid;