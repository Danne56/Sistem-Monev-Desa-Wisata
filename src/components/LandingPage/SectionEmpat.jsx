import React from "react";
import fotoTengah from "../../assets/Beranda/fotoTengah.png";

export const SectionEmpat = () => {
  return (
    <section className="my-24 py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">Fitur aplikasi Monev</h2>
        <p className="text-gray-600 mt-4 text-sm sm:text-base max-w-2xl mx-auto">Figma ipsum component variant main layer. Flatten link align move ipsum draft. Edit vector align invite comment pencil.</p>

        {/* Grid 3 kolom */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Kolom kiri: fitur 1 & 3 */}
          <div className="flex flex-col gap-8 text-left">
            {/* Fitur 1 */}
            <div className="flex items-start gap-4">
              <div className="text-green-700 font-extrabold text-xl border-2 border-green-700 px-4 py-2 rounded-full">1</div>
              <div>
                <h3 className="font-bold">Fitur Pertama</h3>
                <p className="text-sm text-gray-600">Figma ipsum component variant main layer. Vector team align undo pencil bullet draft frame.</p>
              </div>
            </div>
            {/* Fitur 3 */}
            <div className="flex items-start gap-4">
              <div className="text-green-700 font-extrabold text-xl border-2 border-green-700 px-4 py-2 rounded-full">3</div>
              <div>
                <h3 className="font-bold">Fitur Ketiga</h3>
                <p className="text-sm text-gray-600">Figma ipsum component variant main layer. Italic background layer move italic.</p>
              </div>
            </div>
          </div>

          {/* Gambar Tengah */}
          <div className="hidden md:flex justify-center">
            <img src={fotoTengah} alt="Mockup" className="w-56 sm:w-64 md:w-72" />
          </div>

          {/* Kolom kanan: fitur 2 & 4 */}
          <div className="flex flex-col gap-8 text-left">
            {/* Fitur 2 */}
            <div className="flex items-start gap-4">
              <div className="text-green-700 font-extrabold text-xl border-2 border-green-700 px-4 py-2 rounded-full">2</div>
              <div>
                <h3 className="font-bold">Fitur Kedua</h3>
                <p className="text-sm text-gray-600">Figma ipsum component variant main layer. Underline connection create vertical align.</p>
              </div>
            </div>
            {/* Fitur 4 */}
            <div className="flex items-start gap-4">
              <div className="text-green-700 font-extrabold text-xl border-2 border-green-700 px-4 py-2 rounded-full">4</div>
              <div>
                <h3 className="font-bold">Fitur Keempat</h3>
                <p className="text-sm text-gray-600">Figma ipsum component variant main layer. Rectangle union scrolling blur vector bullet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
