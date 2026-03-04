import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Package, Search, Shield, Clock, TrendingUp, CheckCircle, ArrowRight } from "../../utils/icons"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const ForShippersPage = () => {
  const benefits = [
    { icon: Search, title: "Find Transporters Easily", description: "Browse verified drivers and compare prices in real-time." },
    { icon: Shield, title: "Secure Transactions", description: "Your shipments are protected with insurance and verified partners." },
    { icon: Clock, title: "Real-Time Tracking", description: "Monitor your shipments from pickup to delivery with live updates." },
    { icon: TrendingUp, title: "Competitive Pricing", description: "Get the best rates by comparing multiple transport offers." },
  ]

  const features = [
    "Post shipping requests in minutes",
    "Compare prices from multiple drivers",
    "Real-time shipment tracking",
    "Secure payment processing",
    "24/7 customer support",
    "Verified and insured drivers",
    "Flexible scheduling options",
    "Transparent pricing",
  ]

  const testimonials = [
    { name: "Ahmed Benali", company: "Tech Solutions", quote: "TransportConnect has revolutionized how we handle our logistics. Fast, reliable, and cost-effective." },
    { name: "Fatima Alami", company: "Retail Plus", quote: "The real-time tracking feature gives us complete visibility. Our customers love the transparency." },
  ]

  const steps = [
    { step: "01", title: "Create Your Account", desc: "Sign up in minutes with your email" },
    { step: "02", title: "Post Your Request", desc: "Describe your shipment and requirements" },
    { step: "03", title: "Choose & Ship", desc: "Compare offers and select the best driver" },
  ]

  const pricingPoints = [
    { title: "No Hidden Fees", desc: "See all costs upfront before booking" },
    { title: "Competitive Rates", desc: "Compare multiple offers to get the best price" },
    { title: "Secure Payments", desc: "Pay safely through our secure platform" },
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
            <li className="font-medium text-foreground" aria-current="page">For Shippers</li>
          </ol>
        </div>
      </nav>

      {/* Hero — full-width image + overlay, centered title + CTA */}
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
            Ship with confidence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase"
          >
            For Shippers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 text-base sm:text-lg text-white/85 max-w-2xl mx-auto"
          >
            Simplify your logistics and connect with trusted transporters. Ship your goods safely and efficiently across Morocco.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border border-white/20 min-h-[48px] px-6 uppercase font-semibold tracking-wider">
                Start shipping now
                <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" className="min-h-[48px] px-6 border-2 border-white/70 text-white hover:bg-white/10 hover:border-white">
                View features
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose — benefits grid */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Why choose us</p>
            <h2 className="section-title mb-3">Why choose TransportConnect?</h2>
            <p className="section-subtitle mx-auto">Everything you need to streamline your shipping operations</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              const isHighlight = index === 0
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card
                    className={`p-6 sm:p-8 h-full text-center transition-all duration-300 rounded-2xl border ${
                      isHighlight
                        ? "bg-primary text-primary-foreground border-primary shadow-lg"
                        : "glass-card border-border hover:shadow-md"
                    }`}
                  >
                    <div className={`p-3 rounded-xl w-fit mx-auto mb-4 ${isHighlight ? "bg-white/20" : "bg-primary/10"}`}>
                      <Icon className={`w-6 h-6 ${isHighlight ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isHighlight ? "text-primary-foreground" : "text-foreground"}`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed ${isHighlight ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      {benefit.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What Shippers Say — testimonials */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="section-title mb-3">What shippers say</h2>
            <p className="section-subtitle mx-auto">Trusted by businesses across Morocco</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-6 sm:p-8 h-full rounded-2xl border ${i === 1 ? "border-primary/50" : "border-border"} glass-card`}>
                  <span className="text-3xl sm:text-4xl font-serif text-muted-foreground leading-none">"</span>
                  <p className="text-foreground text-sm sm:text-base mt-2 mb-6 leading-relaxed">{t.quote}</p>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.company}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything You Need + Get Started in 3 Steps */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Features</p>
              <h2 className="section-title mb-6">Everything you need to ship</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border-2 border-primary/40 p-6 sm:p-8 bg-card"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Get started in 3 steps</h3>
              <div className="space-y-6">
                {steps.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transparent Pricing */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="section-title mb-3">Transparent pricing</h2>
            <p className="section-subtitle mx-auto">Compare prices and choose the best deal for your shipment</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {pricingPoints.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="p-6 sm:p-8 text-center h-full glass-card border border-border hover:border-primary/20 transition-colors duration-300">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
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
            <h2 className="section-title mb-3 sm:mb-4">Ready to start shipping?</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of shippers already using TransportConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="large" className="w-full sm:w-auto btn-glow shadow-glow hover:shadow-glow-lg">
                  Create free account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/trips">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  Browse trips
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

export default ForShippersPage
