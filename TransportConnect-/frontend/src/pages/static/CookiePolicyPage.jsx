import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Cookie, Settings, BarChart3, Shield, CheckCircle, ArrowRight } from "../../utils/icons"
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
    icon: Cookie,
    title: "What Are Cookies",
    content: [
      "Cookies are small text files placed on your device when you visit our website.",
      "They help us provide a better experience by remembering your preferences and settings.",
      "Cookies can be 'session' cookies (temporary) or 'persistent' cookies (stored on your device).",
      "We use both first-party cookies (set by TransportConnect) and third-party cookies (set by our partners).",
    ],
  },
  {
    icon: Settings,
    title: "Types of Cookies We Use",
    content: [
      "Essential Cookies: Required for the platform to function properly and cannot be disabled.",
      "Analytics Cookies: Help us understand how visitors interact with our website to improve performance.",
      "Functional Cookies: Remember your preferences and settings for a personalized experience.",
      "Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness.",
    ],
  },
  {
    icon: BarChart3,
    title: "How We Use Cookies",
    content: [
      "To authenticate users and maintain your login session securely.",
      "To remember your preferences and settings across multiple visits.",
      "To analyze website traffic and user behavior for platform improvements.",
      "To provide personalized content and recommendations based on your history.",
      "To measure the effectiveness of our marketing campaigns.",
    ],
  },
  {
    icon: Shield,
    title: "Managing Cookies",
    content: [
      "You can control and manage cookies through your browser settings at any time.",
      "Most browsers allow you to refuse or delete cookies, but this may affect functionality.",
      "You can opt-out of certain third-party cookies through their respective privacy policies.",
      "Note that disabling cookies may limit your ability to use some features of our platform.",
    ],
  },
]

const cookieTypes = [
  { name: "Essential", color: "bg-primary", desc: "Always enabled" },
  { name: "Analytics", color: "bg-blue-500", desc: "Optional" },
  { name: "Functional", color: "bg-amber-500", desc: "Optional" },
  { name: "Marketing", color: "bg-purple-500", desc: "Optional" },
]

const highlights = [
  { label: "Transparent Usage", icon: Cookie },
  { label: "Your Controls", icon: Settings },
  { label: "No Hidden Tracking", icon: Shield },
]

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO
         ══════════════════════════════════════════════ */}
      <section className="relative min-h-[45vh] sm:min-h-[55vh] flex items-center overflow-hidden bg-foreground dark:bg-card">
        <div className="relative z-10 w-full lg:w-1/2 px-4 sm:px-6 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-6"
          >
            — Legal & Privacy
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white dark:text-foreground leading-none mb-4 sm:mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            Cookie<br />
            <span className="text-primary">Policy</span>
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
          <img src="/home/1/2.webp" alt="Cookies" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground dark:from-card via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          COOKIE TYPE LEGEND
         ══════════════════════════════════════════════ */}
      <section className="border-b border-border bg-muted/30 dark:bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cookie types:</span>
          {cookieTypes.map((ct) => (
            <div key={ct.name} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${ct.color}`} />
              <span className="text-sm font-medium text-foreground">{ct.name}</span>
              <span className="text-xs text-muted-foreground">— {ct.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTENT
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {/* sidebar */}
            <motion.div {...fadeLeft(0)} className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-2">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">Contents</p>
                {sections.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.title}
                      href={`#cookie-${i}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted hover:text-primary transition-all duration-200 group"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-foreground">{s.title}</span>
                    </a>
                  )
                })}
                <div className="pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">Questions?</p>
                  <a href="mailto:privacy@transportconnect.ma" className="text-sm text-primary font-semibold hover:underline">
                    privacy@transportconnect.ma
                  </a>
                </div>
              </div>
            </motion.div>

            {/* sections */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div {...fadeUp(0)} className="bg-card border border-border rounded-3xl p-7 sm:p-10">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This Cookie Policy explains how TransportConnect uses cookies and similar technologies to recognize you when
                  you visit our website and use our platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using our website, you consent to the use of cookies in accordance with this policy.
                </p>
              </motion.div>

              {sections.map((sec, idx) => {
                const Icon = sec.icon
                return (
                  <motion.div
                    key={sec.title}
                    id={`cookie-${idx}`}
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
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <a href="mailto:privacy@transportconnect.ma" className="text-primary font-semibold hover:underline">
                  privacy@transportconnect.ma
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA
         ══════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/home/3/1.webp)" }} />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.h2 {...fadeUp(0)} className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white mb-5 sm:mb-6" style={{ letterSpacing: "-0.02em" }}>
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
