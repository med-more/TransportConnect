import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Package, Search, Shield, Clock, TrendingUp, CheckCircle,
  ArrowRight, ChevronDown, Star, MapPin, Truck
} from "../../utils/icons"
import Button from "../../components/ui/Button"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

/* ─── tiny helpers ─────────────────────────────────────────── */
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
const benefits = [
  { icon: Search, title: "Find Transporters Easily", description: "Browse verified drivers and compare prices in real-time." },
  { icon: Shield, title: "Secure Transactions", description: "Your shipments are protected with insurance and verified partners." },
  { icon: Clock, title: "Real-Time Tracking", description: "Monitor your shipments from pickup to delivery with live updates." },
  { icon: TrendingUp, title: "Competitive Pricing", description: "Get the best rates by comparing multiple transport offers." },
]

const steps = [
  { step: "01", title: "Create Your Account", desc: "Sign up in minutes with your email and verify your identity." },
  { step: "02", title: "Post Your Request", desc: "Describe your shipment — weight, route, deadline." },
  { step: "03", title: "Compare Offers", desc: "Review bids from verified drivers and pick the best match." },
  { step: "04", title: "Ship & Track", desc: "Pay securely and follow every km of your delivery live." },
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

const stats = [
  { value: "12K+", label: "Active Shippers",  sub: "and growing daily" },
  { value: "98%",  label: "On-Time Delivery",  sub: "industry-leading rate" },
  { value: "40+",  label: "Cities Covered",    sub: "across Morocco" },
  { value: "4.9",  label: "Average Rating",    sub: "out of 5 stars" },
]

const testimonials = [
  { name: "Ahmed Benali", company: "Tech Solutions", rating: 5, quote: "TransportConnect revolutionized how we handle our logistics. Fast, reliable, and cost-effective across Morocco." },
  { name: "Fatima Alami", company: "Retail Plus", rating: 5, quote: "The real-time tracking feature gives us complete visibility. Our customers love the transparency." },
  { name: "Karim Tazi", company: "E-Shop Direct", rating: 5, quote: "Finding reliable drivers used to take days. Now it takes minutes. Incredible platform." },
]

/* ─── FAQ accordion ────────────────────────────────────────── */
const faqs = [
  { q: "How quickly can I find a transporter?", a: "Most requests receive their first offer within 15 minutes. During busy periods you can have 5+ competitive bids within an hour." },
  { q: "Are drivers properly licensed and insured?", a: "Yes. Every driver goes through identity verification, vehicle inspection, and insurance checks before being allowed on the platform." },
  { q: "What if my shipment is damaged?", a: "All shipments are covered by our platform insurance up to 50,000 MAD. File a claim directly from your dashboard." },
  { q: "Can I cancel a request after posting?", a: "You can cancel for free until a driver accepts your request. Once accepted, our cancellation policy applies." },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border border-border rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: open ? "var(--accent)" : "var(--card)" }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-foreground text-sm sm:text-base">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-primary"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
      </motion.div>
    </div>
  )
}

/* ─── page ─────────────────────────────────────────────────── */
export default function ForShippersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO — full bleed image + diagonal orange stripe
         ══════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[92vh] flex items-end overflow-hidden">
        {/* bg image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/home/2/1.webp)" }}
        />
        {/* dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

        {/* diagonal accent stripe */}
        <div
          className="absolute right-0 top-0 h-full w-[40%] opacity-20"
          style={{
            background: "linear-gradient(135deg, transparent 50%, var(--primary) 50%)",
          }}
        />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 pb-12 sm:pb-16 md:pb-20 pt-24 sm:pt-28 md:pt-36">
          <div className="max-w-6xl mx-auto">
            <motion.p
              {...fadeUp(0)}
              className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-5"
            >
              — Ship with confidence
            </motion.p>
            <motion.h1
              {...fadeUp(0.1)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white leading-none mb-6 sm:mb-8"
              style={{ letterSpacing: "-0.03em" }}
            >
              For<br />
              <span className="text-primary">Shippers</span>
            </motion.h1>
            <motion.p
              {...fadeUp(0.2)}
              className="text-base sm:text-lg text-white/80 max-w-lg mb-10 leading-relaxed"
            >
              Connect with trusted transporters. Ship your goods safely and
              efficiently across Morocco — all in one platform.
            </motion.p>
            <motion.div {...fadeUp(0.28)} className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-8 uppercase font-bold tracking-widest text-sm rounded-none">
                  Start shipping now
                  <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </Button>
              </Link>
              <Link to="/trips">
                <Button variant="outline" className="min-h-[52px] px-8 border-2 border-white/50 text-white hover:bg-white/10 hover:border-white rounded-none uppercase font-bold tracking-widest text-sm">
                  Browse trips
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

      </section>

      {/* ── STATS STRIP ── */}
      <section className="relative z-10 -mt-1 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 -translate-y-6 sm:-translate-y-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-card border border-border rounded-2xl px-4 py-4 sm:px-6 sm:py-5 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col gap-1"
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary leading-none">{s.value}</span>
                <span className="text-xs sm:text-sm font-bold text-foreground mt-1">{s.label}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{s.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY CHOOSE — image left, benefits right
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* image block */}
            <motion.div {...fadeLeft(0)} className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src="/home/1/1.webp"
                  alt="Shipper using TransportConnect"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              {/* floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="absolute -bottom-6 -right-4 md:-right-8 bg-primary text-white p-4 sm:p-5 rounded-2xl shadow-2xl max-w-[180px] sm:max-w-[200px]"
              >
                <Truck className="w-7 h-7 mb-2" />
                <p className="font-bold text-lg leading-tight">Driven by Trust</p>
                <p className="text-xs text-white/80 mt-1">Powered by experience</p>
              </motion.div>
            </motion.div>

            {/* text + benefits */}
            <motion.div {...fadeRight(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">
                Why choose us
              </p>
              <h2 className="section-title mb-6">
                Everything you need to streamline shipping
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10 max-w-lg">
                We built TransportConnect so shippers get the best rates and
                drivers get steady work — no middlemen, no hidden costs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <motion.div
                      key={b.title}
                      {...fadeUp(i * 0.08)}
                      className="flex gap-4 items-start group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1 text-sm sm:text-base">{b.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROCESS TIMELINE — full width dark bg
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-foreground text-background dark:bg-card dark:text-foreground overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">
              Our Seamless Process
            </motion.p>
            <motion.h2
              {...fadeUp(0.08)}
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ship in <span className="text-primary">4 easy steps</span>
            </motion.h2>
          </div>

          <div className="relative">
            {/* connecting line */}
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-primary/30" style={{ top: "2.5rem" }} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  {...fadeUp(i * 0.1)}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* step number bubble */}
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 flex-shrink-0 z-10 shadow-xl">
                    <span className="text-xl font-black text-white">{s.step}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES — checklist left + image right
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <motion.div {...fadeLeft(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Skills & Features</p>
              <h2 className="section-title mb-4">
                Skills that keep your<br />
                <span className="text-primary">business moving</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Advanced tools designed for high-volume shippers and
                businesses that can't afford delays.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    {...fadeUp(i * 0.05)}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm text-foreground font-medium">{f}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div {...fadeUp(0.4)} className="mt-10">
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white min-h-[48px] px-8 uppercase font-bold tracking-wider text-sm rounded-none">
                    Get started free
                    <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* stacked images */}
            <motion.div {...fadeRight(0)} className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-video">
                <img src="/home/3/1.webp" alt="Logistics operations" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 md:-left-8 w-[85%] sm:w-2/3 rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-background">
                <img src="/home/1/2.webp" alt="Driver with shipment" className="w-full object-cover aspect-video" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS — dark section with image
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">
              Hear From Our Happy Clients
            </motion.p>
            <motion.h2 {...fadeUp(0.08)} className="section-title">
              What shippers say
            </motion.h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.1)}
                className="bg-card border border-border rounded-3xl p-7 flex flex-col gap-4 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                {/* stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="pt-4 border-t border-border">
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ — side by side with image
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">
            <motion.div {...fadeLeft(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">FAQ</p>
              <h2 className="section-title mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Everything you need to know before placing your first shipment.
              </p>
              {/* image */}
              <div className="rounded-3xl overflow-hidden aspect-video hidden lg:block">
                <img src="/home/4/1.webp" alt="Truck on the road" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div {...fadeRight(0)} className="space-y-4">
              {faqs.map((f, i) => (
                <motion.div key={i} {...fadeUp(i * 0.08)}>
                  <FAQItem q={f.q} a={f.a} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA STRIP — full bleed image + overlay
         ══════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 md:py-28 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/home/1/4.webp)" }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-5">
            Ready to get started?
          </motion.p>
          <motion.h2
            {...fadeUp(0.08)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white mb-6 sm:mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            Start shipping today
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-white/75 max-w-xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg px-2">
            Join thousands of shippers already using TransportConnect across Morocco.
          </motion.p>
          <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-10 uppercase font-black tracking-widest text-sm rounded-none">
                Create free account <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="min-h-[52px] px-10 border-2 border-white/50 text-white hover:bg-white/10 rounded-none uppercase font-bold tracking-widest text-sm">
                Contact us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
