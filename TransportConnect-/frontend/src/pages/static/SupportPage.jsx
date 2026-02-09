import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { MessageCircle, Book, HelpCircle, Mail, Phone, Search } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Input from "../../components/ui/Input"
import VisualSection from "../../components/ui/VisualSection"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const SupportPage = () => {
  const supportOptions = [
    {
      icon: Book,
      title: "Help Center",
      description: "Browse our comprehensive knowledge base",
      link: "#",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      link: "#",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      link: "mailto:support@transportconnect.ma",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      link: "tel:+2126XXXXXXXX",
    },
  ]

  const faqs = [
    {
      question: "How do I create a shipping request?",
      answer: "Simply log in to your account, click 'Create Request', fill in your shipment details, and submit. Drivers will see your request and can make offers.",
    },
    {
      question: "How are drivers verified?",
      answer: "All drivers go through a verification process including identity verification, vehicle inspection, and insurance verification before they can accept requests.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, bank transfers, and digital wallets. Payments are processed securely through our platform.",
    },
    {
      question: "Can I track my shipment in real-time?",
      answer: "Yes! Once a driver accepts your request, you'll receive real-time GPS tracking updates from pickup to delivery.",
    },
    {
      question: "What if my shipment is damaged?",
      answer: "All shipments are covered by insurance. Contact our support team immediately if you encounter any issues, and we'll help you file a claim.",
    },
    {
      question: "How do I cancel a request?",
      answer: "You can cancel a request from your dashboard as long as it hasn't been accepted by a driver. Once accepted, cancellation policies apply.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-8 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
                How Can We Help?
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                We're here to help you with any questions or issues you may have
              </p>
              <div className="max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for help..."
                    className="pl-12 pr-4 py-3 sm:py-4 text-base"
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full h-64 sm:h-80 md:h-96"
            >
              <VisualSection
                type="image"
                src="/home/1/3.webp"
                alt="Support Center"
                className="w-full h-full rounded-lg"
                fallbackIcon={MessageCircle}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Get Support
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the best way to reach us
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {supportOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 h-full border border-border">
                    <div className="p-3 bg-primary/5 rounded-lg w-fit mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{option.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">{option.description}</p>
                    <a href={option.link}>
                      <Button variant="outline" size="small" className="w-full">
                        Get Help
                      </Button>
                    </a>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Helpful Resources
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to get started and succeed
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: "Getting Started Guide", desc: "Step-by-step tutorials for new users" },
              { title: "Video Tutorials", desc: "Watch and learn from our video library" },
              { title: "Best Practices", desc: "Tips and tricks from experienced users" },
            ].map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 sm:p-8 border border-border hover:shadow-lg transition-shadow">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{resource.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{resource.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions
            </p>
          </motion.div>
          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-6 md:p-8 hover:shadow-lg transition-shadow border border-border">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 bg-primary/5 rounded-lg flex-shrink-0">
                      <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 sm:mb-6">
              Still Need Help?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you
            </p>
            <Link to="/contact">
              <Button size="large">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default SupportPage
