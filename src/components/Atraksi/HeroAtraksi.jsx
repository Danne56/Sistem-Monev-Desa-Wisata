import React, { useEffect, useState } from "react";
import heroAtraksi from "../../assets/Atraksi/heroAtraksi.webp";
import searchIcon from "../../assets/Atraksi/searchIcon.svg";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import Indonesia from "../../data/dataProvinsi";
import { axiosInstance } from "../../config";
import { AtraksiPencarian } from "./AtraksiPencarian";

export const HeroAtraksi = () => {
  const [isOpenProvinsi, setIsOpenProvinsi] = useState(false);
  const [provinsiDipilih, setProvinsiDipilih] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [atraksiData, setAtraksiData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/atraksi-wisata");
        const result = response.data.data;
        setAtraksiData(result);
      } catch (error) {
        console.error("Error fetching atraksi wisata:", error);
      }
    };

    fetchData();
  }, []);

  console.log(atraksiData);

  const handleProvinsiSelect = (option) => {
    setProvinsiDipilih(option);
    setIsOpenProvinsi(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterAtraksiData = () => {
    return atraksiData.filter((item) => {
      const matchesProvinsi = !provinsiDipilih || item.nama_popular?.toLowerCase() === provinsiDipilih.toLowerCase();

      const matchesSearch = !searchQuery || item.atraksi?.some((atraksiItem) => atraksiItem.nama?.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesProvinsi && matchesSearch;
    });
  };

  const handleSearchClick = () => {
    const results = filterAtraksiData();
    setSearchResults(results);
    setIsSearched(true);
  };

  return (
    <section>
      <div>
        <div className="w-full 2xl:h-[550px] lg:h-[450px] md:h-[500px] h-[580px] inset-0 bg-black bg-opacity-40 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${heroAtraksi})` }} />
        <div className="w-full absolute 2xl:top-36 md:top-28 top-32 flex flex-col justify-center sm:p-10 p-4">
          <h2 className="text-white mx-auto max-w-[640px] text-center 2xl:text-[44px] md:text-[40px] text-4xl font-extrabold md:leading-normal leading-normal mb-4">Jelajahi berbagai atraksi dari Desa Wisata di Indonesia</h2>
          <div className="flex mx-auto">
            <div>
              <div className="bg-white flex justify-between items-center px-4 py-6 rounded-l-md md:gap-2 gap-1 max-w-60  border-r-[1px] border-[#D9D9D9] cursor-pointer" onClick={() => setIsOpenProvinsi(!isOpenProvinsi)}>
                <CiLocationOn className="md:text-2xl text-xl" />
                <span className="text-smallText font-semibold md:block hidden">{provinsiDipilih || "Provinsi"}</span>
                {!provinsiDipilih && <IoMdArrowDropdown className="md:text-2xl text-xl md:block hidden" />}
              </div>
              {isOpenProvinsi && (
                <div className="absolute z-50 w-72 max-h-96 overflow-y-scroll mt-1 bg-white shadow-lg rounded-md" onClick={(e) => e.stopPropagation()}>
                  <ul className="p-2">
                    {Indonesia.map((provinsi, index) => (
                      <li className="cursor-pointer hover:bg-gray-100" key={index} onClick={() => handleProvinsiSelect(provinsi.namaProvinsi)}>
                        {provinsi.namaProvinsi}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="search-wrapper flex justify-center">
              <input
                id="search"
                type="text"
                className="input-search border-l-[0.1px] border-gray-300 p-3 outline-none sm:p-4 w-full lg:min-w-[450px] md:min-w-80 sm:min-w-72 min-w-56"
                placeholder="cari disini..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <img src={searchIcon} alt="search-icon" className="p-3 sm:p-4 lg:w-16 md:w-14 w-12 bg-greenMain rounded-r-lg cursor-pointer hover:brightness-90 duration-75" onClick={handleSearchClick} />
            </div>
          </div>
        </div>
      </div>

      {isSearched && <>{searchResults.length > 0 ? <AtraksiPencarian atraksiData={searchResults} /> : <p className="text-center text-lg text-gray-700 mt-20">Atraksi tidak ditemukan</p>}</>}
    </section>
  );
};
