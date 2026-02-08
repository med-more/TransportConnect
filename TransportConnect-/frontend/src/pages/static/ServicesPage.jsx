import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Package, Truck, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const ServicesPage = () => {
  const services = [
    {
      icon: Package,
      title: "Freight Transport",
      description: "Connect with verified transporters for your shipping needs across Morocco",
      features: ["Real-time tracking", "Verified drivers", "Secure payments", "24/7 support"],
    },
    {
      icon: Truck,
      title: "Driver Network",
      description: "Join our network of professional drivers and grow your business",
      features: ["Flexible schedules", "Fair pricing", "Direct payments", "Route optimization"],
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your shipments are protected with our comprehensive security measures",
      features: ["Insurance coverage", "Verified users", "Secure transactions", "Data protection"],
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team",
      features: ["Live chat", "Phone support", "Email support", "Help center"],
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
              Our Services
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Comprehensive logistics solutions designed to simplify freight transport in Morocco
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 sm:p-8 hover:shadow-lg transition-all duration-300 h-full border border-border">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-primary/5 rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">{service.title}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                          <span className="text-sm sm:text-base text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of shippers and drivers already using TransportConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="large" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  Contact Sales
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

export default ServicesPage
