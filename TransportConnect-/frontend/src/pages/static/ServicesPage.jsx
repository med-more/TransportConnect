import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Truck, Shield, MapPin, Package, CheckCircle, TrendingUp } from "../../utils/icons"
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
const skills = [
  { label: "On-time delivery", value: 98 },
  { label: "Verified partners", value: 100 },
  { label: "Customer satisfaction", value: 95 },
  { label: "Coverage", value: 100 },
]

const howSteps = [
  { step: "01", title: "Post your request", desc: "Create a shipping request with details about your cargo, route, and deadline." },
  { step: "02", title: "Get matched", desc: "Receive competitive offers from verified drivers in your area within minutes." },
  { step: "03", title: "Track & deliver", desc: "Monitor your shipment in real-time with live GPS updates until delivery." },
]

const additionalServices = [
  "Full-truck & partial load options",
  "Refrigerated transport",
  "Express same-day delivery",
  "Fragile & high-value cargo",
  "International border crossings",
  "Long-haul Morocco-wide routes",
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO — split: dark left / image right
         ══════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[88vh] flex items-end overflow-hidden">
        {/* bg */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://plus.unsplash.com/premium_photo-1771361191366-4f65572326ab?auto=format&fit=crop&w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25" />
        {/* diagonal accent */}
        <div
          className="absolute right-0 top-0 h-full w-[40%] opacity-15"
          style={{ background: "linear-gradient(135deg, transparent 50%, var(--primary) 50%)" }}
        />
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-20 pb-12 sm:pb-16 md:pb-20 pt-24 sm:pt-28 md:pt-36 max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-6"
          >
            — Our Trusted Logistics Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-white leading-none mb-6 sm:mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            Transport<br />
            <span className="text-primary">Solutions</span><br />
            for Morocco
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/75 text-base sm:text-lg max-w-lg mb-10 leading-relaxed"
          >
            From freight transport to secure platform tools — everything your business needs to ship smarter across Morocco.
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
            <Link to="/trips">
              <Button variant="outline" className="min-h-[52px] px-8 border-2 border-white/50 text-white hover:bg-white/10 rounded-none uppercase font-bold tracking-widest text-sm">
                Browse trips
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="relative z-10 -mt-1 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 -translate-y-6 sm:-translate-y-8">
            {[
              { v: "98%", l: "On-Time Delivery", s: "industry-leading rate" },
              { v: "8K+", l: "Verified Drivers", s: "background-checked drivers" },
              { v: "40+", l: "Cities Covered", s: "across Morocco" },
              { v: "24/7", l: "Live Support", s: "whenever you need us" },
            ].map((st, i) => (
              <motion.div
                key={st.l}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-card border border-border rounded-2xl px-4 py-4 sm:px-6 sm:py-5 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col gap-1"
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary leading-none">{st.v}</span>
                <span className="text-xs sm:text-sm font-bold text-foreground mt-1">{st.l}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{st.s}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MAIN SERVICES — image cards staggered
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">What we offer</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="section-title">
              Everything you need to <span className="text-primary">ship smarter</span>
            </motion.h2>
          </div>

          {/* Service 1 – Image left, text right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center mb-16 sm:mb-24">
            <motion.div {...fadeLeft(0)} className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                <img src="/home/2/1.webp" alt="Freight Transport" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -right-5 sm:-right-8 bg-primary text-white p-5 rounded-2xl shadow-2xl">
                <Truck className="w-8 h-8 mb-2" />
                <p className="font-black text-lg">Freight Transport</p>
              </div>
            </motion.div>
            <motion.div {...fadeRight(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Service 01</p>
              <h3 className="text-3xl sm:text-4xl font-black uppercase mb-5" style={{ letterSpacing: "-0.02em" }}>
                Freight Transport
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Connect with verified transporters for all your shipping needs across Morocco. Post a request and receive competitive bids in minutes — complete with real-time tracking and secure payments.
              </p>
              <ul className="space-y-3 mb-8">
                {["Full-truck & partial loads", "Live GPS tracking", "Insurance on every shipment", "Secure escrow payments"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/trips">
                <Button className="bg-primary hover:bg-primary/90 text-white min-h-[48px] px-8 uppercase font-bold tracking-wider text-sm rounded-none">
                  Find drivers <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Service 2 – Text left, image right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center mb-16 sm:mb-24">
            <motion.div {...fadeLeft(0)} className="order-2 lg:order-1">
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Service 02</p>
              <h3 className="text-3xl sm:text-4xl font-black uppercase mb-5" style={{ letterSpacing: "-0.02em" }}>
                Driver Network
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Join our growing network of professional drivers. Get steady work, set your own schedule, and receive fair, direct payments — with no middlemen taking cuts from your earnings.
              </p>
              <ul className="space-y-3 mb-8">
                {["Flexible scheduling", "Direct & instant payments", "Route optimization", "Driver profile & ratings"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white min-h-[48px] px-8 uppercase font-bold tracking-wider text-sm rounded-none">
                  Join as driver <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </Button>
              </Link>
            </motion.div>
            <motion.div {...fadeRight(0)} className="order-1 lg:order-2 relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                <img src="/home/3/1.webp" alt="Driver Network" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-bl from-primary/30 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -left-5 sm:-left-8 bg-foreground dark:bg-card text-white dark:text-foreground p-5 rounded-2xl shadow-2xl border border-border">
                <Truck className="w-8 h-8 text-primary mb-2" />
                <p className="font-black text-lg">Driver Network</p>
              </div>
            </motion.div>
          </div>

          {/* Service 3 – Image left, text right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <motion.div {...fadeLeft(0)} className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                <img src="/home/4/1.webp" alt="Secure Platform" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -right-5 sm:-right-8 bg-primary text-white p-5 rounded-2xl shadow-2xl">
                <Shield className="w-8 h-8 mb-2" />
                <p className="font-black text-lg">Secure Platform</p>
              </div>
            </motion.div>
            <motion.div {...fadeRight(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Service 03</p>
              <h3 className="text-3xl sm:text-4xl font-black uppercase mb-5" style={{ letterSpacing: "-0.02em" }}>
                Secure Platform
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Your shipments, payments, and data are protected at every step. Verified users, insured shipments, and escrow payments give you complete peace of mind on every transaction.
              </p>
              <ul className="space-y-3 mb-8">
                {["Identity-verified drivers", "Shipment insurance", "Secure payment escrow", "24/7 dispute resolution"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/features">
                <Button className="bg-primary hover:bg-primary/90 text-white min-h-[48px] px-8 uppercase font-bold tracking-wider text-sm rounded-none">
                  See all features <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS — dark bg timeline
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-foreground dark:bg-card text-background dark:text-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Our Seamless Process</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-4xl md:text-5xl font-black uppercase" style={{ letterSpacing: "-0.02em" }}>
              How it <span className="text-primary">works</span>
            </motion.h2>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute left-0 right-0 h-px bg-primary/30" style={{ top: "2.5rem" }} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
              {howSteps.map((s, i) => (
                <motion.div key={s.step} {...fadeUp(i * 0.1)} className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 flex-shrink-0 z-10 shadow-xl">
                    <span className="text-xl font-black text-white">{s.step}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm opacity-65 leading-relaxed max-w-xs">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PLATFORM STRENGTHS — circular progress + image
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* progress rings */}
            <motion.div {...fadeLeft(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Platform Strengths</p>
              <h2 className="section-title mb-10">
                Skills that keep your <span className="text-primary">business moving</span>
              </h2>
              <div className="grid grid-cols-2 gap-8">
                {skills.map((skill, index) => (
                  <motion.div key={skill.label} {...fadeUp(index * 0.1)} className="flex flex-col items-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                        <circle
                          cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6"
                          strokeLinecap="round" className="text-primary transition-all duration-1000"
                          strokeDasharray={`${skill.value * 2.64} 264`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-foreground">
                        {skill.value}%
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground text-center">{skill.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* image + checklist */}
            <motion.div {...fadeRight(0)} className="space-y-8">
              <div className="rounded-3xl overflow-hidden aspect-video">
                <img src="/home/1/4.webp" alt="Our services" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {additionalServices.map((s, i) => (
                  <motion.div key={i} {...fadeUp(i * 0.05)} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{s}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA — full bleed image
         ══════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/home/1/2.webp)" }} />
        <div className="absolute inset-0 bg-black/72" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-5">Ready to move?</motion.p>
          <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white mb-6 sm:mb-8" style={{ letterSpacing: "-0.03em" }}>
            Get started today
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
