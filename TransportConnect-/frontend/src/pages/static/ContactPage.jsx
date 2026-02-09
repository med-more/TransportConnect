import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"
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
    // Simulate form submission
    setTimeout(() => {
      toast.success("Thank you! We'll get back to you soon.")
      reset()
      setIsSubmitting(false)
    }, 1000)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: "+212 6XX XXX XXX",
      link: "tel:+2126XXXXXXXX",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@transportconnect.ma",
      link: "mailto:contact@transportconnect.ma",
    },
    {
      icon: MapPin,
      title: "Address",
      content: "Casablanca, Morocco",
      link: "#",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Have a question or need help? We're here to assist you. Reach out to us through any of the channels below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 sm:p-8 md:p-10 shadow-lg border border-border">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">Send us a Message</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input
                      label="First Name"
                      placeholder="John"
                      error={errors.firstName?.message}
                      {...register("firstName", { required: "First name is required" })}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      error={errors.lastName?.message}
                      {...register("lastName", { required: "Last name is required" })}
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
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
                    label="Phone (Optional)"
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] sm:min-h-[140px] resize-none text-sm sm:text-base"
                      placeholder="Tell us how we can help you..."
                      {...register("message", {
                        required: "Message is required",
                        minLength: { value: 10, message: "Message must be at least 10 characters" },
                      })}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1 sm:mt-2">{errors.message.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" loading={isSubmitting}>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-6 sm:mb-8">
                  Contact Information
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <motion.div
                        key={info.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-4 sm:p-6 md:p-8 hover:shadow-lg transition-all duration-300 border border-border">
                          <div className="flex items-start gap-4 sm:gap-6">
                            <div className="p-3 sm:p-4 bg-primary/5 rounded-lg flex-shrink-0">
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-base sm:text-lg md:text-xl">
                                {info.title}
                              </h3>
                              <a
                                href={info.link}
                                className="text-sm sm:text-base md:text-lg text-muted-foreground hover:text-primary transition-colors break-all"
                              >
                                {info.content}
                              </a>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <Card className="p-6 sm:p-8 md:p-10 bg-accent/30 border border-border">
                <h3 className="font-semibold text-foreground mb-4 sm:mb-6 text-lg sm:text-xl md:text-2xl">
                  Business Hours
                </h3>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Find Us
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Visit our office in Casablanca, Morocco
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-border shadow-lg"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.965269576!2d-7.5899!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzNScyMy42Ilc!5e0!3m2!1sen!2sma!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TransportConnect Office Location"
              className="w-full h-full"
            ></iframe>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default ContactPage
