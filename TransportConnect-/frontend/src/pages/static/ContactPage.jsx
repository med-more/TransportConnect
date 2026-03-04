import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Mail, Phone, MapPin, Send, MessageCircle } from "../../utils/icons"
import { useForm } from "react-hook-form"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Input from "../../components/ui/Input"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"
import toast from "react-hot-toast"

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setTimeout(() => {
      toast.success("Thank you! We'll get back to you soon.")
      reset()
      setIsSubmitting(false)
    }, 1000)
  }

  const contactBoxes = [
    { icon: Phone, title: "Phone Number", content: "+212 6XX XXX XXX", link: "tel:+2126XXXXXXXX" },
    { icon: Mail, title: "Email Address", content: "contact@transportconnect.ma", link: "mailto:contact@transportconnect.ma" },
    { icon: MessageCircle, title: "WhatsApp", content: "+212 6XX XXX XXX", link: "https://wa.me/2126XXXXXXXX" },
    { icon: MapPin, title: "Our Office", content: "Casablanca, Morocco", link: "#" },
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
            <li className="font-medium text-foreground" aria-current="page">Contact</li>
          </ol>
        </div>
      </nav>

      {/* Page title section — centered title + breadcrumb on image backdrop (like reference) */}
      <section className="relative min-h-[35vh] sm:min-h-[40vh] flex flex-col justify-center items-center px-4 sm:px-6 py-16 sm:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url(/home/2/1.webp)" }}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Contact Us
          </motion.h1>
        </div>
      </section>

      {/* Main content — two columns: form left, contact details + map right */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Get In Touch form */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">Contact Us</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8">
                Get in touch
              </h2>
              <Card className="p-6 sm:p-8 glass-card border border-border">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                  <Input
                    label="Your name"
                    placeholder="Your Name..."
                    error={errors.name?.message}
                    {...register("name", { required: "Name is required" })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="example@youmail.com"
                    error={errors.email?.message}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <Input
                    label="Subject"
                    placeholder="Title..."
                    error={errors.subject?.message}
                    {...register("subject")}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Message</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[140px] resize-none text-sm sm:text-base"
                      placeholder="Type here..."
                      {...register("message", {
                        required: "Message is required",
                        minLength: { value: 10, message: "Message must be at least 10 characters" },
                      })}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message.message}</p>
                    )}
                  </div>
                  <div className="flex justify-center sm:justify-start pt-2">
                    <Button
                      type="submit"
                      className="min-h-[48px] px-8 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                      loading={isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send now
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>

            {/* Right: intro text, contact boxes 2x2, then map */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6 sm:space-y-8"
            >
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Have a question or need help? We're here to assist you. Reach out via the form, or use the contact details below. Our team typically responds within 24 hours.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {contactBoxes.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <Card className="p-5 sm:p-6 h-full glass-card border border-border hover:border-primary/20 transition-colors duration-300">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">
                              {item.title}
                            </h3>
                            {item.link && item.link !== "#" ? (
                              <a
                                href={item.link}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                              >
                                {item.content}
                              </a>
                            ) : (
                              <p className="text-sm text-muted-foreground">{item.content}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
              <div className="rounded-2xl overflow-hidden border border-border shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.965269576!2d-7.5899!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzNScyMy42Ilc!5e0!3m2!1sen!2sma!4v1234567890"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TransportConnect Office Location"
                  className="w-full h-full min-h-[240px] sm:min-h-[280px]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA section — full-width image background, heading + button */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/home/4/1.webp)" }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base font-semibold tracking-wider uppercase text-white/90 mb-2"
          >
            We're here to help
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto mb-8"
          >
            Ready to streamline your logistics?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border border-white/20 min-h-[48px] px-8">
                Get started
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default ContactPage
