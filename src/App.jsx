import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Register } from "./pages/Register";
import { Masuk } from "./pages/Masuk";
import { Home } from "./pages/Home";
import { Footer } from "./components/Footer/Footer";
import { Navbar } from "./components/Navbar/Navbar";
import { Lokasi } from "./pages/Lokasi";
import { Atraksi } from "./pages/Atraksi";
import { DetailWisata } from "./pages/DetailWisata";
import { Navbar2 } from "./components/Navbar/Navbar2";
import { LandingPage } from "./pages/LandingPage";

function AppContent() {
  const location = useLocation();
  const path = location.pathname;

  const specialPaths = ["/masuk", "/register", "/"]; // tambahkan "/" di sini
  const isSpecialPage = specialPaths.includes(path);

  return (
    <>
      {!isSpecialPage && <Navbar />}
      {path === "/masuk" || path === "/register" ? <Navbar2 /> : null}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/masuk" element={<Masuk />} />
        <Route path="/lokasi" element={<Lokasi />} />
        <Route path="/atraksi" element={<Atraksi />} />
        <Route path="/detail" element={<DetailWisata />} />
      </Routes>
      <Footer />
    </>
  );
}

// Komponen utama
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
