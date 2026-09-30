import { useEffect, useRef } from "react";

import Button from "../common/Button.jsx";
import { galleryCategoryIcons } from "../../data/schoolData.js";

function GalleryModal({
    item,
    position,
    hasMultiple,
    onClose,
    onPrev,
    onNext,
}) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (item && !dialog.open) {
            dialog.showModal();
        }

        if (!item && dialog.open) {
            dialog.close();
        }
    }, [item]);

    useEffect(() => {
        if (!item) {
            return undefined;
        }

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [item]);

    const handleKeyDown = (event) => {
        if (!hasMultiple) {
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            onPrev();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            onNext();
        }
    };

    const handleBackdropClick = (event) => {
        if (event.target === dialogRef.current) {
            onClose();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="modal"
            aria-labelledby="gallery-modal-title"
            onClose={onClose}
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
        >
            {item && (
                <>
                    <button
                        type="button"
                        className="modal__close"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        &times;
                    </button>

                    {item.imageUrl ? (
                        <img className="modal__image" src={item.imageUrl} alt={item.title} />
                    ) : (
                        <div className="modal__media" aria-hidden="true">
                            {galleryCategoryIcons[item.category] || "🖼️"}
                        </div>
                    )}

                    <div className="modal__body">
                        <span className="badge">{item.category}</span>
                        <h2 id="gallery-modal-title">{item.title}</h2>
                        {item.description && <p>{item.description}</p>}

                        {hasMultiple && (
                            <div className="modal__nav">
                                <Button variant="outline" size="sm" onClick={onPrev}>
                                    Previous
                                </Button>
                                <span className="modal__count">{position}</span>
                                <Button variant="outline" size="sm" onClick={onNext}>
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </dialog>
    );
}

export default GalleryModal;