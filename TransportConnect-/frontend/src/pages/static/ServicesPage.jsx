import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Truck, Package } from "../../utils/icons"
import Button from "../../components/ui/Button"
import VisualSection from "../../components/ui/VisualSection"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const ServicesPage = () => {
  const serviceCards = [
    {
      title: "Freight Transport",
      description: "Connect with verified transporters for your shipping needs across Morocco. Real-time tracking and secure payments.",
      image: "/home/2/1.webp",
      accent: "tl-br", // top-left + bottom-right L-shape
    },
    {
      title: "Driver Network",
      description: "Join our network of professional drivers. Flexible schedules, fair pricing, and direct payments.",
      image: "/home/3/1.webp",
      accent: null,
    },
    {
      title: "Secure Platform",
      description: "Your shipments are protected with insurance, verified users, and secure transactions.",
      image: "/home/4/1.webp",
      accent: "tr-bl", // top-right + bottom-left L-shape
    },
  ]

  const skills = [
    { label: "On-time delivery", value: 98 },
    { label: "Verified partners", value: 100 },
    { label: "Customer satisfaction", value: 95 },
    { label: "Coverage", value: 100 },
  ]

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
            <li className="font-medium text-foreground" aria-current="page">Services</li>
          </ol>
        </div>
      </nav>

      {/* Hero — same style as About Us: full-width image, overlay, centered title + CTA */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex flex-col justify-center items-center px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url(/home/2/1.webp)" }}
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-4xl mx-auto text-white">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-white/80 mb-4"
          >
            Our Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase"
          >
            Transport solutions for Morocco
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 sm:mt-10"
          >
            <Link to="/trips">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border border-white/20 uppercase font-semibold tracking-wider px-6 py-3 rounded min-h-[48px]">
                Get started
                <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works — 3 steps */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="section-title mb-3">How it works</h2>
            <p className="section-subtitle mx-auto">Simple steps to get your shipments moving</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              { step: "01", title: "Post your request", desc: "Create a shipping request with details about your cargo" },
              { step: "02", title: "Get matched", desc: "Receive offers from verified drivers in your area" },
              { step: "03", title: "Track & deliver", desc: "Monitor your shipment in real-time until delivery" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg sm:text-xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service cards — 3 columns, L-shaped red accents, image at bottom */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="section-title mb-3">What we offer</h2>
            <p className="section-subtitle mx-auto">Everything you need to streamline your logistics</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {serviceCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* L-shaped accent — top-left + bottom-right */}
                {card.accent === "tl-br" && (
                  <>
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary rounded-tl-2xl z-10" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary rounded-br-2xl z-10" />
                  </>
                )}
                {/* L-shaped accent — top-right + bottom-left */}
                {card.accent === "tr-bl" && (
                  <>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary rounded-tr-2xl z-10" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary rounded-bl-2xl z-10" />
                  </>
                )}
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{card.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="h-48 sm:h-56 relative">
                  <VisualSection
                    type="image"
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    fallbackIcon={Package}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 sm:mt-12 flex justify-center"
          >
            <Link to="/features">
              <Button size="large" variant="outline" className="min-h-[48px] px-6">
                Explore all features
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Company Skills — circular progress indicators */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="section-title mb-3">Our platform strengths</h2>
            <p className="section-subtitle mx-auto">
              Trusted by shippers and drivers across Morocco for reliability, security, and support.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-muted/30"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="text-primary transition-all duration-1000"
                      strokeDasharray={`${skill.value * 2.64} 264`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold text-foreground">
                    {skill.value}%
                  </span>
                </div>
                <p className="mt-4 text-sm sm:text-base font-medium text-foreground text-center">
                  {skill.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-3 sm:mb-4">Ready to get started?</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of shippers and drivers already using TransportConnect
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

export default ServicesPage
