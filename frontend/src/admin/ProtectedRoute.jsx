import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./AuthContext";

/** Gates every /admin/* route except /admin/login behind a valid session. */
export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
        <p className="font-body-md text-body-md text-on-surface-variant">Loading…</p>
      </div>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
