import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Sun, Moon, Menu, X, ArrowRight } from "../utils/icons"
import Button from "./ui/Button"
import logo from "../assets/logo.svg"
import { useTheme } from "../contexts/ThemeContext"

const heroNavLinks = [
  { to: "/", label: "Home" },
  { to: "/about-us", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/features", label: "Features" },
  { to: "/contact", label: "Contact" },
]

export const PublicHeader = () => {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isDark = theme === "dark"

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md pt-[env(safe-area-inset-top)] ${
        isDark ? "bg-slate-900/95 dark:bg-black/95 border-white/10" : "bg-white border-border"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={logo}
              alt="TransportConnect"
              className={`h-10 sm:h-12 md:h-14 w-auto flex-shrink-0 ${isDark ? "brightness-0 invert" : ""}`}
            />
            <div className="min-w-0">
              <h1
                className={`text-base sm:text-lg md:text-xl font-bold truncate ${isDark ? "text-white" : "text-foreground"}`}
              >
                TransportConnect
              </h1>
            </div>
          </Link>

          {/* Desktop nav - center links with active state */}
          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
            {heroNavLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : isDark
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-foreground hover:bg-slate-100"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop: theme + two CTAs */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isDark ? "text-white/90 hover:text-white hover:bg-white/10" : "text-foreground hover:bg-slate-100"
              }`}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/trips">
              <Button
                variant="outline"
                size="medium"
                className={
                  isDark
                    ? "border-white/60 text-white hover:bg-white/10 hover:border-white/80 hover:text-white"
                    : "border-border text-foreground hover:bg-slate-50"
                }
              >
                Track Shipment
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="medium" className="bg-primary hover:bg-primary/90 text-white">
                Get in touch
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isDark ? "text-white/90 hover:bg-white/10" : "text-foreground hover:bg-slate-100"
              }`}
              aria-label={isDark ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isDark ? "text-white hover:bg-white/10" : "text-foreground hover:bg-slate-100"
              }`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            className={`fixed left-0 right-0 top-[4.5rem] z-50 md:hidden border-b shadow-xl max-h-[calc(100vh-4.5rem)] overflow-y-auto ${
              isDark ? "bg-slate-900 dark:bg-black border-white/10" : "bg-white border-border"
            }`}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {heroNavLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-3 px-3 rounded-lg text-base font-medium transition-colors ${
                      isActive ? "bg-primary text-white" : isDark ? "text-white/90 hover:bg-white/10" : "text-foreground hover:bg-slate-100"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className={`border-t my-2 ${isDark ? "border-white/10" : "border-border"}`} />
              <button
                type="button"
                onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                className={`py-3 px-3 rounded-lg text-base font-medium text-left w-full flex items-center gap-2 ${
                  isDark ? "text-white/90 hover:bg-white/10" : "text-foreground hover:bg-slate-100"
                }`}
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <div className={`border-t my-2 ${isDark ? "border-white/10" : "border-border"}`} />
              <Link to="/trips" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button
                  variant="outline"
                  className={`w-full justify-center py-3 text-base ${isDark ? "border-white/60 text-white" : "border-border text-foreground"}`}
                >
                  Track Shipment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full justify-center py-3 text-base bg-primary text-white">
                  Get in touch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  )
}

export const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white py-12 sm:py-14 md:py-16 px-3 sm:px-4 md:px-6 border-t border-white/10">
      <div className="container mx-auto max-w-7xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-2 sm:gap-3 mb-4">
              <img src={logo} alt="TransportConnect" className="h-12 sm:h-16 md:h-20 w-auto brightness-0 invert flex-shrink-0" />
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

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/70 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/services" className="text-white/70 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/for-shippers" className="text-white/70 hover:text-white transition-colors">
                  For Shippers
                </Link>
              </li>
              <li>
                <Link to="/for-drivers" className="text-white/70 hover:text-white transition-colors">
                  For Drivers
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-white/70 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-white/70 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
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

