import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import { AuthProvider } from "./admin/AuthContext";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./admin/ProtectedRoute";

// Everything but Home is lazy-loaded: Home is what most visits land on and
// what LCP is measured against, so keeping the other pages out of the
// initial bundle means less JS to parse/execute before the hero can paint.
const About = lazy(() => import("./pages/About"));
const ChurchPlanting = lazy(() => import("./pages/ChurchPlanting"));
const Contact = lazy(() => import("./pages/Contact"));
const Gallery = lazy(() => import("./pages/Gallery"));
const GetInvolved = lazy(() => import("./pages/GetInvolved"));
// Renamed on the public site to "Mission Mondays" (route/nav/copy only --
// the file, component, and backend app/model all stay "Missions" internally).
const Missions = lazy(() => import("./pages/Missions"));
const MissionMondayDetail = lazy(() => import("./pages/MissionMondayDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Prayer = lazy(() => import("./pages/Prayer"));

const GalleryManager = lazy(() => import("./admin/gallery/GalleryManager"));
const GalleryForm = lazy(() => import("./admin/gallery/GalleryForm"));
const MissionMondayManager = lazy(() => import("./admin/missions/MissionMondayManager"));
const MissionMondayForm = lazy(() => import("./admin/missions/MissionMondayForm"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/mission-mondays" element={<Missions />} />
              <Route path="/mission-mondays/:id" element={<MissionMondayDetail />} />
              {/* Kept for anyone with the old link bookmarked/indexed. */}
              <Route path="/missions" element={<Navigate to="/mission-mondays" replace />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/church-planting" element={<ChurchPlanting />} />
              <Route path="/prayer" element={<Prayer />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* A React Router path on this SPA, unrelated to Django's own
                /admin/ site (which lives on a different origin entirely). */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="gallery" replace />} />
                <Route path="gallery" element={<GalleryManager />} />
                <Route path="gallery/new" element={<GalleryForm />} />
                <Route path="gallery/:id/edit" element={<GalleryForm />} />
                <Route path="mission-mondays" element={<MissionMondayManager />} />
                <Route path="mission-mondays/new" element={<MissionMondayForm />} />
                <Route path="mission-mondays/:id/edit" element={<MissionMondayForm />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
