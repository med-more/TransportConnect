import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
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
} from "lucide-react"
import Button from "../../components/ui/Button"
import logo from "../../assets/logo.svg"

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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
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

const WelcomePage = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Transport",
      description: "Verified and insured transporters with complete safety protocols",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Direct communication with transporters for instant updates",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Star,
      title: "Reliable Ratings",
      description: "Transparent rating system based on real user experiences",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your packages live with GPS integration",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Active Community",
      description: "Network of professional transporters across Morocco",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Award,
      title: "Verified Partners",
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

  const testimonials = [
    {
      name: "Ahmed Benali",
      role: "Business Owner",
      image: "AB",
      rating: 5,
      text: "TransportConnect has revolutionized how I ship my products. Fast, reliable, and affordable!",
    },
    {
      name: "Fatima Alami",
      role: "E-commerce Manager",
      image: "FA",
      rating: 5,
      text: "The real-time tracking feature is amazing. I always know where my packages are.",
    },
    {
      name: "Youssef Idrissi",
      role: "Professional Driver",
      image: "YI",
      rating: 5,
      text: "As a driver, I've found so many great opportunities. The platform is easy to use and pays well.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Revolutionary Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                Connect with trusted transporters
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                The platform that revolutionizes freight transport in Morocco. Find the perfect transporter or offer your
                services securely with real-time tracking and verified partners.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                  <Button size="large" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90">
                    Get started free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                  <Button variant="outline" size="large" className="w-full sm:w-auto">
                    <Play className="w-4 h-4 mr-2" />
                    Watch demo
                </Button>
              </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">10K+</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active Users</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">4.9/5</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Average Rating</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">500+</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Verified Drivers</p>
                </div>
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
            >
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
                <div className="bg-primary/10 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6 relative z-10">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">Trip Casablanca → Tangier</h3>
                  <div className="space-y-1.5 sm:space-y-2 text-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                      <p className="text-xs sm:text-sm">Departure: March 12, 2025, 14:30</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                      <p className="text-xs sm:text-sm">Capacity: 1200kg available</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                      <p className="text-xs sm:text-sm">Standard delivery</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base md:text-lg">AM</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-sm sm:text-base md:text-lg truncate">Amine Mansouri</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${i < 5 ? "text-warning fill-warning" : "text-muted-foreground"}`}
                          />
                        ))}
                        <span className="text-xs sm:text-sm text-muted-foreground ml-1 sm:ml-2">4.9 (89 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">40DH/kg</p>
                    <p className="text-xs sm:text-sm text-success font-semibold">Competitive price</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 md:px-6 bg-accent/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
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
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-card border border-border rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
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
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
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
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
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
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
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
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
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
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
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
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
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

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/30">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">What Our Users Say</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Join thousands of satisfied customers who trust TransportConnect
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-card border border-border rounded-xl p-4 sm:p-5 md:p-6 h-full">
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 md:mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">{testimonial.image}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section 2 */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
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

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-xl"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">Ready to get started?</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              Join thousands of users who trust TransportConnect for their transport needs. Start today and experience
              the future of logistics.
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

      {/* Footer */}
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
              <p className="text-white/70 text-xs sm:text-sm text-center sm:text-left">
                &copy; {new Date().getFullYear()} TransportConnect. All rights reserved. Made with ❤️ in Morocco.
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
