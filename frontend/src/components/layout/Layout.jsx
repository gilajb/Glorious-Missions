import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

/** Persistent page chrome (header/footer) around whichever route matched. */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="w-full pt-20 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
