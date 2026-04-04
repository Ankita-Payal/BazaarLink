import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, userData } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change / outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const close = (e) => {
      if (!e.target.closest("#navbar-root")) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isMenuOpen]);

  const roleLinks =
    userData?.role === "vendor"
      ? [
          { to: "/bulk-order", label: "Place Order", icon: "🛒" },
          { to: "/my-orders", label: "My Orders", icon: "📦" },
          { to: "/vendor-dashboard", label: "Dashboard", icon: "📊" },
          { to: "/nearby", label: "Nearby Stores", icon: "📍" },
        ]
      : userData?.role === "seller"
        ? [
            { to: "/seller-dashboard", label: "Seller Panel", icon: "🏪" },
            { to: "/seller-orders", label: "Orders", icon: "📋" },
          ]
        : [];

  const authLinks = !user
    ? [
        { to: "/login", label: "Login", variant: "ghost" },
        { to: "/signup", label: "Sign Up", variant: "primary" },
      ]
    : [];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch {
      alert("Logout failed");
    } finally {
      setIsMenuOpen(false);
    }
  };

  const roleBadge = userData?.role === "vendor"
    ? { label: "Vendor", color: "bg-amber-100 text-amber-800 border-amber-300" }
    : userData?.role === "seller"
      ? { label: "Seller", color: "bg-emerald-100 text-emerald-800 border-emerald-300" }
      : null;

  return (
    <nav
      id="navbar-root"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-orange-100"
          : "bg-white border-b border-orange-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Brand ── */}
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2.5 group shrink-0"
          >
            {/* Logo mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-sm group-hover:shadow-orange-200 group-hover:scale-105 transition-all duration-200">
              <span className="text-white font-black text-sm tracking-tight">BB</span>
            </div>

            <div className="leading-none">
              <div className="text-[17px] font-extrabold text-gray-900 tracking-tight group-hover:text-orange-600 transition-colors">
                BazaarLink
              </div>
              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                Bazaar Marketplace
              </div>
            </div>
          </NavLink>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            <DesktopLink to="/" end>Home</DesktopLink>

            {roleLinks.map((link) => (
              <DesktopLink key={link.to} to={link.to}>
                <span className="mr-1">{link.icon}</span>
                {link.label}
              </DesktopLink>
            ))}
          </div>

          {/* ── Desktop Right ── */}
          <div className="hidden md:flex items-center gap-2">
            {roleBadge && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            )}

            {authLinks.map((link) =>
              link.variant === "primary" ? (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-orange-200 transition-all duration-200"
                >
                  {link.label}
                </NavLink>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-gray-600 hover:text-orange-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                >
                  {link.label}
                </NavLink>
              )
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            )}
          </div>

          {/* ── Hamburger ── */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-orange-50 transition-colors gap-[5px]"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-200 ${isMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-orange-100 px-4 pt-3 pb-5 space-y-1">

          {/* Role badge on mobile */}
          {roleBadge && (
            <div className="pb-2 flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
              <span className="text-xs text-gray-400">
                {user?.email}
              </span>
            </div>
          )}

          <MobileLink to="/" end onClick={() => setIsMenuOpen(false)}>🏠 Home</MobileLink>

          {roleLinks.map((link) => (
            <MobileLink key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}>
              {link.icon} {link.label}
            </MobileLink>
          ))}

          {/* Divider */}
          {(authLinks.length > 0 || user) && (
            <div className="border-t border-gray-100 my-2" />
          )}

          {authLinks.map((link) =>
            link.variant === "primary" ? (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl mt-2 shadow-sm"
              >
                {link.label}
              </NavLink>
            ) : (
              <MobileLink key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </MobileLink>
            )
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left text-sm font-medium text-rose-500 hover:bg-rose-50 px-3 py-2.5 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Logout
            </button>
          )}

          {!user && (
            <p className="text-xs text-gray-400 text-center pt-2">
              Guest access — Login to unlock features
            </p>
          )}
        </div>
      </div>
    </nav>
  );
};

/* ── Helper: Desktop NavLink ── */
const DesktopLink = ({ to, children, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "text-orange-600 bg-orange-50 font-semibold"
          : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
      }`
    }
  >
    {children}
  </NavLink>
);

/* ── Helper: Mobile NavLink ── */
const MobileLink = ({ to, children, end, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-2 text-sm font-medium px-3 py-2.5 rounded-xl transition-colors ${
        isActive
          ? "text-orange-600 bg-orange-50 font-semibold"
          : "text-gray-700 hover:bg-gray-50"
      }`
    }
  >
    {children}
  </NavLink>
);

export default Navbar;