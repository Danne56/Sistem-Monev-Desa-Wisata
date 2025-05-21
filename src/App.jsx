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
import { UserContextProvider } from "./context/UserContext";
import { DashboardDinas } from "./pages/DashboardDinas";
import { DashboardAdmin } from "./pages/DashboardAdmin";
import { DashboardPengelola } from "./pages/DashboardPengelola";

function AppContent() {
  const location = useLocation();
  const path = location.pathname;

  const specialPaths = ["/masuk", "/register"];
  const withoutNavbar = ["/dashboard/dinas", "/dashboard/admin", "/dashboard/pengelola"];
  const isSpecialPage = specialPaths.includes(path);
  const isWithoutNavbar = withoutNavbar.includes(path);

  return (
    <>
      {!isWithoutNavbar && (isSpecialPage ? <Navbar2 /> : <Navbar />)}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/masuk" element={<Masuk />} />
        <Route path="/lokasi" element={<Lokasi />} />
        <Route path="/atraksi" element={<Atraksi />} />
        <Route path="/detail" element={<DetailWisata />} />
        <Route path="/dashboard/dinas" element={<DashboardDinas />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/pengelola" element={<DashboardPengelola />} />
      </Routes>
      <Footer />
    </>
  );
}

// Komponen utama
function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
