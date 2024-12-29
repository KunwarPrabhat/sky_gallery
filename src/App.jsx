import React, { useState, useEffect } from "react";
import "./App.css";
import cupcakeImage from "./assets/cupcake.png"; // Import cupcake image
import { screenshots } from "./imageImports";
import musicFile from "./music/Still_Corners.mp3";

const audio = new Audio(musicFile);

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loadedIndexes, setLoadedIndexes] = useState([0]); // Images to preload initially

  // Toggle gallery
  const toggleGallery = () => {
    setIsOpen(!isOpen);
  };

  const closeGallery = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      audio.pause(); // Stop music
    }, 600);
  };

  // Handle cupcake click animation
  const handleCupcakeClick = () => {
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 300); // Reset after animation
    toggleGallery();

    if (audio.paused) {
      audio.play(); // Play music
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    // Preload first, last, and next image
    const nextIndex = (currentIndex + 1) % screenshots.length;
    const lastIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
    setLoadedIndexes([currentIndex, nextIndex, lastIndex]);
  };

  // Preload remaining images after animation
  useEffect(() => {
    if (isOpen && !isClicking) {
      const allIndexes = screenshots.map((_, index) => index);
      setLoadedIndexes(allIndexes); // Load all images
    }
  }, [isOpen, isClicking]);

  // Navigate to next image
  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % screenshots.length;
    setCurrentIndex(nextIndex);

    // Add next image to loadedIndexes if not already loaded
    setLoadedIndexes((prev) => [...new Set([...prev, nextIndex])]);
  };

  // Navigate to previous image
  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
    setCurrentIndex(prevIndex);

    // Add previous image to loadedIndexes if not already loaded
    setLoadedIndexes((prev) => [...new Set([...prev, prevIndex])]);
  };

  return (
    <div className={`app ${isOpen ? "dark-bg" : ""}`}>
      {/* Cupcake */}
      <div
        className={`cupcake ${isClicking ? "clicking" : ""}`}
        onClick={handleCupcakeClick}
      >
        <img src={cupcakeImage} alt="Cupcake" className="cupcake-image" />
      </div>

      {/* Gallery Slider */}
      {isOpen && (
        <div className={`slider ${isClosing ? "closing" : ""}`}>
          <button className="close-btn" onClick={closeGallery}>
            ✖
          </button>
          <button className="nav-btn prev" onClick={prevImage}>
            &#8249;
          </button>
          <div className="slides">
            {screenshots.map((src, index) => {
              const shouldLoad = loadedIndexes.includes(index);
              let position;

              if (index === currentIndex) {
                position = "active"; // Current image
              } else if (
                index ===
                (currentIndex - 1 + screenshots.length) % screenshots.length
              ) {
                position = "prev"; // Previous image
              } else if (index === (currentIndex + 1) % screenshots.length) {
                position = "next"; // Next image
              } else {
                position = "hidden"; // All other images
              }

              return (
                <img
                  key={index}
                  src={shouldLoad ? src : undefined} // Load only if included in loadedIndexes
                  alt={`Screenshot ${index + 1}`}
                  className={`slide ${position}`}
                  style={{
                    visibility: shouldLoad ? "visible" : "hidden", // Hide unloaded images
                  }}
                />
              );
            })}
          </div>
          <button className="nav-btn next" onClick={nextImage}>
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
