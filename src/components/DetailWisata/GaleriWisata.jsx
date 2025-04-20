import React, { useRef, useEffect, useState } from "react";
import GaleriNglanggeran1 from "../../assets/DetailWisata/GaleriNglanggeran1.png";
import GaleriNglanggeran2 from "../../assets/DetailWisata/GaleriNglanggeran2.png";
import arrowRight from "../../assets/DetailWisata/icon/arrowRight.svg";

const images = [GaleriNglanggeran1, GaleriNglanggeran2, GaleriNglanggeran1, GaleriNglanggeran2];

export const GaleriWisata = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef(null);

  // Clone the first image and append it to the end for seamless loop
  const loopImages = [...images, images[0]];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleTransitionEnd = () => {
      if (currentIndex === images.length) {
        // Reset position without animation
        slider.style.transition = "none";
        setCurrentIndex(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            slider.style.transition = "transform 0.6s ease-in-out";
          });
        });
      }
      setIsTransitioning(false);
    };

    slider.addEventListener("transitionend", handleTransitionEnd);
    return () => slider.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentIndex]);

  return (
    <section className="bg-green-900 py-28 px-4 sm:px-10 w-full overflow-hidden">
      <h2 className="text-white font-semibold md:text-[26px] sm:text-2xl text-body text-center mb-4">Galeri</h2>

      <div className="relative max-w-full flex justify-center items-center">
        <div className="relative w-full max-w-[1100px] h-[60vw] sm:h-[680px] overflow-hidden rounded-lg">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              width: `${loopImages.length * 100}%`,
              transform: `translateX(-${(currentIndex * 100) / loopImages.length}%)`,
            }}
          >
            {loopImages.map((img, idx) => (
              <img key={idx} src={img} alt={`Galeri ${idx}`} className="w-full max-w-[1100px] flex-shrink-0 h-full object-cover" />
            ))}
          </div>

          <button onClick={handleNext} className="absolute top-1/2 right-4 transform -translate-y-1/2  transition">
            <img src={arrowRight} alt="Next" className="w-10 h-10" />
          </button>
        </div>
      </div>
    </section>
  );
};
