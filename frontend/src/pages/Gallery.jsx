import { useMemo, useState } from "react";

import Button from "../components/common/Button.jsx";
import Loading from "../components/common/Loading.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import SectionTitle from "../components/common/SectionTitle.jsx";
import GalleryGrid from "../components/gallery/GalleryGrid.jsx";
import GalleryModal from "../components/gallery/GalleryModal.jsx";
import useFetch from "../hooks/useFetch.js";
import { getGalleryItems } from "../services/api.js";
import { galleryContent } from "../data/schoolData.js";

function Gallery() {
  const { data, loading, error, retry } = useFetch(getGalleryItems);
  const [category, setCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const items = useMemo(() => data || [], [data]);

  const categories = useMemo(
    () => ["All", ...new Set(items.map((item) => item.category))],
    [items]
  );

  const visibleItems = useMemo(
    () =>
      category === "All"
        ? items
        : items.filter((item) => item.category === category),
    [items, category]
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
          <SectionTitle
            eyebrow={galleryContent.eyebrow}
            title={galleryContent.title}
            subtitle={galleryContent.subtitle}
          />

          {loading && <Loading text="Loading photos..." />}

          {!loading && error && (
            <div className="form-message form-message--error" role="alert">
              <p>{error}</p>
              <Button size="sm" variant="outline" onClick={retry}>
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              {items.length > 0 && (
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
              )}

              <GalleryGrid
                items={visibleItems}
                onSelect={(index) => setSelectedIndex(index)}
              />
            </>
          )}
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