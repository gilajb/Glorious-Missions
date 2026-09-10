import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/layout/Layout";
import About from "./pages/About";
import ChurchPlanting from "./pages/ChurchPlanting";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import GetInvolved from "./pages/GetInvolved";
import Home from "./pages/Home";
import Missions from "./pages/Missions";
import NotFound from "./pages/NotFound";
import Prayer from "./pages/Prayer";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/church-planting" element={<ChurchPlanting />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
