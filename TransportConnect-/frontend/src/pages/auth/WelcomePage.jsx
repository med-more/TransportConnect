import { Link } from "react-router-dom"
import { motion, useScroll, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import {
  Truck,
  MessageCircle,
  Star,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  MapPin,
  Package,
  CheckCircle,
  TrendingUp,
  Award,
  Zap,
  Globe,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Play,
  User,
  ChevronLeft,
  ChevronRight,
} from "../../utils/icons"
import Button from "../../components/ui/Button"
import logo from "../../assets/logo.svg"
import { PublicHeader } from "../../components/PublicLayout"

// Image Card Component for "Our Platform in Action" section
const ImageCard = ({ item, index }) => {
  const [imageError, setImageError] = useState(false)
  const [currentFormat, setCurrentFormat] = useState(0)
  
  // Try different image formats: webp, png, jpg, jpeg
  const formats = ['webp', 'png', 'jpg', 'jpeg']
  const imagePath = `/home/1/${item}.${formats[currentFormat]}`
  
  const handleImageError = () => {
    if (currentFormat < formats.length - 1) {
      // Try next format
      setCurrentFormat(currentFormat + 1)
    } else {
      // All formats failed, show fallback
      setImageError(true)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ ...transitionSmooth, delay: index * 0.06 }}
      viewport={viewportDefaults}
      className="relative group overflow-hidden rounded-xl aspect-[4/3] cursor-pointer"
    >
      {!imageError ? (
        <>
          {/* Background Image */}
          <img
            src={imagePath}
            alt={`TransportConnect transforming logistics in Morocco ${item}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
            loading="lazy"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
          {/* Bottom label */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 via-black/40 to-transparent">
            <p className="text-white font-semibold text-sm sm:text-base">Transport Service {item}</p>
          </div>
        </>
      ) : (
        <>
          {/* Fallback gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 group-hover:from-primary/30 group-hover:to-blue-500/30 transition-all duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Truck className="w-24 h-24 text-primary/40 group-hover:text-primary/60 transition-colors" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white font-semibold text-sm sm:text-base">Transport Service {item}</p>
          </div>
        </>
      )}
    </motion.div>
  )
}

const viewportDefaults = { once: true, amount: 0.2 }
const transitionSmooth = { duration: 0.6, ease: [0.22, 1, 0.36, 1] }

const WelcomePage = () => {
  const heroRef = useRef(null)
  const { scrollYProgress: pageProgress } = useScroll()

  const features = [
    {
      icon: Shield,
      title: "Secure Transport",
      benefit: "Your cargo in safe hands",
      description: "Verified and insured transporters with complete safety protocols",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      benefit: "Stay in the loop, every step",
      description: "Direct communication with transporters for instant updates",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Star,
      title: "Reliable Ratings",
      benefit: "Choose with confidence",
      description: "Transparent rating system based on real user experiences",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      benefit: "Know where your shipment is, always",
      description: "Track your packages live with GPS integration",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Active Community",
      benefit: "Find capacity when you need it",
      description: "Network of professional transporters across Morocco",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Award,
      title: "Verified Partners",
      benefit: "No surprises—only vetted drivers",
      description: "All transporters are verified and background checked",
      color: "from-indigo-500 to-indigo-600",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up as a shipper or driver in minutes",
      icon: User,
    },
    {
      number: "02",
      title: "Post or Browse",
      description: "Create a request or find available trips",
      icon: Package,
    },
    {
      number: "03",
      title: "Connect & Negotiate",
      description: "Chat with transporters and agree on terms",
      icon: MessageCircle,
    },
    {
      number: "04",
      title: "Track & Deliver",
      description: "Monitor your shipment in real-time",
      icon: MapPin,
    },
  ]

  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "50K+", label: "Successful Deliveries", icon: CheckCircle },
    { number: "4.9", label: "Average Rating", icon: Star },
    { number: "500+", label: "Verified Drivers", icon: Shield },
  ]

  const heroSlides = [
    {
      title: "Smarter Transport. Faster Deliveries. Nationwide Reach.",
      description:
        "Experience technology-driven transport solutions built for speed, safety, and efficiency — from freight and logistics to last-mile delivery.",
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80",
      imageUrlMobile: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&h=1200&q=80",
    },
    {
      title: "Connect with Verified Transporters. Ship with Confidence.",
      description:
        "We connect shippers and transporters across Morocco with real-time tracking, secure payments, and a network you can trust.",
      imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=80",
      imageUrlMobile: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&h=1200&q=80",
    },
    {
      title: "Your Cargo. On Time. Every Time.",
      description:
        "Verified drivers, transparent ratings, and direct chat — so your shipments get there safely and on schedule.",
      imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1920&q=80",
      imageUrlMobile: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&h=1200&q=80",
    },
  ]

  const [heroSlide, setHeroSlide] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setHeroSlide((s) => (s + 1) % heroSlides.length), 6000)
    return () => clearInterval(t)
  }, [heroSlides.length])

  const heroStats = [
    { number: "25+", label: "Years of Logistics Expertise" },
    { number: "1.2M+", label: "Successful Deliveries" },
    { number: "180+", label: "Global Shipping Destinations" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX: pageProgress }}
      />

      <PublicHeader />

      {/* Hero: single section, fully responsive — mobile image on small screens, desktop image on sm+ */}
      <section
        ref={heroRef}
        className="relative min-h-[85dvh] sm:min-h-[88vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden"
      >
        {/* Mobile background (trucks/transport, optimized for small screens) */}
        <div
          className="absolute inset-0 sm:hidden bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{ backgroundImage: `url(${heroSlides[heroSlide].imageUrlMobile || heroSlides[heroSlide].imageUrl})` }}
        />
        {/* Desktop background (same as before) */}
        <div
          className="absolute inset-0 hidden sm:block bg-cover bg-no-repeat transition-opacity duration-500"
          style={{
            backgroundImage: `url(${heroSlides[heroSlide].imageUrl})`,
            backgroundPosition: "right center",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/75 dark:bg-black/70 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

        <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col min-h-[85dvh] sm:min-h-[88vh] lg:min-h-[90vh] justify-between">
          <div className="flex-1 flex flex-col justify-center pt-2 sm:pt-4 min-h-0">
            <div className="max-w-2xl w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3 sm:space-y-4 md:space-y-6"
                >
                  <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.12] tracking-tight">
                    {heroSlides[heroSlide].title}
                  </h1>
                  <p className="text-sm min-[400px]:text-base sm:text-lg md:text-xl text-white/85 leading-relaxed max-w-xl">
                    {heroSlides[heroSlide].description}
                  </p>
                  <div className="flex flex-col xs:flex-row gap-3 mt-4 sm:mt-6 md:mt-8">
                    <Link to="/register" className="inline-flex w-full xs:w-auto">
                      <Button
                        size="large"
                        className="w-full sm:w-auto min-h-[48px] bg-white text-slate-900 hover:bg-white/95 border-0 shadow-lg px-6"
                      >
                        Plan Your Trip
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex-shrink-0">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 min-w-0">
              {heroStats.map((item) => (
                <div key={item.label} className="text-left min-w-0">
                  <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white truncate">{item.number}</p>
                  <p className="text-[10px] min-[400px]:text-xs sm:text-sm text-white/70 mt-0.5 line-clamp-2 sm:line-clamp-none">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end sm:justify-end gap-2 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setHeroSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
                className="min-w-[44px] min-h-[44px] p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                onClick={() => setHeroSlide((s) => (s + 1) % heroSlides.length)}
                className="min-w-[44px] min-h-[44px] p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="h-0.5 w-6 sm:w-8 md:w-12 bg-primary rounded-full flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-white/90 tabular-nums min-w-[1.5rem]">
                {String(heroSlide + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee – Trust strip (Awwwards-style) - always dark for contrast */}
      <section className="relative py-4 sm:py-5 border-y border-border bg-slate-900 dark:bg-black overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap text-white/90 text-sm sm:text-base font-medium tracking-wide"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[
            "Trusted across Morocco",
            "•",
            "Verified drivers",
            "•",
            "Real-time tracking",
            "•",
            "Secure payments",
            "•",
            "10K+ users",
            "•",
            "4.9/5 rating",
            "•",
            "24/7 support",
          ]
            .concat([
              "Trusted across Morocco",
              "•",
              "Verified drivers",
              "•",
              "Real-time tracking",
              "•",
              "Secure payments",
              "•",
              "10K+ users",
              "•",
              "4.9/5 rating",
              "•",
              "24/7 support",
            ])
            .map((item, i) => (
              <span key={i} className="mx-4 sm:mx-6 inline-block">
                {item}
              </span>
            ))}
        </motion.div>
      </section>

      {/* Find your shipment — category cards only */}
      <section className="py-10 sm:py-14 md:py-16 px-3 sm:px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ...transitionSmooth, delay: 0.1 }}
            viewport={viewportDefaults}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6"
          >
            {[
              { label: "Freight", icon: Truck },
              { label: "Express", icon: Zap },
              { label: "Pallet", icon: Package },
              { label: "Fragile", icon: Shield },
            ].map((item, i) => (
              <Link key={item.label} to="/trips" className="block">
                <div className="rounded-2xl border-2 border-border bg-card p-4 sm:p-5 hover:border-primary/50 hover:shadow-md transition-all duration-300 text-center">
                  <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-2" />
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Thousands Choose TransportConnect — WANDER.ph clone: heading + stats circles + 3 feature cards */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={transitionSmooth}
              viewport={viewportDefaults}
              className="lg:col-span-5"
            >
              <h2 className="section-title mb-4 text-2xl sm:text-3xl md:text-4xl">
                Why Thousands of Travelers Choose TransportConnect
              </h2>
              <p className="section-subtitle mb-6">
                Discover reliable freight across Morocco with verified drivers, real-time tracking, and hassle-free booking—all in one platform.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={transitionSmooth}
              viewport={viewportDefaults}
              className="lg:col-span-7 space-y-6"
            >
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {[
                  { number: "12k+", label: "Happy & Satisfied Users" },
                  { number: "10+", label: "Years Logistics Experience" },
                  { number: "50+", label: "Cities Covered in Morocco" },
                ].map((stat, i) => (
                  <div key={stat.label} className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl sm:text-2xl font-bold text-primary">{stat.number}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: MapPin, title: "Local Expertise", desc: "Network of verified drivers across Morocco" },
                  { icon: Package, title: "All-in-One Booking", desc: "From request to delivery in one platform" },
                  { icon: Clock, title: "24/7 Support", desc: "Get help whenever you need it" },
                ].map((item, i) => (
                  <div key={item.title} className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Routes — WANDER Top Destinations clone */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transitionSmooth}
            viewport={viewportDefaults}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="section-title mb-3">Popular Routes</h2>
            <p className="section-subtitle mx-auto">From city to city across Morocco—find your next shipment or trip.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { from: "Casablanca", to: "Rabat", price: "from 150€", desc: "Express freight | Central Morocco", rating: "4.9", reviews: "2.1k", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80" },
              { from: "Marrakech", to: "Agadir", price: "from 280€", desc: "Coastal route | South Morocco", rating: "4.8", reviews: "1.8k", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80" },
              { from: "Fès", to: "Tanger", price: "from 220€", desc: "North corridor | Northern Morocco", rating: "4.9", reviews: "1.2k", image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80" },
              { from: "Oujda", to: "Casablanca", price: "from 450€", desc: "Long haul | East to West", rating: "4.7", reviews: "890", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80" },
            ].map((route, i) => (
              <motion.div
                key={`${route.from}-${route.to}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...transitionSmooth, delay: i * 0.08 }}
                viewport={viewportDefaults}
              >
                <Link to="/trips" className="block group">
                  <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={route.image} alt={`${route.from} to ${route.to}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 right-3 px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg text-xs font-semibold text-foreground shadow">{route.price}</span>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="font-bold text-foreground mb-1">{route.from} → {route.to}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{route.desc}</p>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-medium text-foreground">{route.rating}</span>
                        <span className="text-muted-foreground">({route.reviews})</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportDefaults} className="mt-8 text-center">
            <Link to="/trips"><Button variant="outline" size="large">View more routes <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </motion.div>
        </div>
      </section>

      {/* Booking made as easy as 1-2-3 — WANDER clone */}
      <section className="py-10 sm:py-14 md:py-16 px-3 sm:px-4 md:px-6 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transitionSmooth}
            viewport={viewportDefaults}
            className="section-title mb-10 sm:mb-12"
          >
            Booking made as easy as 1-2-3.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            {[
              { step: "1", title: "Pick Your Route", desc: "Search trips or post your request" },
              { step: "2", title: "Customize Your Shipment", desc: "Choose capacity, dates & price" },
              { step: "3", title: "Confirm & Track", desc: "Pay securely and track in real-time" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...transitionSmooth, delay: i * 0.1 }}
                viewport={viewportDefaults}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl sm:text-2xl font-bold mb-4">{item.step}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 md:px-6 bg-muted/50 dark:bg-muted">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ ...transitionSmooth, delay: index * 0.08 }}
                  viewport={viewportDefaults}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-full mb-2 sm:mb-3 md:mb-4">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">{stat.number}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transitionSmooth}
            viewport={viewportDefaults}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Why choose TransportConnect?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              A complete platform that simplifies freight transport with innovative and secure features.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ ...transitionSmooth, delay: index * 0.07 }}
                  viewport={viewportDefaults}
                >
                  <div className="bg-card border border-border rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm font-medium text-primary mb-2">{feature.benefit}</p>
                    <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bento highlight – Awwwards-style */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={transitionSmooth}
              viewport={viewportDefaults}
              className="md:col-span-2 md:row-span-2 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-end min-h-[200px] sm:min-h-[280px] md:min-h-[320px]"
            >
              <p className="text-white/80 text-sm sm:text-base font-medium uppercase tracking-widest mb-2">
                One platform
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-xl">
                Ship smarter. Not harder.
              </h2>
              <p className="text-white/90 mt-4 text-base sm:text-lg max-w-md">
                From request to delivery—verified drivers, live tracking, and secure payments.
              </p>
            </motion.div>
            <Link to="/for-shippers">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...transitionSmooth, delay: 0.08 }}
                viewport={viewportDefaults}
                className="h-full rounded-2xl sm:rounded-3xl border-2 border-border bg-card p-6 sm:p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[160px] sm:min-h-[180px]"
              >
                <Package className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">For Shippers</h3>
                <p className="text-sm text-muted-foreground mt-1">Post requests, compare offers, track deliveries.</p>
                <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm mt-4">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            </Link>
            <Link to="/for-drivers">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...transitionSmooth, delay: 0.12 }}
                viewport={viewportDefaults}
                className="h-full rounded-2xl sm:rounded-3xl border-2 border-border bg-card p-6 sm:p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[160px] sm:min-h-[180px]"
              >
                <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">For Drivers</h3>
                <p className="text-sm text-muted-foreground mt-1">Fill your truck, get paid, grow your business.</p>
                <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm mt-4">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transitionSmooth}
            viewport={viewportDefaults}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">Our Platform in Action</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              See how TransportConnect is transforming logistics across Morocco
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <ImageCard key={item} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={transitionSmooth}
              viewport={viewportDefaults}
              className="relative"
            >
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img
                  src="/home/2/1.webp"
                  alt="Real-time tracking system - Track Your Shipments in Real-Time"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Subtle overlay for better visual integration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ ...transitionSmooth, delay: 0.1 }}
              viewport={viewportDefaults}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Track Your Shipments in Real-Time
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                Our advanced GPS tracking system allows you to monitor your packages from pickup to delivery. Get instant
                notifications and updates throughout the journey.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "Live GPS tracking on all shipments",
                  "Instant notifications and updates",
                  "Detailed delivery timeline",
                  "Photo confirmation on delivery",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transitionSmooth}
            viewport={viewportDefaults}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Get started in just 4 simple steps
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ ...transitionSmooth, delay: index * 0.08 }}
                  viewport={viewportDefaults}
                  className="relative"
                >
                  <div className="bg-card border border-border rounded-xl p-4 sm:p-5 md:p-6 text-center relative z-10">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary/10 absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4">{step.number}</div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 relative z-10">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border z-0">
                      <ArrowRight className="w-4 h-4 text-primary absolute -right-2 -top-1.5" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Image Showcase Section 2 */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={transitionSmooth}
              viewport={viewportDefaults}
              className="space-y-4 sm:space-y-6 order-2 lg:order-1"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Secure and Verified Transport Network
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                All our drivers are thoroughly verified and background checked. We ensure the highest standards of
                safety and reliability for every shipment.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "Background checks on all drivers",
                  "Vehicle verification and insurance",
                  "24/7 customer support",
                  "Secure payment processing",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ ...transitionSmooth, delay: 0.1 }}
              viewport={viewportDefaults}
              className="relative order-1 lg:order-2"
            >
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img
                  src="/home/3/1.webp"
                  alt="Secure and Verified Transport Network"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Subtle overlay for better visual integration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Image Gallery Section 2 */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transitionSmooth}
            viewport={viewportDefaults}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">Success Stories</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              See how businesses are growing with TransportConnect
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {[1, 2].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...transitionSmooth, delay: index * 0.12 }}
                viewport={viewportDefaults}
                className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/9] shadow-xl group cursor-pointer"
              >
                <img
                  src={`/home/4/${item}.webp`}
                  alt={`Success Story ${item} - TransportConnect`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
                {/* Bottom content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">Success Story {item}</h3>
                  <p className="text-sm sm:text-base text-white/90">Thousands of successful deliveries</p>
                </div>
              </motion.div>
            ))}
                </div>
              </div>
      </section>

      {/* Testimonial – Awwwards-style quote block - always dark for contrast */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 bg-slate-900 dark:bg-black text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transitionSmooth}
            viewport={viewportDefaults}
          >
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white/95">
              “TransportConnect cut our logistics headaches in half. We ship across Morocco every week—reliable,
              transparent, and simple.”
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                YM
              </div>
              <div className="text-left sm:text-center">
                <p className="font-semibold text-white">Youssef M.</p>
                <p className="text-sm text-white/70">Operations Manager, Casablanca</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-muted/50 dark:bg-muted">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transitionSmooth}
            viewport={viewportDefaults}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-xl"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">Ship with confidence—get started in 2 minutes</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              Join 10,000+ shippers and drivers. Create your free account, post a trip or request, and move your first shipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="large" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90">
                  Create free account
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  Sign in
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - always dark for contrast */}
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
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default WelcomePage
