import { useState } from "react";
import { NavLink } from "react-router-dom";

import Icon from "../Icon";
import Logo from "../Logo";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/mission-mondays", label: "Mission Mondays" },
  { to: "/gallery", label: "Gallery" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/contact", label: "Contact" },
];

const linkClassName = ({ isActive }) =>
  [
    "px-space-sm py-space-xs transition-colors rounded-lg font-label-lg text-label-lg",
    isActive
      ? "bg-surface-container text-primary font-semibold"
      : "text-on-surface-variant hover:text-on-surface",
  ].join(" ");

const mobileLinkClassName = ({ isActive }) =>
  [
    "px-space-md py-space-sm transition-colors rounded-lg font-label-lg text-label-lg",
    isActive
      ? "bg-surface-container text-primary font-semibold"
      : "text-on-surface-variant hover:text-on-surface",
  ].join(" ");

export default function Navbar() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md shadow-[0_2px_12px_rgba(26,23,21,0.04)]">
        <div className="h-20 w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto flex items-center justify-between gap-space-md">
          <NavLink to="/" aria-label="Glorious Missions home">
            <Logo />
          </NavLink>

          <nav className="hidden lg:flex items-center gap-space-xs xl:gap-space-sm">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClassName}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-space-sm md:gap-space-md">
            <NavLink
              to="/get-involved"
              className="inline-flex items-center justify-center px-space-lg py-space-xs bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-all transform active:scale-95"
            >
              <Icon name="volunteer_activism" className="text-[18px] mr-space-xs" />
              <span>Donate</span>
            </NavLink>

            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isDrawerOpen}
              onClick={() => setDrawerOpen((open) => !open)}
              className="lg:hidden p-space-xs text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
            >
              <Icon name="menu" className="text-[28px]" />
            </button>
          </div>
        </div>

        <div className="h-[3px] w-full bg-surface-variant overflow-hidden">
          <div className="h-full w-full shuka-stripe" />
        </div>
      </header>

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-surface shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-20 px-margin-mobile flex items-center justify-between border-b border-surface-container-highest">
          <Logo size="sm" />
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeDrawer}
            className="p-space-xs text-on-surface-variant hover:text-on-surface"
          >
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>

        <div className="h-[2px] w-full shuka-stripe" />

        <nav className="flex-1 overflow-y-auto px-space-md py-space-lg flex flex-col gap-space-xs">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={mobileLinkClassName} onClick={closeDrawer}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-space-lg bg-surface-container-low">
          <NavLink
            to="/get-involved"
            onClick={closeDrawer}
            className="w-full inline-flex items-center justify-center px-space-lg py-space-md bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-md hover:opacity-95 transition-all"
          >
            <Icon name="volunteer_activism" className="text-[20px] mr-space-xs" />
            <span>Support the Mission</span>
          </NavLink>
        </div>
      </div>

      {isDrawerOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeDrawer}
          className="fixed inset-0 z-40 bg-on-background/40 lg:hidden"
        />
      )}
    </>
  );
}
