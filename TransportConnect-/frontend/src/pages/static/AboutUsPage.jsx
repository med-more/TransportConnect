import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Shield, Clock, MapPin, Users, Award, Target } from "../../utils/icons"
import Button from "../../components/ui/Button"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

/* ─── animation helpers ─────────────────────────────────────── */
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
const values = [
  { icon: Shield, title: "Trust & Safety", desc: "Every transporter is background-checked, verified, and insured for your peace of mind on every route." },
  { icon: Clock, title: "Real-time Tracking", desc: "Follow your shipment from pickup to delivery with live GPS. No more guesswork or status calls." },
  { icon: MapPin, title: "Morocco-Wide Reach", desc: "From Casablanca to Agadir, our network covers 40+ cities so your goods reach every corner of Morocco." },
  { icon: Users, title: "Community First", desc: "We built this platform for shippers and drivers equally – fair pricing, transparent payments." },
  { icon: Award, title: "Quality Guarantee", desc: "Our rating system and insurance ensure only the best drivers make it to your dashboard." },
  { icon: Target, title: "Mission-Driven", desc: "We're here to make logistics in Morocco smarter, faster, and accessible to every business." },
]

const milestones = [
  { year: "2021", event: "TransportConnect founded in Casablanca with a team of 5." },
  { year: "2022", event: "Platform launched with 200 drivers and first 500 shipments." },
  { year: "2023", event: "Expanded to 20 cities. Reached 5,000 active users." },
  { year: "2024", event: "40+ cities covered, 12K+ shippers, 98% on-time delivery rate." },
]

const testimonials = [
  { quote: "TransportConnect cut our logistics headaches in half. We ship across Morocco every week—reliable, transparent.", name: "Hamid Oukkal", role: "Operations Manager" },
  { quote: "As a driver, I get more loads and get paid on time. The platform is easy to use and support is always helpful.", name: "Youssef Raji", role: "Independent Driver" },
  { quote: "Real-time tracking and verified partners make all the difference. Finally a platform that connects both sides.", name: "Sara Benkirane", role: "E-commerce Store Owner" },
]

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO — full bleed image + diagonal accent
         ══════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[85vh] flex items-end overflow-hidden bg-foreground dark:bg-card">
        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1750981091421-5ae1eb56cd69?auto=format&fit=crop&w=1920&q=80)",
          }}
        />
        {/* dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/65 to-black/45" />
        {/* diagonal accent stripe */}
        <div
          className="absolute right-0 top-0 h-full w-[38%] opacity-20"
          style={{ background: "linear-gradient(135deg, transparent 50%, var(--primary) 50%)" }}
        />

        {/* content */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-28 pt-24 sm:pt-28 md:pt-36 max-w-6xl mx-auto">
          <motion.p
            {...fadeUp(0)}
            className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-6"
          >
            — Our Platform
          </motion.p>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none mb-6 sm:mb-8 drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            style={{ letterSpacing: "-0.03em" }}
          >
            We Move<br />
            <span className="text-primary">Morocco</span><br />
            Forward
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-white/90 text-base sm:text-lg max-w-md mb-10 leading-relaxed drop-shadow-[0_5px_14px_rgba(0,0,0,0.28)]"
          >
            Built to make freight in Morocco simple, secure, and fair — connecting shippers and drivers in one seamless platform.
          </motion.p>
          <motion.div {...fadeUp(0.28)}>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-8 uppercase font-black tracking-widest text-sm rounded-none">
                Join us today <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS STRIP — floating cards
         ══════════════════════════════════════════════ */}
      <section className="relative z-10 -mt-1 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 -translate-y-6 sm:-translate-y-8">
            {[
              { v: "12K+", l: "Active Shippers", s: "and growing daily" },
              { v: "8K+", l: "Verified Drivers", s: "background-checked" },
              { v: "40+", l: "Cities Covered", s: "across Morocco" },
              { v: "98%", l: "On-Time Rate", s: "industry-leading" },
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
          OUR STORY — image left / text right
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* image */}
            <motion.div {...fadeLeft(0)} className="relative overflow-hidden">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5]">
                <img src="/home/1/3.webp" alt="Our story" className="w-full h-full object-cover" />
              </div>
              {/* timeline pill overlay — hidden on small screens to avoid overflow */}
              <div className="hidden sm:block absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xl max-w-[200px] sm:max-w-[220px]">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Our Journey</p>
                <div className="space-y-3">
                  {milestones.map((m) => (
                    <div key={m.year} className="flex gap-3 items-start">
                      <span className="text-xs font-black text-primary flex-shrink-0 mt-0.5">{m.year}</span>
                      <span className="text-xs text-muted-foreground leading-snug">{m.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* text */}
            <motion.div {...fadeRight(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Our Story</p>
              <h2 className="section-title mb-6">
                Born from a real <span className="text-primary">logistics problem</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  TransportConnect was founded in Casablanca with a simple mission: to make freight transport in Morocco more accessible, efficient, and reliable. We witnessed firsthand the challenges that both shippers and drivers faced in the traditional logistics industry.
                </p>
                <p>
                  Since our launch, we've grown from a small startup to a trusted platform serving thousands of users across Morocco. Our commitment to innovation, security, and customer satisfaction has made us a leader in the logistics technology space.
                </p>
                <p>
                  Today, we continue to evolve our platform, adding new features and expanding our network to better serve our community of shippers and drivers who power Morocco's economy every day.
                </p>
              </div>
              <div className="mt-10">
                <Link to="/trips">
                  <Button className="bg-primary hover:bg-primary/90 text-white min-h-[48px] px-8 uppercase font-bold tracking-wider text-sm rounded-none">
                    Find trips <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VALUES — dark bg bento grid
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-foreground dark:bg-card text-background dark:text-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">All the Perks</motion.p>
            <motion.h2
              {...fadeUp(0.08)}
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase"
              style={{ letterSpacing: "-0.02em" }}
            >
              Why choose <span className="text-primary">TransportConnect</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  {...fadeUp(i * 0.07)}
                  className="group border border-white/10 dark:border-border rounded-2xl p-7 hover:border-primary/50 hover:bg-white/5 dark:hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                  <p className="text-sm opacity-60 leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS — cards with accent border tops
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Happy Users</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="section-title">What our users say</motion.h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.1)}
                className="bg-card border-t-4 border-primary rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-4xl text-primary font-serif leading-none mb-4">"</p>
                <p className="text-foreground text-sm leading-relaxed mb-8 flex-1">{t.quote}</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA — full bleed image
         ══════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/home/2/1.webp)" }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-5">
            Ready to join us?
          </motion.p>
          <motion.h2
            {...fadeUp(0.08)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white mb-6 sm:mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            See all trips & offers
          </motion.h2>
          <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/trips">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-10 uppercase font-black tracking-widest text-sm rounded-none">
                Browse trips <ArrowRight className="w-4 h-4 ml-2 inline-block" />
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
