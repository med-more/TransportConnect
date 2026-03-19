import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { MessageCircle, Book, HelpCircle, Mail, Phone, Search, ChevronDown, ArrowRight, Clock, UserCheck } from "../../utils/icons"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
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
const channels = [
  { icon: MessageCircle, title: "Live Chat", desc: "Chat with our team in real-time during business hours.", cta: "Start Chat", href: "#" },
  { icon: Mail, title: "Email Support", desc: "We respond to all emails within 24 hours.", cta: "Send Email", href: "mailto:support@transportconnect.ma" },
  { icon: Phone, title: "Phone Support", desc: "Call us directly for urgent issues.", cta: "Call Now", href: "tel:+2126XXXXXXXX" },
  { icon: Book, title: "Help Center", desc: "Browse our comprehensive knowledge base at your own pace.", cta: "Browse Docs", href: "#" },
]

const faqs = [
  { q: "How do I create a shipping request?", a: "Log in to your account, click 'Create Request', fill in your shipment details and submit. Drivers will immediately see your request and can make offers." },
  { q: "How are drivers verified?", a: "All drivers go through a verification process including identity verification, vehicle inspection, and insurance verification before they can accept requests." },
  { q: "What payment methods are accepted?", a: "We accept all major credit cards, bank transfers, and digital wallets. Payments are processed securely through our platform." },
  { q: "Can I track my shipment in real-time?", a: "Yes! Once a driver accepts your request, you'll receive real-time GPS tracking updates from pickup to final delivery." },
  { q: "What if my shipment is damaged?", a: "All shipments are covered by insurance. Contact our support team immediately if you encounter any issues and we'll help you file a claim." },
  { q: "How do I cancel a request?", a: "You can cancel a request from your dashboard as long as it hasn't been accepted by a driver. Once accepted, cancellation policies apply." },
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

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ctaBgFailed, setCtaBgFailed] = useState(false)

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredFaqs =
    !normalizedQuery
      ? faqs
      : faqs.filter((f) => {
          const q = (f.q || "").toLowerCase()
          const a = (f.a || "").toLowerCase()
          return q.includes(normalizedQuery) || a.includes(normalizedQuery)
        })

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO — search + image
         ══════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[85vh] flex items-end overflow-hidden">
        {/* bg */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{
            backgroundImage:
              "url(https://plus.unsplash.com/premium_photo-1666299884107-2c2cf920ee59?auto=format&fit=crop&w=1920&q=80)",
          }}
        />
        {/* dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/65 to-black/45" />
        {/* diagonal accent stripe */}
        <div
          className="absolute right-0 top-0 h-full w-[40%] opacity-20"
          style={{ background: "linear-gradient(135deg, transparent 50%, var(--primary) 50%)" }}
        />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 pb-14 sm:pb-20 md:pb-24 lg:pb-28 pt-24 sm:pt-28 md:pt-36 max-w-6xl mx-auto">
          <motion.p
            {...fadeUp(0)}
            className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-6"
          >
            — We're here 24/7
          </motion.p>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none mb-6 sm:mb-8 drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            style={{ letterSpacing: "-0.03em" }}
          >
            How can<br />
            we <span className="text-primary">help</span>?
          </motion.h1>
          <motion.p
            {...fadeUp(0.18)}
            className="text-white/90 text-base sm:text-lg leading-relaxed max-w-md mb-8 sm:mb-10 drop-shadow-[0_5px_14px_rgba(0,0,0,0.28)]"
          >
            Search our help center or choose a support channel that works best for you.
          </motion.p>

          {/* search */}
          <motion.div {...fadeUp(0.25)} className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <Input
              placeholder="Search for help articles..."
              className="pl-12 pr-4 py-4 text-base rounded-xl border-white/20 bg-background/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* quick stats */}
          <motion.div {...fadeUp(0.33)} className="flex flex-wrap gap-6 mt-10">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-white/80">
                Avg. response:{" "}
                <strong className="text-white">3 min</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              <span className="text-sm text-white/80">
                Support: <strong className="text-white">24/7</strong>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SUPPORT CHANNELS — 4-col cards with border accent
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Get Support</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="section-title">
              Choose how to <span className="text-primary">reach us</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {channels.map((ch, i) => {
              const Icon = ch.icon
              return (
                <motion.div
                  key={ch.title}
                  {...fadeUp(i * 0.08)}
                  className="group bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col gap-3 sm:gap-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-sm sm:text-lg mb-1 sm:mb-2">{ch.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{ch.desc}</p>
                  </div>
                  <div className="mt-auto">
                    <a href={ch.href}>
                      <Button variant="outline" className="w-full rounded-xl text-sm font-semibold">
                        {ch.cta}
                      </Button>
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ — left image + right accordion
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">
            {/* left */}
            <motion.div {...fadeLeft(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">FAQ</p>
              <h2 className="section-title mb-4">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Find answers to the most common questions about using TransportConnect.
              </p>
              {/* image */}
              <div className="rounded-3xl overflow-hidden aspect-video hidden lg:block">
                <img src="/home/4/2.webp" alt="Truck delivery" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            {/* accordion */}
            <motion.div {...fadeRight(0)} className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((f, i) => (
                  <motion.div key={f.q} {...fadeUp(i * 0.07)}>
                    <FAQItem q={f.q} a={f.a} />
                  </motion.div>
                ))
              ) : (
                <div className="p-4 rounded-2xl border border-border bg-card text-muted-foreground text-sm">
                  No matching results for "{searchQuery}".
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          RESOURCES — 3 col with image bg
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Resources</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="section-title">
              Helpful resources
            </motion.h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { img: "/home/1/1.webp", title: "Getting Started Guide", desc: "Step-by-step tutorials for new shippers and drivers to get up and running fast." },
              { img: "/home/1/2.webp", title: "Video Tutorials", desc: "Watch and learn from our growing library of explainer and how-to videos." },
              { img: "/home/1/4.webp", title: "Best Practices", desc: "Tips and tricks from experienced users to get the most out of the platform." },
            ].map((r, i) => (
              <motion.div
                key={r.title}
                {...fadeUp(i * 0.1)}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer"
              >
                <img src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-bold text-white text-lg mb-1">{r.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA STRIP
         ══════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 md:py-28 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ctaBgFailed ? "/home/3/1.webp" : "https://source.unsplash.com/3vEtYOjWwC4/1920x1080"}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            onError={() => setCtaBgFailed(true)}
          />
        </div>
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-5">Still need help?</motion.p>
          <motion.h2
            {...fadeUp(0.08)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white mb-6 sm:mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            Our team is ready
          </motion.h2>
          <motion.div {...fadeUp(0.15)}>
            <Link to="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-10 uppercase font-black tracking-widest text-sm rounded-none">
                Contact us now <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
