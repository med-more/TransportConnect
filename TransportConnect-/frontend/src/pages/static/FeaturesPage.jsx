import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Package, Truck, Shield, MapPin, Clock, TrendingUp, CheckCircle, ArrowRight } from "../../utils/icons"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const FeaturesPage = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-Time Tracking",
      description: "Monitor your shipments in real-time with GPS tracking and live updates.",
      details: "Get instant notifications when your shipment is picked up, in transit, or delivered.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data and transactions are protected with enterprise-grade security.",
      details: "SSL encryption, secure payments, and verified user accounts ensure your safety.",
    },
    {
      icon: Truck,
      title: "Verified Drivers",
      description: "All drivers are verified and insured for your peace of mind.",
      details: "Background checks, insurance verification, and rating system for quality assurance.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team.",
      details: "Live chat, phone support, and email assistance available around the clock.",
    },
    {
      icon: TrendingUp,
      title: "Smart Matching",
      description: "AI-powered matching connects you with the best drivers for your route.",
      details: "Optimized route matching based on location, capacity, and pricing preferences.",
    },
    {
      icon: Package,
      title: "Easy Management",
      description: "Manage all your shipments from one intuitive dashboard.",
      details: "Create requests, track shipments, manage payments, and view history in one place.",
    },
  ]

  const additionalFeatures = [
    "Mobile app for iOS and Android",
    "Automated invoicing and billing",
    "Multi-language support",
    "Custom reporting and analytics",
    "API integration",
    "Bulk shipment management",
    "Document management",
    "Email and SMS notifications",
    "Rating and review system",
  ]

  const comparison = [
    { feature: "Real-Time Tracking", traditional: "Limited updates", us: "Live GPS tracking" },
    { feature: "Pricing", traditional: "Fixed rates", us: "Competitive bidding" },
    { feature: "Verification", traditional: "Basic checks", us: "Comprehensive verification" },
    { feature: "Support", traditional: "Business hours", us: "24/7 availability" },
  ]

  const integrations = ["API", "Mobile App", "Web Dashboard", "SMS Alerts"]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />

      {/* Breadcrumb */}
      <nav className="border-b border-border bg-background px-4 sm:px-6 md:px-8 py-3">
        <div className="container mx-auto max-w-6xl">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <li aria-hidden className="text-muted-foreground/60">/</li>
            <li className="font-medium text-foreground" aria-current="page">Features</li>
          </ol>
        </div>
      </nav>

      {/* Hero — same as About Us / Services: full-width image, overlay, centered title + CTA */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex flex-col justify-center items-center px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url(/home/3/1.webp)" }}
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-4xl mx-auto text-white">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-white/80 mb-4"
          >
            Platform
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase"
          >
            Powerful features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl mx-auto"
          >
            Everything you need to streamline your logistics and grow your transport business
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 sm:mt-10"
          >
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border border-white/20 uppercase font-semibold tracking-wider px-6 py-3 rounded min-h-[48px]">
                Get started free
                <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Core Features — 6 cards: first highlighted (primary), rest with glass-card; L-shaped accent on first and last */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">What we offer</p>
            <h2 className="section-title mb-3">Core features</h2>
            <p className="section-subtitle mx-auto">
              Built for shippers and drivers who demand reliability, visibility, and control.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isHighlight = index === 0
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className={`relative rounded-2xl overflow-hidden ${
                    isHighlight
                      ? "bg-primary text-primary-foreground border-2 border-primary shadow-lg"
                      : "bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
                  }`}
                >
                  {index === 0 && (
                    <>
                      <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-primary-foreground/40 rounded-tl-2xl z-10" />
                      <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-primary-foreground/40 rounded-br-2xl z-10" />
                    </>
                  )}
                  {index === 5 && !isHighlight && (
                    <>
                      <div className="absolute top-0 right-0 w-14 h-14 border-t-2 border-r-2 border-primary rounded-tr-2xl z-10" />
                      <div className="absolute bottom-0 left-0 w-14 h-14 border-b-2 border-l-2 border-primary rounded-bl-2xl z-10" />
                    </>
                  )}
                  <div className="p-6 sm:p-8">
                    <div className={`p-3 rounded-xl w-fit mb-4 ${isHighlight ? "bg-white/20" : "bg-primary/10"}`}>
                      <Icon className={`w-6 h-6 ${isHighlight ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${isHighlight ? "text-primary-foreground" : "text-foreground"}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed mb-3 ${isHighlight ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      {feature.description}
                    </p>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isHighlight ? "text-primary-foreground/80" : "text-muted-foreground/90"}`}>
                      {feature.details}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose TransportConnect — comparison cards */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Compare</p>
            <h2 className="section-title mb-3">Why choose TransportConnect?</h2>
            <p className="section-subtitle mx-auto">See how we compare to traditional logistics</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {comparison.map((item, index) => (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="p-6 sm:p-8 h-full glass-card border border-border">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">{item.feature}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Traditional</span>
                      <span className="text-sm font-medium text-foreground">{item.traditional}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-primary">TransportConnect</span>
                      <span className="text-sm font-semibold text-primary">{item.us}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration — 4 pillars */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="section-title mb-3">Seamless integration</h2>
            <p className="section-subtitle mx-auto">Connect with your existing tools and workflows</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {integrations.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="p-6 sm:p-8 text-center glass-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">{item}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More Features — checklist */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="section-title mb-3">More features</h2>
            <p className="section-subtitle mx-auto">Additional capabilities to enhance your experience</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto"
          >
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base text-foreground">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-3 sm:mb-4">Experience all features today</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start using TransportConnect and discover how easy logistics can be
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="large" className="w-full sm:w-auto btn-glow shadow-glow hover:shadow-glow-lg">
                  Get started free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  Contact sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default FeaturesPage
