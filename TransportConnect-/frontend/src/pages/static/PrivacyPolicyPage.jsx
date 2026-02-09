import { motion } from "framer-motion"
import { Shield, Lock, Eye, FileText } from "lucide-react"
import Card from "../../components/ui/Card"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        "Personal information such as name, email address, phone number, and address when you register for an account.",
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
        "To comply with legal obligations and protect our rights and the rights of our users.",
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
              Privacy Policy
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
              At TransportConnect, we are committed to protecting your privacy and ensuring the security of your personal
              information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
              use our platform.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              By using TransportConnect, you agree to the collection and use of information in accordance with this policy.
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
                  <Card className="p-6 sm:p-8 md:p-10 border border-border">
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
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-sm sm:text-base text-foreground">
                Email: <a href="mailto:privacy@transportconnect.ma" className="text-primary hover:underline">privacy@transportconnect.ma</a>
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default PrivacyPolicyPage

