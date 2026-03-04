import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight } from "../../utils/icons"
import Button from "../../components/ui/Button"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const AboutUsPage = () => {
  const perks = [
    { title: "Verified Drivers", desc: "Every transporter is background-checked and verified for your peace of mind." },
    { title: "Real-time Tracking", desc: "Follow your shipment from pickup to delivery with live GPS updates." },
    { title: "Secure Payments", desc: "Safe, transparent payments with protection for shippers and drivers." },
    { title: "24/7 Support", desc: "Our team is here whenever you need help or have questions." },
    { title: "Fair Pricing", desc: "Compare offers and choose the best rate for your shipment." },
  ]

  const testimonials = [
    { quote: "TransportConnect cut our logistics headaches in half. We ship across Morocco every week—reliable, transparent, and simple.", border: "border-border" },
    { quote: "As a driver, I get more loads and get paid on time. The platform is easy to use and the support team is always helpful.", border: "border-primary/50" },
    { quote: "Finally a platform that connects shippers and drivers without the hassle. Real-time tracking and verified partners make all the difference.", border: "border-primary" },
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
            <li className="font-medium text-foreground" aria-current="page">About Us</li>
          </ol>
        </div>
      </nav>

      {/* Hero — image bg with overlay; text stays light on overlay for contrast */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex flex-col justify-center items-center px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url(/home/4/1.webp)" }}
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-4xl mx-auto text-white">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-white/80 mb-4"
          >
            Our Platform
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase"
          >
            About Us
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 sm:mt-10"
          >
            <Link to="/trips">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border border-white/20 uppercase font-semibold tracking-wider px-6 py-3 rounded min-h-[48px]">
                Find Trips
                <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* All the Perks — two columns: left = label + title + text, right = bordered perks grid */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">About Us</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">All the Perks.</h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg">
                We built TransportConnect to make freight in Morocco simple, secure, and fair. From verified drivers and real-time tracking to 24/7 support and transparent pricing—everything you need is in one place.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border-2 border-primary/40 rounded-2xl p-6 sm:p-8 bg-card"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {perks.map((item, i) => (
                  <div key={item.title} className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story — small red label centered, justified text block */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-8"
          >
            Our Story
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-base sm:text-lg leading-relaxed text-justify space-y-4"
          >
            <p>
              TransportConnect was founded with a simple mission: to make freight transport in Morocco more accessible, efficient, and reliable. We recognized the challenges that both shippers and drivers face in the traditional logistics industry and set out to create a solution that benefits everyone.
            </p>
            <p>
              Since our launch, we have grown from a small startup to a trusted platform serving thousands of users across Morocco. Our commitment to innovation, security, and customer satisfaction has made us a leader in the logistics technology space.
            </p>
            <p>
              Today, we continue to evolve our platform, adding new features and expanding our network to better serve our community of shippers and drivers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us — HAPPY USERS (red), title, 3 testimonial cards with quote + different borders */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3"
          >
            Happy Users
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12 sm:mb-16"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border-2 ${card.border} bg-card p-6 sm:p-8 min-h-[220px] flex flex-col`}
              >
                <span className="text-4xl sm:text-5xl font-serif text-muted-foreground leading-none">"</span>
                <p className="text-foreground text-sm sm:text-base leading-relaxed mt-2 flex-1">{card.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip — blurred / dark bg, single button */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/home/2/1.webp)" }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative z-10 text-center">
          <Link to="/trips">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border border-border uppercase font-semibold tracking-wider px-6 py-3 rounded min-h-[48px]">
              See All Trips and Offers
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default AboutUsPage
