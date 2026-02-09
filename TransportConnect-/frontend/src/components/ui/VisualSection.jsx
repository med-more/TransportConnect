import { useState } from "react"
import { motion } from "framer-motion"

/**
 * VisualSection Component
 * Supports both Lottie animations and images
 * 
 * @param {string} type - 'lottie' or 'image'
 * @param {string} src - Path to Lottie JSON or image
 * @param {string} alt - Alt text for images
 * @param {string} className - Additional CSS classes
 * @param {object} lottieOptions - Options for Lottie (if type is 'lottie')
 * @param {React.Component} fallbackIcon - Icon component to show if image fails to load
 */
const VisualSection = ({ 
  type = "image", 
  src, 
  alt = "", 
  className = "",
  lottieOptions = {},
  fallbackIcon: FallbackIcon = null 
}) => {
  const [error, setError] = useState(false)

  // Lottie support (will be enabled when lottie-react is installed)
  if (type === "lottie") {
    // Placeholder for Lottie - will work when lottie-react is installed
    return (
      <div className={`relative ${className}`}>
        {error && FallbackIcon ? (
          <div className="flex items-center justify-center w-full h-full bg-accent/30 rounded-lg">
            <FallbackIcon className="w-24 h-24 text-primary/20" />
          </div>
        ) : (
          <div className="w-full h-full bg-accent/30 rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Lottie animation placeholder</p>
          </div>
        )}
      </div>
    )
  }

  const handleImageError = () => {
    setError(true)
  }

  // Image rendering with fallback
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-lg ${className}`}
    >
      {error && FallbackIcon ? (
        <div className="flex items-center justify-center w-full h-full bg-accent/30 p-8 rounded-lg">
          <FallbackIcon className="w-24 h-24 text-primary/20" />
        </div>
      ) : src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        FallbackIcon && (
          <div className="flex items-center justify-center w-full h-full bg-accent/30 p-8 rounded-lg">
            <FallbackIcon className="w-24 h-24 text-primary/20" />
          </div>
        )
      )}
    </motion.div>
  )
}

export default VisualSection

