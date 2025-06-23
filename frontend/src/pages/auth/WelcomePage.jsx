import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Truck, MessageCircle, Star, Shield, Clock, Users, ArrowRight, Sparkles } from 'lucide-react'

const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  }
  
  const sizes = {
    default: "h-10 py-2 px-4",
    lg: "h-11 px-8",
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const WelcomePage = () => {
  const features = [
    {
      icon: Truck,
      title: "Transport sécurisé",
      description: "Transporteurs vérifiés et assurés",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageCircle,
      title: "Chat en temps réel",
      description: "Communication directe avec les transporteurs",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Star,
      title: "Évaluations fiables",
      description: "Système de notation transparent",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Paiement sécurisé",
      description: "Transactions protégées",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Clock,
      title: "Suivi en temps réel",
      description: "Suivez vos colis en direct",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Users,
      title: "Communauté active",
      description: "Réseau de transporteurs professionnels",
      color: "from-rose-500 to-pink-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0072bb] via-[#5bc0eb] to-[#f4f4f4] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0072bb] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#5bc0eb] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-[#222831] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <header className="container mx-auto px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-[#0072bb] to-[#5bc0eb] shadow-2xl rounded-3xl flex items-center justify-center relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Truck className="w-9 h-9 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            </motion.div>
            <div>
              <h1 className="text-4xl font-black text-black">
                TransportConnect
              </h1>
              <p className="text-sm text-black font-medium">Révolutionnez vos transports</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/login"
              className="text-black font-semibold text-lg"
            >
              Se connecter
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                className="bg-transparent border-2 border-[#5bc0eb] text-black font-bold px-6 py-2 rounded-full"
              >
                S'inscrire
              </Button>
            </Link>
          </div>
        </motion.div>
      </header>

      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-2 text-black"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Plateforme Révolutionnaire</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-6xl lg:text-7xl font-black leading-tight"
              >
                <span className="text-black">Connectez-vous</span>
                <br />
                <span className="text-black">avec des transporteurs</span>
                <br />
                <span className="text-black">de confiance</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-black leading-relaxed max-w-lg"
              >
                La plateforme qui révolutionne le transport de marchandises. Trouvez le transporteur idéal ou proposez
                vos services en toute sécurité.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#0072bb] to-[#5bc0eb] text-black font-bold px-8 py-4 rounded-full shadow-2xl"
                >
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-[#222831] text-black font-bold px-8 py-4 rounded-full backdrop-blur-sm"
                >
                  Se connecter
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden"
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0072bb]/20 via-[#5bc0eb]/20 to-[#222831]/20 rounded-3xl blur-xl"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-r from-[#0072bb] to-[#5bc0eb] rounded-2xl p-6 text-black mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3">Trajet Casablanca → Tanger</h3>
                    <div className="space-y-1 text-black">
                      <p>🚚 Départ: 12 Mars 2025, 14:30</p>
                      <p>📦 Capacité: 1200kg disponible</p>
                      <p>🚚 Livraison standard</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-[#0072bb] to-[#5bc0eb] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-black font-bold text-lg">AM</span>
                    </div>
                    <div>
                      <p className="font-bold text-black text-lg">Amine Mansouri</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-black' : 'text-gray-300'} fill-current`} />
                        ))}
                        <span className="text-sm text-black ml-2">4.7 (89 avis)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-black">
                      40DH/kg
                    </p>
                    <p className="text-sm text-green-400 font-semibold">Prix compétitif</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h3 className="text-5xl font-black mb-6">
              <span className="text-black">Pourquoi choisir</span>
              <br />
              <span className="text-black">TransportConnect ?</span>
            </h3>
            <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
              Une plateforme complète qui simplifie le transport de marchandises avec des fonctionnalités innovantes et
              sécurisées.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl from-[#0072bb]/20 to-[#5bc0eb]/20"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r from-[#0072bb] to-[#5bc0eb] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                    >
                      <Icon className="w-8 h-8 text-black" />
                    </div>
                    <h4 className="text-xl font-bold text-black mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-black leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0072bb]/10 via-[#5bc0eb]/10 to-[#222831]/10 rounded-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-5xl font-black mb-6">
                  <span className="text-black">Prêt à commencer ?</span>
                </h3>
                <p className="text-xl text-black mb-10 max-w-2xl mx-auto leading-relaxed">
                  Rejoignez des milliers d'utilisateurs qui font confiance à TransportConnect pour leurs besoins de
                  transport.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#0072bb] to-[#5bc0eb] text-black font-bold px-10 py-4 rounded-full shadow-2xl"
                    >
                      Créer un compte gratuit
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-transparent border-2 border-[#222831] text-black font-bold px-10 py-4 rounded-full backdrop-blur-sm"
                    >
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#222831] text-white py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0072bb] to-[#5bc0eb] rounded-2xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-black" />
                </div>
                <h4 className="text-xl font-bold text-white">TransportConnect</h4>
              </div>
              <p className="text-white leading-relaxed">
                La plateforme de référence pour le transport de marchandises au Maroc.
              </p>
            </div>

            {[
              {
                title: "Produit",
                links: ["Fonctionnalités", "Tarifs", "Sécurité", "API"],
              },
              {
                title: "Support",
                links: ["Centre d'aide", "Contact", "FAQ", "Documentation"],
              },
              {
                title: "Légal",
                links: ["Conditions d'utilisation", "Politique de confidentialité", "Mentions légales", "Cookies"],
              },
            ].map((section, index) => (
              <div key={section.title} className="space-y-4">
                <h5 className="font-bold text-white text-lg">{section.title}</h5>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-white inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white">&copy; 2024 TransportConnect. Tous droits réservés. Fait avec ❤️ au Maroc.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default WelcomePage
