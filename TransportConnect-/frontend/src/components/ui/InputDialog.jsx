import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Button from "./Button"
import Card from "./Card"
import Input from "./Input"

const InputDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
  type = "text",
  defaultValue = "",
}) => {
  const [inputValue, setInputValue] = useState(defaultValue)

  // Reset input when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue)
    }
  }, [isOpen, defaultValue])

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

  const handleConfirm = () => {
    onConfirm(inputValue)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleConfirm()
    }
  }

  const variants = {
    default: "primary",
    danger: "danger",
    success: "primary",
    warning: "primary",
    info: "primary",
  }

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
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{title}</h3>
                    {message && <p className="text-sm sm:text-base text-muted-foreground">{message}</p>}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0 ml-4"
                    disabled={loading}
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Input */}
                <div className="mb-6">
                  <Input
                    type={type}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                    disabled={loading}
                  />
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
                    variant={variants[variant]}
                    onClick={handleConfirm}
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

export default InputDialog

