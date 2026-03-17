import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FileText, Scale, AlertTriangle, CheckCircle, ArrowRight } from "../../utils/icons"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"
import Button from "../../components/ui/Button"

/* ─── helpers ──────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})
const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

/* ─── data ─────────────────────────────────────────────────── */
const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content: [
      "By accessing and using TransportConnect, you accept and agree to be bound by these Terms of Service.",
      "If you do not agree to these terms, you must not use our platform.",
      "We reserve the right to modify these terms at any time, effective immediately upon posting.",
      "Your continued use of the platform after changes constitutes acceptance of the modified terms.",
    ],
  },
  {
    icon: Scale,
    title: "User Responsibilities",
    content: [
      "You must be at least 18 years old to use our platform.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate and complete information when creating an account.",
      "You must comply with all applicable laws and regulations when using our services.",
      "You are responsible for all activities that occur under your account.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Activities",
    content: [
      "Using the platform for any illegal or unauthorized purpose.",
      "Violating any local, state, national, or international law.",
      "Transmitting any harmful, offensive, or inappropriate content.",
      "Attempting to gain unauthorized access to our systems or other users' accounts.",
      "Interfering with or disrupting the platform's operation or security.",
    ],
  },
  {
    icon: CheckCircle,
    title: "Service Availability",
    content: [
      "We strive to provide continuous service availability but do not guarantee uninterrupted access.",
      "We may perform maintenance that temporarily limits access to the platform.",
      "We reserve the right to modify, suspend, or discontinue any part of our services at any time.",
      "We are not liable for any loss or damage resulting from service interruptions.",
    ],
  },
]

const highlights = [
  { label: "Fair Use Policy", icon: Scale },
  { label: "Clear Rules", icon: FileText },
  { label: "User Protection", icon: CheckCircle },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO — dark bg + image right
         ══════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-foreground dark:bg-card">
        <div className="relative z-10 w-full lg:w-1/2 px-6 sm:px-12 md:px-20 py-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-6"
          >
            — Legal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white dark:text-foreground leading-none mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            Terms of<br />
            <span className="text-primary">Service</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/60 dark:text-muted-foreground text-sm"
          >
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {highlights.map((h) => {
              const Icon = h.icon
              return (
                <div key={h.label} className="flex items-center gap-2 bg-white/10 dark:bg-muted rounded-full px-4 py-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-white dark:text-foreground">{h.label}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
        {/* image right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block absolute right-0 top-0 w-[48%] h-full"
        >
          <img src="/home/4/2.webp" alt="Terms" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground dark:from-card via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTENT — sidebar + sections
         ══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* sidebar TOC */}
            <motion.div {...fadeLeft(0)} className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-2">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">Contents</p>
                {sections.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.title}
                      href={`#term-${i}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted hover:text-primary transition-all duration-200 group"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-foreground">{s.title}</span>
                    </a>
                  )
                })}
                <div className="pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">Questions?</p>
                  <a href="mailto:legal@transportconnect.ma" className="text-sm text-primary font-semibold hover:underline">
                    legal@transportconnect.ma
                  </a>
                </div>
              </div>
            </motion.div>

            {/* sections */}
            <div className="lg:col-span-2 space-y-8">
              {/* intro */}
              <motion.div {...fadeUp(0)} className="bg-card border border-border rounded-3xl p-7 sm:p-10">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms of Service govern your use of the TransportConnect platform. Please read them carefully before
                  using our services.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using TransportConnect, you agree to comply with and be bound by these terms. If you disagree with any
                  part of these terms, you may not access or use our services.
                </p>
              </motion.div>

              {sections.map((sec, idx) => {
                const Icon = sec.icon
                return (
                  <motion.div
                    key={sec.title}
                    id={`term-${idx}`}
                    {...fadeUp(idx * 0.07)}
                    className="bg-card border border-border rounded-3xl overflow-hidden"
                  >
                    <div className="flex items-center gap-4 px-7 py-5 border-b border-border bg-muted/30 dark:bg-muted/20">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">{sec.title}</h2>
                    </div>
                    <ul className="px-7 py-6 space-y-4">
                      {sec.content.map((item, ci) => (
                        <li key={ci} className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}

              <motion.div {...fadeUp(0.35)} className="bg-primary/5 border border-primary/20 rounded-3xl p-7 sm:p-10">
                <h2 className="text-xl font-bold text-foreground mb-3">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <a href="mailto:legal@transportconnect.ma" className="text-primary font-semibold hover:underline">
                  legal@transportconnect.ma
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA
         ══════════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/home/1/4.webp)" }} />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 text-center px-4">
          <motion.h2 {...fadeUp(0)} className="text-3xl sm:text-4xl font-black uppercase text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
            Ready to Start Shipping?
          </motion.h2>
          <motion.div {...fadeUp(0.1)}>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[48px] px-8 uppercase font-bold tracking-widest text-sm rounded-none">
                Create Account <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
