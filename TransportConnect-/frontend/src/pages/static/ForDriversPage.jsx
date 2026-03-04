import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Truck, DollarSign, MapPin, TrendingUp, Clock, CheckCircle, ArrowRight } from "../../utils/icons"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { PublicHeader, PublicFooter } from "../../components/PublicLayout"

const ForDriversPage = () => {
  const benefits = [
    { icon: DollarSign, title: "Earn More", description: "Set your own rates and maximize your earnings with direct payments." },
    { icon: MapPin, title: "Flexible Routes", description: "Choose routes that work for you and optimize your schedule." },
    { icon: TrendingUp, title: "Grow Your Business", description: "Access a large network of shippers and increase your bookings." },
    { icon: Clock, title: "Work on Your Terms", description: "Accept or decline requests based on your availability and preferences." },
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

  const stats = [
    { value: "100%", label: "Direct Payment" },
    { value: "0%", label: "Commission Fee" },
    { value: "24/7", label: "Request Access" },
    { value: "Flexible", label: "Your Schedule" },
  ]

  const steps = [
    { step: "01", title: "Create Your Profile", desc: "Register and verify your driver account" },
    { step: "02", title: "Add Your Vehicle", desc: "Enter your vehicle details and capacity" },
    { step: "03", title: "Start Earning", desc: "Create trips and accept requests from shippers" },
  ]

  const stories = [
    { name: "Mohamed Tazi", earnings: "+40%", quote: "My earnings increased significantly since joining TransportConnect. The platform is easy to use and payments are always on time." },
    { name: "Hassan Alami", earnings: "500+", quote: "I've completed over 500 successful trips. The steady stream of requests keeps my schedule full." },
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
            <li className="font-medium text-foreground" aria-current="page">For Drivers</li>
          </ol>
        </div>
      </nav>

      {/* Hero — full-width image + overlay, centered title + CTA */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex flex-col justify-center items-center px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url(/home/3/1.webp)" }}
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-4xl mx-auto text-white">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-white/80 mb-4"
          >
            Grow your business
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase"
          >
            For Drivers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 text-base sm:text-lg text-white/85 max-w-2xl mx-auto"
          >
            Join our network of professional drivers and grow your transport business. Connect with shippers and earn more with every trip.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border border-white/20 min-h-[48px] px-6 uppercase font-semibold tracking-wider">
                Become a driver
                <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" className="min-h-[48px] px-6 border-2 border-white/70 text-white hover:bg-white/10 hover:border-white">
                View features
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Drive With Us — benefits grid */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Why join us</p>
            <h2 className="section-title mb-3">Why drive with TransportConnect?</h2>
            <p className="section-subtitle mx-auto">Everything you need to grow your transport business</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              const isHighlight = index === 0
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card
                    className={`p-6 sm:p-8 h-full text-center transition-all duration-300 rounded-2xl border ${
                      isHighlight
                        ? "bg-primary text-primary-foreground border-primary shadow-lg"
                        : "glass-card border-border hover:shadow-md"
                    }`}
                  >
                    <div className={`p-3 rounded-xl w-fit mx-auto mb-4 ${isHighlight ? "bg-white/20" : "bg-primary/10"}`}>
                      <Icon className={`w-6 h-6 ${isHighlight ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isHighlight ? "text-primary-foreground" : "text-foreground"}`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed ${isHighlight ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      {benefit.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Maximize Your Earnings — stats */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="section-title mb-3">Maximize your earnings</h2>
            <p className="section-subtitle mx-auto">Set your own rates and get paid directly</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <Card className="p-6 sm:p-8 text-center glass-card border border-border rounded-2xl">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything You Need + Get Started in 3 Steps */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Features</p>
              <h2 className="section-title mb-6">Everything you need to succeed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border-2 border-primary/40 p-6 sm:p-8 bg-card"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Get started in 3 steps</h3>
              <div className="space-y-6">
                {steps.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{item.step}</span>
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

      {/* Driver Success Stories */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-muted/40 dark:bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="section-title mb-3">Driver success stories</h2>
            <p className="section-subtitle mx-auto">Join drivers who are growing their business with us</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {stories.map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-6 sm:p-8 h-full rounded-2xl border ${i === 1 ? "border-primary/50" : "border-border"} glass-card`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-foreground text-lg">{story.name}</p>
                      <p className="text-sm text-muted-foreground">Verified Driver</p>
                    </div>
                    <div className="text-2xl font-bold text-primary">{story.earnings}</div>
                  </div>
                  <span className="text-2xl font-serif text-muted-foreground leading-none">"</span>
                  <p className="text-foreground text-sm sm:text-base mt-1 leading-relaxed">{story.quote}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-3 sm:mb-4">Ready to start earning?</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our network of professional drivers today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="large" className="w-full sm:w-auto btn-glow shadow-glow hover:shadow-glow-lg">
                  Become a driver
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/trips">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  Browse trips
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

export default ForDriversPage
