import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ArrowRight, CheckCircle } from "../../utils/icons"
import { useForm } from "react-hook-form"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"
import toast from "react-hot-toast"
import { contactAPI } from "../../services/api"

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
const contactItems = [
  { icon: Phone, title: "Phone Number", content: "+212 6XX XXX XXX", link: "tel:+2126XXXXXXXX" },
  { icon: Mail, title: "Email Address", content: "contact@transportconnect.ma", link: "mailto:contact@transportconnect.ma" },
  { icon: MessageCircle, title: "WhatsApp", content: "+212 6XX XXX XXX", link: "https://wa.me/2126XXXXXXXX" },
  { icon: MapPin, title: "Our Office", content: "Casablanca, Morocco", link: "#" },
]

const whyItems = [
  "Response within 3 minutes on live chat",
  "Dedicated account managers for business clients",
  "Multilingual support (Arabic, French, English)",
  "24/7 emergency assistance hotline",
]

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [ctaBgFailed, setCtaBgFailed] = useState(false)

  const onSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      const res = await contactAPI.submitMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "",
        message: formData.message,
      })
      const ticketId = res?.data?.ticketId
      toast.success(ticketId ? `Message sent. Ticket: ${ticketId}` : "Thank you! We'll get back to you soon.")
      reset()
      setSent(true)
      setTimeout(() => setSent(false), 4000)
    } catch (error) {
      const apiMessage = error?.response?.data?.message
      if (error?.code === "ECONNABORTED") {
        toast.error("Request timed out. Please try again.")
      } else {
        toast.error(apiMessage || "Unable to send message. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <PublicHeader />

      {/* ══════════════════════════════════════════════
          HERO — full bleed like other static pages
         ══════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[88vh] flex items-end overflow-hidden">
        {/* background */}
        <div className="absolute inset-0">
          <img
            src="https://source.unsplash.com/gWWnqqX8rMA/1920x1080"
            alt="Contact TransportConnect"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/home/4/1.webp"
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/65 to-black/45" />
        <div
          className="absolute right-0 top-0 h-full w-[38%] opacity-20"
          style={{ background: "linear-gradient(135deg, transparent 50%, var(--primary) 50%)" }}
        />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-20 pb-14 sm:pb-18 md:pb-24 pt-24 sm:pt-28 md:pt-36 max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-6"
          >
            — We're here for you
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none mb-6 sm:mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            Contact<br />
            <span className="text-primary">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl mb-10"
          >
            Have a question or need help? Our team is ready to assist you. We typically respond within 24 hours.
          </motion.p>
          {/* quick contact pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3"
          >
            <a href="mailto:contact@transportconnect.ma" className="flex items-center gap-2 bg-white/10 hover:bg-primary transition-colors duration-200 rounded-full px-4 py-2.5 group">
              <Mail className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
              <span className="text-xs font-semibold text-white group-hover:text-white transition-colors">contact@transportconnect.ma</span>
            </a>
            <a href="tel:+2126XXXXXXXX" className="flex items-center gap-2 bg-white/10 hover:bg-primary transition-colors duration-200 rounded-full px-4 py-2.5 group">
              <Phone className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
              <span className="text-xs font-semibold text-white group-hover:text-white transition-colors">+212 6XX XXX XXX</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT INFO BAR — floating cards
         ══════════════════════════════════════════════ */}
      <section className="relative z-10 -mt-1 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 -translate-y-6 sm:-translate-y-8">
            {[
              { Icon: Clock, l: "Avg Response", v: "< 3m", s: "always online" },
              { Icon: Phone, l: "Phone Support", v: "24/7", s: "call us anytime" },
              { Icon: Mail, l: "Email Reply", v: "< 24h", s: "guaranteed response" },
              { Icon: MapPin, l: "Head Office", v: "Casablanca", s: "Morocco" },
            ].map((st, i) => (
              <motion.div
                key={st.l}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-card border border-border rounded-2xl px-4 py-4 sm:px-6 sm:py-5 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary leading-none tracking-tight">{st.v}</span>
                  <st.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/30 group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground mt-2">{st.l}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{st.s}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MAIN: FORM + SIDE INFO
         ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">

            {/* ── LEFT: FORM ── */}
            <motion.div {...fadeLeft(0)}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Send us a message</p>
              <h2 className="section-title mb-8">
                Get in <span className="text-primary">touch</span>
              </h2>

              <div className="bg-card border border-border rounded-3xl p-7 sm:p-10">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-5">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        label="Your name"
                        placeholder="Your Name..."
                        error={errors.name?.message}
                        {...register("name", { required: "Name is required" })}
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="example@yourmail.com"
                        error={errors.email?.message}
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                        })}
                      />
                    </div>
                    <Input
                      label="Subject"
                      placeholder="What is this about?"
                      error={errors.subject?.message}
                      {...register("subject")}
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Message</label>
                      <textarea
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[160px] resize-none text-sm transition-all duration-200"
                        placeholder="Tell us how we can help you..."
                        {...register("message", {
                          required: "Message is required",
                          minLength: { value: 10, message: "Message must be at least 10 characters" },
                        })}
                      />
                      {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
                    </div>
                    <Button
                      type="submit"
                      className="w-full min-h-[52px] bg-primary hover:bg-primary/90 text-white rounded-none uppercase font-black tracking-widest text-sm"
                      loading={isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send message
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ── RIGHT: CONTACT INFO + MAP ── */}
            <motion.div {...fadeRight(0)} className="space-y-8">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Contact details</p>
                <h2 className="section-title mb-8">
                  Reach us <span className="text-primary">directly</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div key={item.title} {...fadeUp(index * 0.07)}>
                        <a
                          href={item.link}
                          className={`group flex items-start gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 ${item.link === "#" ? "pointer-events-none" : ""}`}
                        >
                          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                            <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.title}</p>
                            <p className="text-sm font-semibold text-foreground break-all">{item.content}</p>
                          </div>
                        </a>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* why contact us */}
              <motion.div {...fadeUp(0.2)} className="bg-primary/5 border border-primary/20 rounded-3xl p-7">
                <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4">Why contact us?</p>
                <ul className="space-y-3">
                  {whyItems.map((w, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-foreground">{w}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* map */}
              <motion.div {...fadeUp(0.3)} className="rounded-3xl overflow-hidden border border-border shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.965269576!2d-7.5899!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzNScyMy42Ilc!5e0!3m2!1sen!2sma!4v1234567890"
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TransportConnect Office Location"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          IMAGE STRIP + CTA
         ══════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ctaBgFailed ? "/home/4/2.webp" : "https://unsplash.com/photos/1Tjwapb3wow/download?force=true&w=1920"}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            onError={() => setCtaBgFailed(true)}
          />
        </div>
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 sm:mb-5">
            Ready to get started?
          </motion.p>
          <motion.h2
            {...fadeUp(0.08)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white mb-6 sm:mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            Streamline your logistics
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-white/70 max-w-xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg px-2">
            Join thousands of shippers and drivers already using TransportConnect across Morocco.
          </motion.p>
          <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[52px] px-10 uppercase font-black tracking-widest text-sm rounded-none">
                Get started <ArrowRight className="w-4 h-4 ml-2 inline-block" />
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
