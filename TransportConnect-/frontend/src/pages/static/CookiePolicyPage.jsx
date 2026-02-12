import { motion } from "framer-motion"
import { Cookie, Settings, BarChart3, Shield } from "../../utils/icons"
import Card from "../../components/ui/Card"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const CookiePolicyPage = () => {
  const sections = [
    {
      icon: Cookie,
      title: "What Are Cookies",
      content: [
        "Cookies are small text files that are placed on your device when you visit our website.",
        "They help us provide you with a better experience by remembering your preferences and settings.",
        "Cookies can be 'session' cookies (temporary) or 'persistent' cookies (stored on your device).",
        "We use both first-party cookies (set by TransportConnect) and third-party cookies (set by our partners).",
      ],
    },
    {
      icon: Settings,
      title: "Types of Cookies We Use",
      content: [
        "Essential Cookies: Required for the platform to function properly and cannot be disabled.",
        "Analytics Cookies: Help us understand how visitors interact with our website to improve performance.",
        "Functional Cookies: Remember your preferences and settings for a personalized experience.",
        "Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness.",
      ],
    },
    {
      icon: BarChart3,
      title: "How We Use Cookies",
      content: [
        "To authenticate users and maintain your login session.",
        "To remember your preferences and settings across visits.",
        "To analyze website traffic and user behavior for improvements.",
        "To provide personalized content and recommendations.",
        "To measure the effectiveness of our marketing campaigns.",
      ],
    },
    {
      icon: Shield,
      title: "Managing Cookies",
      content: [
        "You can control and manage cookies through your browser settings.",
        "Most browsers allow you to refuse or delete cookies, but this may affect website functionality.",
        "You can opt-out of certain third-party cookies through their respective privacy policies.",
        "Note that disabling cookies may limit your ability to use some features of our platform.",
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
              Cookie Policy
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
              This Cookie Policy explains how TransportConnect uses cookies and similar technologies to recognize you when
              you visit our website and use our platform.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              By using our website, you consent to the use of cookies in accordance with this policy.
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
                If you have any questions about our use of cookies, please contact us at:
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

export default CookiePolicyPage

