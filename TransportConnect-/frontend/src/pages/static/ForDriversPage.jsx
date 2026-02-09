import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Truck, DollarSign, MapPin, TrendingUp, Clock, CheckCircle, ArrowRight } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import VisualSection from "../../components/ui/VisualSection"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const ForDriversPage = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Earn More",
      description: "Set your own rates and maximize your earnings with direct payments",
    },
    {
      icon: MapPin,
      title: "Flexible Routes",
      description: "Choose routes that work for you and optimize your schedule",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Access a large network of shippers and increase your bookings",
    },
    {
      icon: Clock,
      title: "Work on Your Terms",
      description: "Accept or decline requests based on your availability and preferences",
    },
  ]

  const features = [
    "Set your own pricing",
    "Direct payment processing",
    "Real-time request notifications",
    "Route optimization tools",
    "Verified shipper network",
    "Flexible scheduling",
    "Performance analytics",
    "24/7 platform support",
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
                For Drivers
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Join our network of professional drivers and grow your transport business. Connect with shippers and earn more with every trip.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="large" className="w-full sm:w-auto">
                    Become a Driver
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" size="large" className="w-full sm:w-auto">
                    View Features
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md h-64 sm:h-80 md:h-96">
                <VisualSection
                  type="image"
                  src="/home/3/1.webp"
                  alt="For Drivers"
                  className="w-full h-full rounded-2xl"
                  fallbackIcon={Truck}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Why Drive with TransportConnect?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to grow your transport business
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 h-full border border-border">
                    <div className="p-3 bg-primary/5 rounded-lg w-fit mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Earnings Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Maximize Your Earnings
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Set your own rates and get paid directly
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "100%", label: "Direct Payment" },
              { value: "0%", label: "Commission Fee" },
              { value: "24/7", label: "Request Access" },
              { value: "Flexible", label: "Your Schedule" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="p-6 sm:p-8 border border-border">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-6 sm:mb-8">
                Everything You Need to Succeed
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-border"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">Get Started in 3 Steps</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Create Your Profile", desc: "Register and verify your driver account" },
                  { step: "2", title: "Add Your Vehicle", desc: "Enter your vehicle details and capacity" },
                  { step: "3", title: "Start Earning", desc: "Create trips and accept requests from shippers" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-accent/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Driver Success Stories
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Join drivers who are growing their business with us
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              { name: "Mohamed Tazi", earnings: "+40%", quote: "My earnings increased significantly since joining TransportConnect. The platform is easy to use and payments are always on time." },
              { name: "Hassan Alami", earnings: "500+", quote: "I've completed over 500 successful trips. The steady stream of requests keeps my schedule full." },
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-6 sm:p-8 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-foreground text-lg">{story.name}</p>
                      <p className="text-sm text-muted-foreground">Verified Driver</p>
                    </div>
                    <div className="text-2xl font-bold text-primary">{story.earnings}</div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground italic">"{story.quote}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 sm:mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our network of professional drivers today
            </p>
            <Link to="/register">
              <Button size="large">
                Become a Driver
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default ForDriversPage
