import { useMemo, useState } from "react";

import Button from "../components/common/Button.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import GalleryGrid from "../components/gallery/GalleryGrid.jsx";
import GalleryModal from "../components/gallery/GalleryModal.jsx";
import {
  galleryContent,
  sampleGalleryItems,
  sampleNotice,
} from "../data/schoolData.js";

function Gallery() {
  const [category, setCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const categories = useMemo(
    () => ["All", ...new Set(sampleGalleryItems.map((item) => item.category))],
    []
  );

  const visibleItems = useMemo(
    () =>
      category === "All"
        ? sampleGalleryItems
        : sampleGalleryItems.filter((item) => item.category === category),
    [category]
  );

  const selectedItem =
    selectedIndex === null ? null : visibleItems[selectedIndex] || null;

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setSelectedIndex(null);
  };

  const closeViewer = () => setSelectedIndex(null);

  const showPrevious = () =>
    setSelectedIndex(
      (index) => (index - 1 + visibleItems.length) % visibleItems.length
    );

  const showNext = () =>
    setSelectedIndex((index) => (index + 1) % visibleItems.length);

  return (
    <main>
      <PageHeader
        title="Gallery"
        subtitle="Moments from classrooms, activities, sports and celebrations."
      />

      <section className="section">
        <div className="container">
          <div className="notice" role="note">
            <span aria-hidden="true">ℹ️</span>
            <p>{sampleNotice} Photos will be added once the school shares them.</p>
          </div>

          <SectionTitle
            eyebrow={galleryContent.eyebrow}
            title={galleryContent.title}
            subtitle={galleryContent.subtitle}
          />

          <div
            className="filter-bar"
            role="group"
            aria-label="Filter gallery by category"
          >
            {categories.map((name) => (
              <Button
                key={name}
                size="sm"
                variant={name === category ? "primary" : "outline"}
                aria-pressed={name === category}
                onClick={() => handleCategoryChange(name)}
              >
                {name}
              </Button>
            ))}
          </div>

          <GalleryGrid
            items={visibleItems}
            onSelect={(index) => setSelectedIndex(index)}
          />

          <p className="section-note">{galleryContent.note}</p>
        </div>
      </section>

      <GalleryModal
        item={selectedItem}
        position={
          selectedIndex === null
            ? ""
            : `${selectedIndex + 1} of ${visibleItems.length}`
        }
        hasMultiple={visibleItems.length > 1}
        onClose={closeViewer}
        onPrev={showPrevious}
        onNext={showNext}
      />
    </main>
  );
}

export default Gallery;