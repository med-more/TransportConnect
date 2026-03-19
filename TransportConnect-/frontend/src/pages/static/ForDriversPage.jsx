import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Truck, DollarSign, MapPin, TrendingUp, Clock, CheckCircle, ArrowRight, Shield } from "../../utils/icons"
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
const stats = [
  { value: "100%", label: "Direct Payment", sub: "no middleman ever" },
  { value: "0%", label: "Commission Fee", sub: "keep everything you earn" },
  { value: "24/7", label: "Request Access", sub: "loads available anytime" },
  { value: "4.9★", label: "Avg Driver Rating", sub: "trusted by shippers" },
]

const benefits = [
  {
    icon: DollarSign,
    title: "Earn More, Keep It All",
    desc: "Set your own rates and receive 100% direct payments — no hidden commissions or fees. You negotiate, you decide.",
    img: "/home/3/1.webp",
    items: ["Set your own price per km", "Instant secure payments", "Zero platform commissions", "Weekly payout reports"],
  },
  {
    icon: MapPin,
    title: "Choose Your Routes",
    desc: "Pick loads that match your schedule, your region, and your truck capacity. Full flexibility, every single day.",
    img: "/home/4/1.webp",
    items: ["Morocco-wide route coverage", "Filter by distance & cargo", "Route optimization tools", "Multi-stop trip support"],
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    desc: "Access a growing network of verified shippers. Build your reputation, get repeat clients, and expand your fleet.",
    img: "/home/2/1.webp",
    items: ["Verified shipper network", "Driver rating & reviews", "Performance analytics", "Repeat-booking history"],
  },
]

const steps = [
  { step: "01", title: "Create Your Profile", desc: "Register in minutes, verify your identity, and complete your driver profile with vehicle details." },
  { step: "02", title: "Add Your Vehicle", desc: "Enter your truck specs, capacity, and the types of cargo you transport." },
  { step: "03", title: "Browse & Accept Loads", desc: "See nearby requests in real-time. Accept, negotiate price, and confirm the trip." },
  { step: "04", title: "Deliver & Get Paid", desc: "Complete the delivery, get rated by the shipper, and receive instant payment." },
]

const features = [
  "Set your own pricing",
  "Direct payment processing",
  "Real-time request notifications",
  "Route optimization tools",
  "Verified shipper network",
  "Flexible scheduling",
  "Performance analytics",
  "24/7 platform support",
  "Insurance on every trip",
]

const stories = [
  {
    name: "Mohamed Tazi",
    role: "Long-Haul Driver · Casablanca",
    earnings: "+40%",
    badge: "Earnings",
    quote: "My earnings increased significantly since joining TransportConnect. The platform is easy to use and payments are always on time. I've never missed a payment.",
    stars: 5,
  },
  {
    name: "Hassan Alami",
    role: "Independent Driver · Marrakech",
    earnings: "500+",
    badge: "Trips",
    quote: "I've completed over 500 successful trips. The steady stream of requests keeps my schedule full. I can choose the routes that fit me perfectly.",
    stars: 5,
  },
  {
    name: "Karim Benali",
    role: "Fleet Owner · Fès",
    earnings: "×3",
    badge: "Fleet Growth",
    quote: "Started with one truck. Thanks to the volume of work from TransportConnect, I now operate a fleet of three vehicles. Game changer for my business.",
    stars: 5,
  },
]

export default function ForDriversPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO — full bleed image with diagonal red accent
         ══════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[92vh] flex items-end overflow-hidden">
        {/* bg */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600320254374-ce2d293c324e?auto=format&fit=crop&w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/65 to-black/45" />
        {/* diagonal accent stripe */}
        <div
          className="absolute right-0 top-0 h-full w-[38%] opacity-20"
          style={{ background: "linear-gradient(135deg, transparent 50%, var(--primary) 50%)" }}
        />

        {/* text */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-28 pt-24 sm:pt-28 md:pt-36 max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-6"
          >
            — For Professional Drivers
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-white leading-none mb-6 sm:mb-8 drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Drive More.<br />
            Earn More.<br />
            <span className="text-primary">On Your Terms.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/90 text-base sm:text-lg max-w-lg mb-10 leading-relaxed drop-shadow-[0_5px_14px_rgba(0,0,0,0.28)]"
          >
            Join thousands of drivers across Morocco. Set your rates, choose your routes, and get paid directly — with zero commissions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-8 uppercase font-black tracking-widest text-sm rounded-none">
                Become a driver <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" className="min-h-[52px] px-8 border-2 border-white/50 text-white hover:bg-white/10 rounded-none uppercase font-bold tracking-widest text-sm">
                View features
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
          BENEFITS — 3 alternating split sections
         ══════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 md:px-8 bg-background pb-12 sm:pb-16 md:pb-20 lg:pb-28 space-y-16 sm:space-y-24 lg:space-y-32">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Why join us</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="section-title">
              Why drive with <span className="text-primary">TransportConnect</span>?
            </motion.h2>
          </div>

          {benefits.map((b, i) => {
            const Icon = b.icon
            const isEven = i % 2 === 0
            return (
              <div key={b.title} className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
                {/* image */}
                <motion.div
                  {...(isEven ? fadeLeft(0) : fadeRight(0))}
                  className={`relative ${!isEven ? "order-1 lg:order-2" : ""}`}
                >
                  <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                    <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-${isEven ? "tr" : "tl"} from-primary/25 to-transparent`} />
                  </div>
                  {/* badge */}
                  <div className={`absolute -bottom-5 ${isEven ? "-right-5 sm:-right-8" : "-left-5 sm:-left-8"} bg-primary text-white p-5 rounded-2xl shadow-2xl`}>
                    <Icon className="w-8 h-8 mb-1" />
                    <p className="font-black text-sm leading-tight">{b.title.split(" ").slice(0, 2).join(" ")}</p>
                  </div>
                </motion.div>

                {/* text */}
                <motion.div
                  {...(isEven ? fadeRight(0) : fadeLeft(0))}
                  className={!isEven ? "order-2 lg:order-1" : ""}
                >
                  <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Benefit 0{i + 1}</p>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase mb-5" style={{ letterSpacing: "-0.02em" }}>
                    {b.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-8">{b.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {b.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button className="bg-primary hover:bg-primary/90 text-white min-h-[48px] px-8 uppercase font-bold tracking-wider text-sm rounded-none">
                      Get started <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS — dark bg numbered timeline
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-foreground dark:bg-card text-background dark:text-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Simple. Fast. Profitable.</motion.p>
            <motion.h2
              {...fadeUp(0.08)}
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase"
              style={{ letterSpacing: "-0.02em" }}
            >
              Get started in <span className="text-primary">4 steps</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.1)} className="relative flex flex-col items-center text-center">
                {/* connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-full top-10 w-full h-px bg-primary/20 -translate-y-1/2" />
                )}
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 flex-shrink-0 z-10 shadow-xl">
                  <span className="text-xl font-black text-white">{s.step}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.45)} className="mt-14 flex justify-center">
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-10 uppercase font-black tracking-widest text-sm rounded-none">
                Start now — it's free <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES + IMAGE — split
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* image */}
            <motion.div {...fadeLeft(0)} className="relative overflow-hidden">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5]">
                <img src="/home/1/3.webp" alt="Driver features" className="w-full h-full object-cover" />
              </div>
              {/* floating card — hidden on small to avoid overflow */}
              <div className="hidden sm:block absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xl max-w-[200px]">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Driver Tools</p>
                <div className="space-y-3">
                  {["Route optimizer", "Real-time loads", "Instant payment", "Trip analytics"].map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-xs text-muted-foreground leading-tight">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* features list */}
            <motion.div {...fadeRight(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Everything You Need</p>
              <h2 className="section-title mb-6">
                Built to help <span className="text-primary">drivers succeed</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Every feature is designed to reduce friction, increase earnings, and make your daily operations smoother.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {features.map((f, i) => (
                  <motion.div key={i} {...fadeUp(i * 0.05)} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </motion.div>
                ))}
              </div>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white min-h-[48px] px-8 uppercase font-bold tracking-wider text-sm rounded-none">
                  Join as a driver <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS — 3 cards with earnings badge
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Real Drivers, Real Results</motion.p>
            <motion.h2 {...fadeUp(0.08)} className="section-title">
              Driver success <span className="text-primary">stories</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {stories.map((s, i) => (
              <motion.div
                key={s.name}
                {...fadeUp(i * 0.1)}
                className="bg-card border-t-4 border-primary rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* earnings badge */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-black text-foreground text-lg">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-primary">{s.earnings}</span>
                    <span className="text-xs text-muted-foreground">{s.badge}</span>
                  </div>
                </div>
                {/* stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: s.stars }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-primary fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-4xl text-primary font-serif leading-none mb-3">"</p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA — full bleed image
         ══════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/home/4/2.webp)" }} />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-5">
            Ready to earn more?
          </motion.p>
          <motion.h2
            {...fadeUp(0.08)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white mb-6 sm:mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            Start driving today
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-white/70 max-w-lg mx-auto mb-8 sm:mb-10 text-base sm:text-lg px-2">
            Join thousands of drivers already earning more with TransportConnect across Morocco.
          </motion.p>
          <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-10 uppercase font-black tracking-widest text-sm rounded-none">
                Become a driver <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
            <Link to="/trips">
              <Button variant="outline" className="min-h-[52px] px-10 border-2 border-white/50 text-white hover:bg-white/10 rounded-none uppercase font-bold tracking-widest text-sm">
                Browse trips
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
