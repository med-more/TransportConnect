import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Package, Truck, Shield, MapPin, Clock, TrendingUp, CheckCircle, ArrowRight, Globe } from "../../utils/icons"
import Button from "../../components/ui/Button"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

/* ─── helpers ──────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})
const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})
const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

/* ─── data ─────────────────────────────────────────────────── */
const coreFeatures = [
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    description: "Monitor your shipments in real-time with GPS tracking and live updates.",
    details: "Instant notifications when your shipment is picked up, in transit, or delivered.",
    img: "/home/1/1.webp",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your data and transactions are protected with enterprise-grade security.",
    details: "SSL encryption, secure payments, and verified user accounts ensure complete safety.",
    img: "/home/4/2.webp",
  },
  {
    icon: Truck,
    title: "Verified Drivers",
    description: "All drivers are background-checked, verified, and insured.",
    details: "Background checks, insurance verification, and a robust rating system.",
    img: "/home/3/1.webp",
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
  { feature: "Support", traditional: "Business hours only", us: "24/7 availability" },
]

const integrations = [
  { label: "API", icon: Globe, desc: "Connect your own systems" },
  { label: "Mobile App", icon: Package, desc: "iOS & Android apps" },
  { label: "Web Dashboard", icon: TrendingUp, desc: "Full browser access" },
  { label: "SMS Alerts", icon: Clock, desc: "Instant notifications" },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO — fullbleed right image
         ══════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[88vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/home/3/1.webp)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25" />
        <div
          className="absolute right-0 top-0 h-full w-[40%] opacity-15"
          style={{ background: "linear-gradient(135deg, transparent 50%, var(--primary) 50%)" }}
        />
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-20 pb-12 sm:pb-16 md:pb-20 pt-24 sm:pt-28 md:pt-36 max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-6"
          >
            — Platform Features
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-white leading-none mb-6 sm:mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            Powerful<br />
            <span className="text-primary">Features</span><br />
            Built for You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/75 text-base sm:text-lg max-w-lg mb-10 leading-relaxed"
          >
            Everything you need to streamline logistics and grow your transport business — in one powerful platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-8 uppercase font-black tracking-widest text-sm rounded-none">
                Get started free <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" className="min-h-[52px] px-8 border-2 border-white/50 text-white hover:bg-white/10 rounded-none uppercase font-bold tracking-widest text-sm">
                View services
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="relative z-10 -mt-1 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 -translate-y-6 sm:-translate-y-8">
            {[
              { v: "6", l: "Core Features", s: "built for you" },
              { v: "9+", l: "Extra Capabilities", s: "and counting" },
              { v: "4", l: "Integrations", s: "plug & play" },
              { v: "0", l: "Hidden Costs", s: "fully transparent" },
            ].map((st, i) => (
              <motion.div
                key={st.l}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-card border border-border rounded-2xl px-6 py-5 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col gap-1"
              >
                <span className="text-3xl sm:text-4xl font-black text-primary leading-none">{st.v}</span>
                <span className="text-sm font-bold text-foreground mt-1">{st.l}</span>
                <span className="text-xs text-muted-foreground">{st.s}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CORE FEATURES — alternating split sections
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl space-y-16 sm:space-y-20 lg:space-y-28">
          <div className="text-center">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Core Features</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="section-title">
              What we <span className="text-primary">offer</span>
            </motion.h2>
          </div>

          {coreFeatures.map((feat, i) => {
            const Icon = feat.icon
            const isEven = i % 2 === 0
            return (
              <div
                key={feat.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center`}
              >
                {/* image */}
                <motion.div
                  {...(isEven ? fadeLeft(0) : fadeRight(0))}
                  className={`relative ${!isEven ? "order-1 lg:order-2" : ""}`}
                >
                  <div className="rounded-3xl overflow-hidden aspect-video">
                    <img src={feat.img} alt={feat.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-${isEven ? "tr" : "tl"} from-primary/25 to-transparent`} />
                  </div>
                  {/* floating icon badge — hide on very small to avoid overflow */}
                  <div className={`hidden sm:block absolute -bottom-5 ${isEven ? "-right-5 md:-right-8" : "-left-5 md:-left-8"} bg-primary text-white p-4 sm:p-5 rounded-2xl shadow-2xl`}>
                    <Icon className="w-8 h-8 mb-1" />
                    <p className="font-black text-sm">{feat.title}</p>
                  </div>
                </motion.div>

                {/* text */}
                <motion.div
                  {...(isEven ? fadeRight(0) : fadeLeft(0))}
                  className={!isEven ? "order-2 lg:order-1" : ""}
                >
                  <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Feature 0{i + 1}</p>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase mb-5" style={{ letterSpacing: "-0.02em" }}>
                    {feat.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{feat.description}</p>
                  <p className="text-muted-foreground/80 text-sm leading-relaxed mb-8">{feat.details}</p>
                  <Link to="/register">
                    <Button className="bg-primary hover:bg-primary/90 text-white min-h-[48px] px-8 uppercase font-bold tracking-wider text-sm rounded-none">
                      Try now <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          24/7 SUPPORT + SMART MATCHING — 2 col dark
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-foreground dark:bg-card text-background dark:text-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">More Power</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-4xl md:text-5xl font-black uppercase" style={{ letterSpacing: "-0.02em" }}>
              Even more <span className="text-primary">features</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Clock, title: "24/7 Support", desc: "Get help whenever you need it with our dedicated support team available round the clock.", det: "Live chat, phone support, and email assistance available around the clock." },
              { icon: TrendingUp, title: "Smart Matching", desc: "AI-powered matching connects shippers with the best drivers for every route.", det: "Optimized route matching based on location, capacity, and pricing preferences." },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  {...fadeUp(i * 0.1)}
                  className="group border border-white/10 dark:border-border rounded-3xl p-8 hover:border-primary/50 hover:bg-white/5 dark:hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                    <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-black text-xl mb-3">{f.title}</h3>
                  <p className="text-sm opacity-65 leading-relaxed mb-2">{f.desc}</p>
                  <p className="text-xs opacity-45 leading-relaxed">{f.det}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VS. COMPARISON — table style
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <motion.div {...fadeLeft(0)} className="min-w-0">
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Compare</p>
              <h2 className="section-title mb-6">
                Why choose <span className="text-primary">TransportConnect</span>?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                See how we compare to traditional logistics brokers. We built this platform to remove every pain point from the equation.
              </p>
              <div className="space-y-4">
                {comparison.map((item, i) => (
                  <motion.div key={item.feature} {...fadeUp(i * 0.08)} className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-3 border-b border-border bg-muted/30">
                      <span className="font-bold text-foreground text-sm">{item.feature}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-3 sm:px-6 py-3 sm:py-4 border-r border-border min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Traditional</p>
                        <p className="text-xs sm:text-sm text-foreground break-words">{item.traditional}</p>
                      </div>
                      <div className="px-3 sm:px-6 py-3 sm:py-4 bg-primary/5 min-w-0">
                        <p className="text-xs text-primary uppercase tracking-wide font-semibold mb-1">TransportConnect</p>
                        <p className="text-xs sm:text-sm font-bold text-primary break-words">{item.us}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* image stacked */}
            <motion.div {...fadeRight(0)} className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[3/4]">
                <img src="/home/4/1.webp" alt="Comparison" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-primary text-white rounded-2xl p-5">
                  <p className="font-black text-2xl mb-1">100%</p>
                  <p className="text-sm text-white/85">Verified driver network — zero exceptions</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          INTEGRATIONS + MORE FEATURES
         ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* integrations */}
            <motion.div {...fadeLeft(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Integrations</p>
              <h2 className="section-title mb-10">Seamless integration</h2>
              <div className="grid grid-cols-2 gap-4">
                {integrations.map((it, i) => {
                  const Icon = it.icon
                  return (
                    <motion.div
                      key={it.label}
                      {...fadeUp(i * 0.08)}
                      className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                        <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="font-bold text-foreground mb-1">{it.label}</h3>
                      <p className="text-xs text-muted-foreground">{it.desc}</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* more features checklist */}
            <motion.div {...fadeRight(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">More Capabilities</p>
              <h2 className="section-title mb-10">And even more</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {additionalFeatures.map((f, i) => (
                  <motion.div key={i} {...fadeUp(i * 0.05)} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA STRIP
         ══════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/home/1/4.webp)" }} />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-5">Experience all features today</motion.p>
          <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white mb-6 sm:mb-8" style={{ letterSpacing: "-0.03em" }}>
            Start shipping smarter
          </motion.h2>
          <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-10 uppercase font-black tracking-widest text-sm rounded-none">
                Get started free <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="min-h-[52px] px-10 border-2 border-white/50 text-white hover:bg-white/10 rounded-none uppercase font-bold tracking-widest text-sm">
                Contact sales
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
