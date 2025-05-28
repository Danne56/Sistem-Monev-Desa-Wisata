import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../config";
import { HeroSection } from "../components/DetailWisata/HeroSection";
import { InformasiWisata } from "../components/DetailWisata/InformasiWisata";
import { GaleriWisata } from "../components/DetailWisata/GaleriWisata";
import { AtraksiWisata } from "../components/DetailWisata/AtraksiWisata";
import { SouvenirWisata } from "../components/DetailWisata/SouvenirWisata";
import { PenginapanWisata } from "../components/DetailWisata/PenginapanWisata";
import { PaketWisata } from "../components/DetailWisata/PaketWisata";

export const DetailWisata = () => {
  const [desa, setDesa] = useState(null);
  const [deskripsiDesa, setDeskripsiDesa] = useState(null);
  const [deskripsiWisata, setDeskripsiWisata] = useState(null);
  const [loading, setLoading] = useState(true);

  const { kd_desa } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [desaRes, deskripsiDesaRes, deskripsiWisataRes] =
          await Promise.all([
            axiosInstance.get(`/api/desa-wisata/${kd_desa}`),
            axiosInstance.get(`/api/deskripsi-desa/${kd_desa}`),
            axiosInstance.get(`/api/deskripsi-wisata/${kd_desa}`),
          ]);

        setDesa(desaRes.data.data);
        setDeskripsiDesa(deskripsiDesaRes.data.data);
        setDeskripsiWisata(deskripsiWisataRes.data.data);
      } catch (error) {
        console.error("Gagal memuat data detail desa wisata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kd_desa]);

  if (loading) return <p className="text-center py-10">Memuat data...</p>;

  if (!desa || !deskripsiDesa || !deskripsiWisata) {
    return (
      <p className="text-center text-red-500 py-10">
        Gagal memuat informasi desa wisata.
      </p>
    );
  }

  return (
    <>
      <HeroSection
        image={
          deskripsiDesa.gambar_cover ||
          "https://picsum.photos/1100/600?grayscale"
        }
      />
      <InformasiWisata
        namaDesa={desa.nama_desa}
        lokasi={deskripsiDesa.lokasi_desa || "Lokasi tidak tersedia"}
        deskripsi={deskripsiDesa.deskripsi_desa || ""}
        fasilitas={deskripsiDesa.fasilitas_desa || []}
        video={deskripsiDesa.url_video || []}
      />
      <GaleriWisata images={deskripsiDesa.galeri_desa || []} />
      <AtraksiWisata atraksi={deskripsiWisata.atraksi || []} />
      <PaketWisata paketWisata={deskripsiWisata.paket_wisata || []} />
      <PenginapanWisata penginapan={deskripsiWisata.penginapan || []} />
      <SouvenirWisata souvenir={deskripsiWisata.suvenir || []} />
    </>
  );
};
