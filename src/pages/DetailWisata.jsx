import React, { useEffect, useState } from "react";
import { HeroSection } from "../components/DetailWisata/HeroSection";
import { InformasiWisata } from "../components/DetailWisata/InformasiWisata";
import { GaleriWisata } from "../components/DetailWisata/GaleriWisata";
import { AtraksiWisata } from "../components/DetailWisata/AtraksiWisata";
import { SouvenirWisata } from "../components/DetailWisata/SouvenirWisata";
import axios from "axios";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../config";
import { PenginapanWisata } from "../components/DetailWisata/PenginapanWisata";
import { PaketWisata } from "../components/DetailWisata/PaketWisata";

export const DetailWisata = () => {
  const [desa, setDesa] = useState(null);
  const [deskripsiDesa, setDeskripsiDesa] = useState(null);
  const [deskripsiWisata, setDeskripsiWisata] = useState(null);
  const { kd_desa } = useParams();

  const Spinner = () => (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

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
      }
    };

    fetchData();
  }, [kd_desa]);

  if (loading) return <Spinner />;

  if (!desa || !deskripsiDesa || !deskripsiWisata) {
    return (
      <p className="text-center text-red-500 py-10">
        Gagal memuat informasi desa wisata.
      </p>
    );
  }

  return (
    <>
      <HeroSection image={deskripsiDesa.gambar_cover} />
      <InformasiWisata
        namaDesa={desa.nama_desa}
        lokasi={deskripsiDesa.lokasi_desa}
        deskripsi={deskripsiDesa.deskripsi_desa}
        fasilitas={deskripsiDesa.fasilitas_desa}
        video={deskripsiDesa.url_video}
      />
      <GaleriWisata images={deskripsiDesa.galeri_desa} />
      <AtraksiWisata atraksi={deskripsiWisata.atraksi} />
      <PaketWisata paketWisata={deskripsiWisata.paket_wisata} />
      <PenginapanWisata penginapan={deskripsiWisata.penginapan} />
      <SouvenirWisata souvenir={deskripsiWisata.suvenir} />
    </>
  );
};
