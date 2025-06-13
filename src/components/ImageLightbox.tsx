import React, { useState, useEffect, useCallback } from 'react';
import styles from './ImageLightbox.module.css';

interface ImageInfo {
  src: string;
  alt: string;
  title?: string;
}

interface ImageLightboxProps {
  images: ImageInfo[];
  startIndex: number;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currentImage = images[currentIndex];

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setIsLoading(true);
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setIsLoading(true);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [currentIndex, images.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, goToPrevious, goToNext]);

  useEffect(() => {
    // Reset loading state when image source changes
    setIsLoading(true);
    const mainImage = new Image();
    mainImage.src = currentImage.src;
    mainImage.onload = () => setIsLoading(false);
    mainImage.onerror = () => {
        setIsLoading(false); // Handle error case, e.g., show a placeholder or error message
        console.error(`Failed to load image: ${currentImage.src}`);
    }

    // Optional: Preload adjacent images for smoother transitions
    if (currentIndex > 0) {
      const prevImage = new Image();
      prevImage.src = images[currentIndex - 1].src;
    }
    if (currentIndex < images.length - 1) {
      const nextImage = new Image();
      nextImage.src = images[currentIndex + 1].src;
    }
  }, [currentIndex, images, currentImage.src]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) {
      return;
    }
    const touchEndX = e.touches[0].clientX;
    const diffX = touchStartX - touchEndX;

    // Check if the swipe is significant enough
    if (Math.abs(diffX) > 50) { // 50px threshold
      if (diffX > 0) { // Swipe left
        goToNext();
      } else { // Swipe right
        goToPrevious();
      }
      setTouchStartX(null); // Reset after a swipe is detected
    }
  };

  const handleTouchEnd = () => {
    // It's generally better to handle swipe logic in onTouchMove 
    // and reset touchStartX there to avoid issues with partial swipes.
    // If you want to ensure it resets if no swipe is detected, you can keep this.
    // setTouchStartX(null); 
  };

  if (!currentImage) {
    return null; 
  }

  return (
    <div
      className={styles.lightboxOverlay}
      onClick={onClose} // Close on overlay click
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-caption"
      aria-describedby="lightbox-image-description"
    >
      <button
        className={`${styles.lightboxButton} ${styles.closeButton}`}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close lightbox"
      >
        &times;
      </button>

      {currentIndex > 0 && (
        <button
          className={`${styles.lightboxButton} ${styles.prevButton}`}
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          aria-label="Previous image"
        >
          &lt;
        </button>
      )}

      {/* Stop propagation on content to prevent closing when clicking image/caption area */}
      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageContainer}>
          {isLoading && <div className={styles.loader} aria-live="polite">Loading...</div>}
          <img
            id="lightbox-image-description"
            src={currentImage.src}
            alt={currentImage.alt}
            className={`${styles.lightboxImage} ${isLoading ? styles.imageLoading : styles.imageLoaded}`}
            style={{ visibility: isLoading ? 'hidden' : 'visible' }} 
          />
        </div>
        {currentImage.title && (
          <div id="lightbox-caption" className={styles.lightboxCaption}>
            {currentImage.title}
          </div>
        )}
      </div>

      {currentIndex < images.length - 1 && (
        <button
          className={`${styles.lightboxButton} ${styles.nextButton}`}
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          aria-label="Next image"
        >
          &gt;
        </button>
      )}
    </div>
  );
};

export default ImageLightbox;
