import { NavLink, Outlet } from "react-router-dom";

import Icon from "../components/Icon";
import { useAuth } from "./AuthContext";

const NAV_ITEMS = [
  { to: "/admin/gallery", label: "Gallery", icon: "photo_library" },
  { to: "/admin/mission-mondays", label: "Mission Mondays", icon: "campaign" },
];

const linkClassName = ({ isActive }) =>
  [
    "flex items-center gap-space-xs px-space-md py-space-sm rounded-lg font-label-lg text-label-lg transition-colors",
    isActive
      ? "bg-primary-container text-on-primary"
      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
  ].join(" ");

/** Chrome for the whole /admin/* section -- deliberately not the public
 * Navbar/Footer (see App.jsx: admin routes sit outside <Layout />). */
export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-surface-container-low">
      <aside className="w-64 shrink-0 bg-surface-container-lowest border-r border-surface-container-high flex flex-col p-space-md gap-space-lg">
        <div className="px-space-sm pt-space-xs">
          <p className="font-headline-sm text-headline-sm text-on-surface">Admin</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Glorious Missions</p>
        </div>

        <nav className="flex flex-col gap-space-xxs">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={linkClassName}>
              <Icon name={icon} className="text-[20px]" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-space-sm px-space-sm pb-space-xs">
          {user && (
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Signed in as {user.username}
            </p>
          )}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary hover:underline self-start"
          >
            <Icon name="logout" className="text-[18px]" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-space-xl">
        <Outlet />
      </main>
    </div>
  );
}
