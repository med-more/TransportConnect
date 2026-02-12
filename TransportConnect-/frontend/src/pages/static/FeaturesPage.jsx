import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Package, Truck, Shield, MapPin, Clock, TrendingUp, CheckCircle, ArrowRight } from "../../utils/icons"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import VisualSection from "../../components/ui/VisualSection"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const FeaturesPage = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-Time Tracking",
      description: "Monitor your shipments in real-time with GPS tracking and live updates",
      details: "Get instant notifications when your shipment is picked up, in transit, or delivered.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data and transactions are protected with enterprise-grade security",
      details: "SSL encryption, secure payments, and verified user accounts ensure your safety.",
    },
    {
      icon: Truck,
      title: "Verified Drivers",
      description: "All drivers are verified and insured for your peace of mind",
      details: "Background checks, insurance verification, and rating system for quality assurance.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team",
      details: "Live chat, phone support, and email assistance available around the clock.",
    },
    {
      icon: TrendingUp,
      title: "Smart Matching",
      description: "AI-powered matching connects you with the best drivers for your route",
      details: "Optimized route matching based on location, capacity, and pricing preferences.",
    },
    {
      icon: Package,
      title: "Easy Management",
      description: "Manage all your shipments from one intuitive dashboard",
      details: "Create requests, track shipments, manage payments, and view history all in one place.",
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

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
                Powerful Features
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Everything you need to streamline your logistics and grow your transport business
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full h-64 sm:h-80 md:h-96"
            >
              <VisualSection
                type="image"
                src="/home/2/1.webp"
                alt="Platform Features"
                className="w-full h-full rounded-lg"
                fallbackIcon={Shield}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 sm:p-8 hover:shadow-lg transition-all duration-300 h-full border border-border">
                    <div className="p-3 bg-primary/5 rounded-lg w-fit mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 leading-relaxed">{feature.description}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">{feature.details}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Why Choose TransportConnect?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              See how we compare to traditional logistics
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              { feature: "Real-Time Tracking", traditional: "Limited updates", us: "Live GPS tracking" },
              { feature: "Pricing", traditional: "Fixed rates", us: "Competitive bidding" },
              { feature: "Verification", traditional: "Basic checks", us: "Comprehensive verification" },
              { feature: "Support", traditional: "Business hours", us: "24/7 availability" },
            ].map((item, index) => (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 sm:p-8 border border-border">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">{item.feature}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Traditional</span>
                      <span className="text-sm text-foreground">{item.traditional}</span>
                    </div>
                    <div className="flex justify-between items-center">
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

      {/* Integration Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Seamless Integration
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with your existing tools and workflows
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {["API", "Mobile App", "Web Dashboard", "SMS Alerts"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="p-6 sm:p-8 border border-border hover:shadow-lg transition-shadow">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">{item}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              More Features
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Additional capabilities to enhance your experience
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm sm:text-base text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 sm:mb-6">
              Experience All Features Today
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start using TransportConnect and discover how easy logistics can be
            </p>
            <Link to="/register">
              <Button size="large">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default FeaturesPage
