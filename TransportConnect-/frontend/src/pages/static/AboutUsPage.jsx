import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Target, Users, Award, Heart, CheckCircle, ArrowRight } from "../../utils/icons"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import VisualSection from "../../components/ui/VisualSection"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const AboutUsPage = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To revolutionize freight transport in Morocco by connecting shippers with trusted drivers through innovative technology.",
    },
    {
      icon: Heart,
      title: "Our Vision",
      description: "To become the leading logistics platform in North Africa, making transport accessible, affordable, and reliable for everyone.",
    },
    {
      icon: Users,
      title: "Our Team",
      description: "A dedicated team of logistics experts, developers, and customer service professionals working to serve you better every day.",
    },
    {
      icon: Award,
      title: "Our Commitment",
      description: "We're committed to providing the best service, ensuring security, and building trust in every transaction on our platform.",
    },
  ]

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "50,000+", label: "Successful Deliveries" },
    { value: "500+", label: "Verified Drivers" },
    { value: "98%", label: "Satisfaction Rate" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight headline-premium tracking-tight">
                About TransportConnect
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Connecting shippers and drivers across Morocco with innovative logistics solutions
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full h-64 sm:h-80 md:h-96"
            >
              <VisualSection
                type="image"
                src="/home/4/1.webp"
                alt="About TransportConnect"
                className="w-full h-full rounded-lg"
                fallbackIcon={Users}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 headline-premium">
              Our Journey
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Building the future of logistics in Morocco
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8 sm:space-y-12">
              {[
                { year: "2020", title: "Founded", desc: "Started with a vision to transform logistics" },
                { year: "2021", title: "First 1000 Users", desc: "Reached our first milestone" },
                { year: "2023", title: "National Expansion", desc: "Covering all major cities in Morocco" },
                { year: "2024", title: "10,000+ Users", desc: "Continuing to grow and serve more customers" },
              ].map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg sm:text-xl font-bold text-primary">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{milestone.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-auto"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden max-w-md mx-auto lg:max-w-none">
                <VisualSection
                  type="image"
                  src="/home/4/2.webp"
                  alt="Our Journey"
                  className="w-full h-full"
                  fallbackIcon={Target}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-6 sm:mb-8 headline-premium">
              Our Story
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              TransportConnect was founded with a simple mission: to make freight transport in Morocco more accessible,
              efficient, and reliable. We recognized the challenges that both shippers and drivers face in the traditional
              logistics industry and set out to create a solution that benefits everyone.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              Since our launch, we've grown from a small startup to a trusted platform serving thousands of users across
              Morocco. Our commitment to innovation, security, and customer satisfaction has made us a leader in the
              logistics technology space.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Today, we continue to evolve our platform, adding new features and expanding our network to better serve
              our community of shippers and drivers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Trusted Partners
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Working with leading companies across Morocco
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {["Partner 1", "Partner 2", "Partner 3", "Partner 4"].map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="p-6 sm:p-8 glass-card border border-white/30">
                  <div className="text-sm sm:text-base font-medium text-muted-foreground">{partner}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 headline-premium">
              Our Impact
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Numbers that speak for themselves
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="p-6 sm:p-8 hover:shadow-lg transition-shadow glass-card border border-white/30">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary mb-2 sm:mb-3">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 sm:p-8 md:p-10 hover:shadow-lg transition-all duration-300 h-full glass-card border border-white/30">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="p-3 sm:p-4 bg-primary/5 rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2 sm:mb-3">
                          {value.title}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 bg-accent/30">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 sm:mb-6 headline-premium">
              Join Our Community
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Be part of the future of logistics in Morocco
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="large" className="w-full sm:w-auto btn-glow shadow-glow hover:shadow-glow-lg">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default AboutUsPage
