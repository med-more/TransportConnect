import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react"
import Button from "./ui/Button"
import logo from "../assets/logo.svg"

export const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <img src={logo} alt="TransportConnect" className="h-12 sm:h-16 md:h-20 w-auto flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate">TransportConnect</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Revolutionize your transport</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
            <Link to="/about-us" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link to="/login">
              <Button variant="ghost" className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2">Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export const PublicFooter = () => {
  return (
    <footer className="bg-foreground text-white py-12 sm:py-14 md:py-16 px-3 sm:px-4 md:px-6">
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

