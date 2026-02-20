import { motion } from "framer-motion"
import { FileText, Scale, AlertTriangle, CheckCircle } from "../../utils/icons"
import Card from "../../components/ui/Card"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const TermsOfServicePage = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using TransportConnect, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, you must not use our platform.",
        "We reserve the right to modify these terms at any time, and such modifications will be effective immediately upon posting.",
        "Your continued use of the platform after changes are posted constitutes acceptance of the modified terms.",
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

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight headline-premium tracking-tight">
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-6">
              These Terms of Service govern your use of the TransportConnect platform. Please read them carefully before
              using our services.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              By using TransportConnect, you agree to comply with and be bound by these terms. If you disagree with any part
              of these terms, you may not access or use our services.
            </p>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 sm:p-8 md:p-10 glass-card border border-white/30">
                    <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="p-3 bg-primary/5 rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">{section.title}</h2>
                    </div>
                    <ul className="space-y-3 sm:space-y-4 ml-0 sm:ml-16">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                          <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-12"
          >
            <Card className="p-6 sm:p-8 md:p-10 bg-accent/30 border border-border">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">Contact Us</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-sm sm:text-base text-foreground">
                Email: <a href="mailto:legal@transportconnect.ma" className="text-primary hover:underline">legal@transportconnect.ma</a>
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default TermsOfServicePage

