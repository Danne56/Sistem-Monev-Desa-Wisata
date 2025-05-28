import React, { useState } from "react";
import locationIcon from "../../assets/DetailWisata/icon/location.svg";
import musholla from "../../assets/DetailWisata/icon/mosque.svg";
import arealParkir from "../../assets/DetailWisata/icon/parkirArea.svg";
import spotFoto from "../../assets/DetailWisata/icon/spotFoto.svg";
import selfieArea from "../../assets/DetailWisata/icon/selfieArea.svg";
import jungleTracking from "../../assets/DetailWisata/icon/jungleTracking.svg";
import kamarMandi from "../../assets/DetailWisata/icon/toilet.svg";

const fasilitasIcons = {
  "Areal Parkir": arealParkir,
  "Jungle Tracking": jungleTracking,
  "Kamar Mandi Umum": kamarMandi,
  Mushola: musholla,
  "Selfie Area": selfieArea,
  "Spot Foto": spotFoto,
};

// Konversi URL video YouTube ke embed format
const convertToEmbedUrl = (url) => {
  if (!url?.includes("youtube.com") && !url?.includes("youtu.be")) return "";
  try {
    if (url.includes("youtu.be")) {
      const id = url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch (e) {
    return "";
  }
};

export const InformasiWisata = ({
  namaDesa = "Nama Desa Tidak Diketahui",
  lokasi = "Lokasi tidak tersedia",
  deskripsi = "",
  fasilitas = [],
  video = [],
}) => {
  const [showMore, setShowMore] = useState(false);
  const hasLongDescription = deskripsi?.length > 300;

  return (
    <section className="mb-28 py-10 px-4 lg:px-20 max-w-7xl mx-auto">
      {/* Judul & Lokasi */}
      <h2 className="md:text-5xl sm:text-4xl text-3xl font-bold mb-2">
        {namaDesa}
      </h2>
      <div className="flex items-center text-gray-600 md:text-normal text-sm mb-4">
        <img src={locationIcon} alt="lokasi" className="w-4 h-4 mr-1" />
        {lokasi}
      </div>

      {/* Deskripsi */}
      {deskripsi ? (
        <>
          <p className="text-gray-700 mb-2 lg:text-[18px] md:text-normal text-[15px]">
            {deskripsi.substring(0, 300)}
            {showMore && <>{deskripsi.substring(300)}</>}
          </p>
          {hasLongDescription && (
            <button
              className="text-blue-500 mb-6 md:text-normal text-[15px]"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Tutup ▲" : "Baca lebih ▼"}
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-500 italic mb-6">Deskripsi tidak tersedia.</p>
      )}

      {/* Fasilitas */}
      {Array.isArray(fasilitas) && fasilitas.length > 0 && (
        <>
          <h3 className="md:text-[26px] sm:text-2xl text-body font-bold my-6">
            Fasilitas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10 text-gray-800 md:text-normal text-[15px]">
            {fasilitas.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <img
                  src={fasilitasIcons[item] || arealParkir}
                  alt={`icon ${item}`}
                  className="w-7"
                />
                {item}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Video */}
      {Array.isArray(video) && video.length > 0 && (
        <>
          <h3 className="md:text-[26px] sm:text-2xl text-body font-bold my-6">
            Video
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {video.map((url, idx) => {
              const embedUrl = convertToEmbedUrl(url);
              return embedUrl ? (
                <div
                  key={idx}
                  className="aspect-video w-full rounded-xl overflow-hidden"
                >
                  <iframe
                    className="w-full h-full"
                    src={embedUrl}
                    title={`Video ${idx + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : null;
            })}
          </div>
        </>
      )}
    </section>
  );
};
