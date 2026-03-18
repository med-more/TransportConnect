import { useState, useEffect, useRef } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Sun, Moon, Menu, X, ArrowRight, Lock, User, LogOut } from "../utils/icons"
import Button from "./ui/Button"
import logo from "../assets/logo2.svg"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about-us", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/features", label: "Features" },
  { to: "/contact", label: "Contact" },
]

export const PublicHeader = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)

  const isHomePage = location.pathname === "/"
  const isTransparent = isHomePage && !scrolled
  const isDark = theme === "dark"
  const isDriver = user?.role === "conducteur"
  const isAdmin = user?.role === "admin"
  const dashboardHref = isAdmin ? "/admin" : "/dashboard"

  // Scroll threshold — stay transparent over entire hero
  useEffect(() => {
    if (!isHomePage) { setScrolled(true); return }
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.90)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isHomePage])

  // Close on route change
  useEffect(() => {
    closeMenu()
  }, [location.pathname])

  // Escape key + body scroll lock
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeMenu() }
    if (mobileMenuOpen) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const openMenu = () => {
    setMobileMenuOpen(true)
    setTimeout(() => setMenuVisible(true), 10)
  }
  const closeMenu = () => {
    setMenuVisible(false)
    setTimeout(() => setMobileMenuOpen(false), 300)
  }
  const toggleMenu = () => mobileMenuOpen ? closeMenu() : openMenu()

  // Colour helpers
  const linkBase = "relative text-sm font-medium transition-all duration-200 group"
  const linkColor = isTransparent
    ? "text-white/90 hover:text-white"
    : isDark
      ? "text-white/80 hover:text-white"
      : "text-slate-700 hover:text-slate-900"
  const linkActiveColor = isTransparent
    ? "text-white"
    : isDark ? "text-white" : "text-primary"
  const iconBtn = `p-2 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center ${
    isTransparent
      ? "text-white/80 hover:text-white hover:bg-white/15"
      : isDark
        ? "text-white/80 hover:text-white hover:bg-white/10"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  }`

  return (
    <>
      {/* ─── HEADER BAR ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500 ${
          isTransparent
            ? "bg-transparent"
            : isDark
              ? "bg-black/95 backdrop-blur-md border-b border-white/10 shadow-2xl"
              : "bg-white border-b border-slate-200 shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">

            {/* LOGO --------------------------------------------------- */}
            <Link
              to="/"
              className="flex items-center gap-2.5 flex-shrink-0 group"
              onClick={closeMenu}
            >
              <img
                src={logo}
                alt="TransportConnect"
                className="h-10 sm:h-12 md:h-14 w-auto transition-transform duration-200 group-hover:scale-105"
              />
              <span className={`text-sm sm:text-base md:text-lg font-bold tracking-tight transition-colors duration-300 ${
                isTransparent ? "text-white" : isDark ? "text-white" : "text-slate-900"
              }`}>
                TransportConnect
              </span>
            </Link>

            {/* DESKTOP NAV (md+) -------------------------------------- */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `${linkBase} ${linkColor} px-3 lg:px-4 py-2 rounded-lg ${
                      isActive ? linkActiveColor : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {/* Animated underline indicator */}
                      <span className={`absolute bottom-0.5 left-3 lg:left-4 right-3 lg:right-4 h-0.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? isTransparent ? "bg-white scale-x-100" : "bg-primary scale-x-100"
                          : "scale-x-0 bg-primary"
                      } origin-left`} />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* DESKTOP ACTIONS (md+) ---------------------------------- */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-2 flex-shrink-0">
              {/* Theme toggle */}
              <button type="button" onClick={toggleTheme} className={iconBtn}
                aria-label={isDark ? "Light mode" : "Dark mode"}>
                {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {user ? (
                <div className="flex items-center gap-1.5">
                  <Link to={dashboardHref}>
                    <button type="button" className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isTransparent
                        ? "border border-white/40 text-white hover:bg-white/15"
                        : isDark
                          ? "border border-white/30 text-white/90 hover:bg-white/10"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}>
                      {isDriver ? "My Trips" : isAdmin ? "Admin" : "My Shipments"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <Link to={dashboardHref}>
                    <button type="button" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md">
                      Dashboard <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <button type="button" onClick={() => logout()} className={iconBtn} title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link to="/login">
                    <button type="button" className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isTransparent
                        ? "border border-white/40 text-white hover:bg-white/15"
                        : isDark
                          ? "border border-white/30 text-white/90 hover:bg-white/10"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}>
                      <Lock className="w-3.5 h-3.5" /> Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button type="button" className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                      isTransparent
                        ? "bg-white text-slate-900 hover:bg-white/90"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}>
                      <User className="w-3.5 h-3.5" /> Register
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE ACTIONS ---------------------------------------- */}
            <div className="flex md:hidden items-center gap-0.5">
              <button type="button" onClick={toggleTheme} className={iconBtn}
                aria-label={isDark ? "Light mode" : "Dark mode"}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Animated hamburger */}
              <button
                type="button"
                onClick={toggleMenu}
                className={`relative w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded-xl transition-colors ${
                  isTransparent
                    ? "hover:bg-white/15"
                    : isDark ? "hover:bg-white/10" : "hover:bg-slate-100"
                }`}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                  isTransparent || isDark ? "bg-white" : "bg-slate-800"
                } ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                  isTransparent || isDark ? "bg-white" : "bg-slate-800"
                } ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                  isTransparent || isDark ? "bg-white" : "bg-slate-800"
                } ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MOBILE MENU OVERLAY + DRAWER ───────────────────────────── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
              menuVisible ? "opacity-100" : "opacity-0"
            } ${isDark ? "bg-black/70" : "bg-slate-900/50"} backdrop-blur-sm`}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <nav
            ref={menuRef}
            className={`fixed left-0 right-0 top-0 z-50 md:hidden transition-all duration-300 ease-out ${
              menuVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            } ${isDark ? "bg-black border-b border-white/10" : "bg-white border-b border-slate-200"} shadow-2xl`}
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            {/* Drawer header */}
            <div className={`flex items-center justify-between px-4 h-16 border-b ${isDark ? "border-white/10" : "border-slate-100"}`}>
              <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
                <img src={logo} alt="TransportConnect" className="h-10 w-auto" />
                <span className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  TransportConnect
                </span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                  isDark ? "text-white/80 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
                }`}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <div className="px-3 pt-3 pb-2">
              {navLinks.map(({ to, label }, i) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={closeMenu}
                  style={{ transitionDelay: menuVisible ? `${i * 40}ms` : "0ms" }}
                  className={({ isActive }) =>
                    `flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-medium mb-1 transition-all duration-200 ${
                      isActive
                        ? isDark
                          ? "bg-primary/20 text-white"
                          : "bg-primary/10 text-primary"
                        : isDark
                          ? "text-white/80 hover:text-white hover:bg-white/8"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white" : "bg-primary"}`} />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Divider */}
            <div className={`mx-4 border-t ${isDark ? "border-white/10" : "border-slate-100"}`} />

            {/* Bottom actions */}
            <div className="px-4 py-4 space-y-2.5">
              {/* Theme row */}
              <button
                type="button"
                onClick={() => { toggleTheme(); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isDark ? "text-white/80 hover:bg-white/8" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>

              {/* Auth CTAs */}
              {user ? (
                <div className="space-y-2">
                  <Link to={dashboardHref} onClick={closeMenu} className="block">
                    <button type="button" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors">
                      Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); closeMenu(); }}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium border transition-colors ${
                      isDark ? "border-white/20 text-white/70 hover:bg-white/8" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={closeMenu}>
                    <button type="button" className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-medium border transition-colors ${
                      isDark
                        ? "border-white/20 text-white hover:bg-white/8"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}>
                      <Lock className="w-4 h-4" /> Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <button type="button" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors">
                      <User className="w-4 h-4" /> Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
            {/* Safe area bottom */}
            <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
          </nav>
        </>
      )}

      {/* Spacer for fixed header on non-hero pages */}
      {!isHomePage && <div className="h-16 sm:h-18 md:h-20" />}
    </>
  )
}



export const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white py-12 sm:py-14 md:py-16 px-3 sm:px-4 md:px-6 border-t border-white/10">
      <div className="container mx-auto max-w-7xl">
        {/* Compact mobile footer: only core links */}
        <div className="sm:hidden mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/80">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/for-shippers" className="hover:text-white transition-colors">
              Shippers
            </Link>
            <Link to="/for-drivers" className="hover:text-white transition-colors">
              Drivers
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link to="/login" className="hover:text-white transition-colors">
              Login
            </Link>
          </div>
        </div>

        {/* Full footer grid — desktop/tablet only, no duplicate main-nav links */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand + social */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 mb-4">
              <img src={logo} alt="TransportConnect" className="h-16 sm:h-20 md:h-24 w-auto flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold">TransportConnect</h3>
              </div>
            </Link>
            <p className="text-sm sm:text-base text-white/70 mb-4">
              The reference platform for freight transport in Morocco. Connect with trusted transporters and simplify
              your logistics.
            </p>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* Contact (desktop/tablet) */}
          <div className="space-y-3">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center gap-2 sm:gap-3 text-white/70 text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="break-all">+212 6XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-white/70 text-sm sm:text-base">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="break-all">contact@transportconnect.ma</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-white/70 text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Casablanca, Morocco</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-white/70 text-xs sm:text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} TransportConnect. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <Link to="/privacy-policy" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-white/70 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-white/70 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

