import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Shield, Lock, Eye, FileText, CheckCircle, ArrowRight } from "../../utils/icons"
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
    title: "Information We Collect",
    content: [
      "Personal information such as name, email address, phone number, and address when you register.",
      "Payment information processed securely through our payment partners.",
      "Usage data including how you interact with our platform, pages visited, and features used.",
      "Location data when you use our tracking features to monitor shipments.",
      "Communication data including messages exchanged between shippers and drivers.",
    ],
  },
  {
    icon: Lock,
    title: "How We Use Your Information",
    content: [
      "To provide and maintain our services, including connecting shippers with drivers.",
      "To process transactions and manage payments securely.",
      "To send you important updates about your shipments and account activity.",
      "To improve our platform by analyzing usage patterns and user feedback.",
      "To comply with legal obligations and protect the rights of our users.",
    ],
  },
  {
    icon: Shield,
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information.",
      "All data is encrypted in transit using SSL/TLS protocols.",
      "Sensitive information such as passwords is hashed and stored securely.",
      "We regularly update our security practices to address emerging threats.",
      "Access to personal data is restricted to authorized personnel only.",
    ],
  },
  {
    icon: Eye,
    title: "Your Rights",
    content: [
      "You have the right to access your personal information at any time.",
      "You can request corrections to inaccurate or incomplete data.",
      "You may request deletion of your account and associated data.",
      "You can opt-out of marketing communications while still receiving essential service updates.",
      "You have the right to data portability in a machine-readable format.",
    ],
  },
]

const highlights = [
  { label: "Data Encryption", icon: Lock },
  { label: "No Hidden Sharing", icon: Shield },
  { label: "Your Data, Your Rights", icon: Eye },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO — dark bg + image right
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
            Privacy<br />
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
          {/* trust pills */}
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
        {/* right image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block absolute right-0 top-0 w-[48%] h-full"
        >
          <img src="/home/1/3.webp" alt="Privacy" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground dark:from-card via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          INTRO + CONTENT
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {/* sticky sidebar */}
            <motion.div {...fadeLeft(0)} className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-2">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">Contents</p>
                {sections.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.title}
                      href={`#section-${i}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted hover:text-primary transition-all duration-200 group"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-foreground">{s.title}</span>
                    </a>
                  )
                })}
                <div className="pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">Questions? Contact us:</p>
                  <a href="mailto:privacy@transportconnect.ma" className="text-sm text-primary font-semibold hover:underline">
                    privacy@transportconnect.ma
                  </a>
                </div>
              </div>
            </motion.div>

            {/* content */}
            <div className="lg:col-span-2 space-y-8">
              {/* intro */}
              <motion.div {...fadeUp(0)} className="bg-card border border-border rounded-3xl p-7 sm:p-10">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At TransportConnect, we are committed to protecting your privacy and ensuring the security of your personal
                  information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                  you use our platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using TransportConnect, you agree to the collection and use of information in accordance with this policy.
                </p>
              </motion.div>

              {/* sections */}
              {sections.map((sec, idx) => {
                const Icon = sec.icon
                return (
                  <motion.div
                    key={sec.title}
                    id={`section-${idx}`}
                    {...fadeUp(idx * 0.07)}
                    className="bg-card border border-border rounded-3xl overflow-hidden"
                  >
                    {/* header strip */}
                    <div className="flex items-center gap-4 px-7 py-5 border-b border-border bg-muted/30 dark:bg-muted/20">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">{sec.title}</h2>
                    </div>
                    {/* items */}
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

              {/* contact */}
              <motion.div {...fadeUp(0.35)} className="bg-primary/5 border border-primary/20 rounded-3xl p-7 sm:p-10">
                <h2 className="text-xl font-bold text-foreground mb-3">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
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
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/home/2/1.webp)" }} />
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
