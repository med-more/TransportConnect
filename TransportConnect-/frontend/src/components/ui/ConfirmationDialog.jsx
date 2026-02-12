import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "../../utils/icons"
import Button from "./Button"
import Card from "./Card"
import clsx from "clsx"

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default", // default, danger, success, warning, info
  loading = false,
}) => {
  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const variants = {
    default: {
      icon: Info,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      confirmVariant: "primary",
    },
    danger: {
      icon: AlertTriangle,
      iconColor: "text-destructive",
      iconBg: "bg-destructive/10",
      confirmVariant: "danger",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-success",
      iconBg: "bg-success/10",
      confirmVariant: "primary",
    },
    warning: {
      icon: AlertCircle,
      iconColor: "text-warning",
      iconBg: "bg-warning/10",
      confirmVariant: "primary",
    },
    info: {
      icon: Info,
      iconColor: "text-info",
      iconBg: "bg-info/10",
      confirmVariant: "primary",
    },
  }

  const currentVariant = variants[variant] || variants.default
  const Icon = currentVariant.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto w-full max-w-md"
            >
              <Card className="p-6 sm:p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", currentVariant.iconBg)}>
                    <Icon className={clsx("w-6 h-6", currentVariant.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{title}</h3>
                    {message && <p className="text-sm sm:text-base text-muted-foreground">{message}</p>}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
                    disabled={loading}
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant={currentVariant.confirmVariant}
                    onClick={onConfirm}
                    loading={loading}
                    className="w-full sm:w-auto"
                  >
                    {confirmText}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConfirmationDialog

