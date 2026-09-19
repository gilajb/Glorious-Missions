import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";

// Everything but Home is lazy-loaded: Home is what most visits land on and
// what LCP is measured against, so keeping the other pages out of the
// initial bundle means less JS to parse/execute before the hero can paint.
const About = lazy(() => import("./pages/About"));
const ChurchPlanting = lazy(() => import("./pages/ChurchPlanting"));
const Contact = lazy(() => import("./pages/Contact"));
const Gallery = lazy(() => import("./pages/Gallery"));
const GetInvolved = lazy(() => import("./pages/GetInvolved"));
const Missions = lazy(() => import("./pages/Missions"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Prayer = lazy(() => import("./pages/Prayer"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
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
      </Suspense>
    </BrowserRouter>
  );
}
