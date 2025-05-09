import React from "react";
import Rintisan from "../../assets/LandingPage/Rintisan.png";
import Berkembang from "../../assets/LandingPage/Berkembang.png";
import Maju from "../../assets/LandingPage/Maju.png";
// import Mandiri from "../../assets/LandingPage/Mandiri.png";

export const SectionDua = () => {
  const klasifikasi = [
    {
      img: Rintisan,
      title: "Rintisan",
      desc: "Desa wisata yang baru mulai beroperasi dan masih dalam lingkup yang terbatas",
    },
    {
      img: Berkembang,
      title: "Berkembang",
      desc: "Menunjukkan desa wisata yang telah stabil dan memiliki kepengurusan yang jelas",
    },
    {
      img: Maju,
      title: "Maju",
      desc: "Memiliki peran aktif terhadap perkembangan ekonomi warga desa dan sekitarnya",
    },
    {
      img: Rintisan,
      title: "Mandiri",
      desc: "Klasifikasi ketika desa wisata sudah memiliki pengunjung dari lingkup yang lebih luas",
    },
  ];

  return (
    <section className="px-6 py-12 md:py-16 lg:py-20 bg-green-50">
      <div className="max-w-7xl mx-auto text-center">
        {/* Subtitle */}
        <p className="text-green-700 text-sm font-semibold mb-2 uppercase tracking-wider">Pembagian Kelas</p>
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Klasifikasi Desa Wisata</h2>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {klasifikasi.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Numbered Circle */}
              <div className="relative mb-4">
                <div className="h-20 w-20 bg-greenMain text-white flex items-center justify-center rounded-full text-3xl top-16 font-bold z-10 relative">{index + 1}</div>
              </div>
              {/* Image */}
              <div className="p-2 border-2 border-dashed border-greenMain rounded-full">
                <div className="bg-white px-8 py-6 rounded-full border-8 border-greenMain">
                  <img src={item.img} alt={item.title} className="h-24 mb-4" />
                </div>
              </div>
              {/* Title */}
              <h3 className="text-green-700 text-lg mt-4 mb-2 font-extrabold">{item.title}</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
