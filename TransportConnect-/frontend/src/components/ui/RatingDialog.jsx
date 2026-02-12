import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star } from "../../utils/icons"
import Button from "./Button"
import Card from "./Card"
import Textarea from "./Textarea"
import clsx from "clsx"

const RatingDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Rate this delivery",
  message = "How would you rate this experience?",
  confirmText = "Submit Rating",
  cancelText = "Cancel",
  loading = false,
  existingRating = null,
}) => {
  const [rating, setRating] = useState(existingRating?.rating || 0)
  const [comment, setComment] = useState(existingRating?.comment || "")

  // Reset when dialog opens/closes or existingRating changes
  useEffect(() => {
    if (isOpen) {
      setRating(existingRating?.rating || 0)
      setComment(existingRating?.comment || "")
    }
  }, [isOpen, existingRating])

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
    if (rating < 1 || rating > 5) {
      return
    }
    onConfirm({ rating, comment: comment.trim() })
  }

  const handleStarClick = (value) => {
    setRating(value)
  }

  const handleStarHover = (value) => {
    // Optional: Add hover effect
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
              <Card className="p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-warning/10 rounded-xl flex-shrink-0">
                      <Star className="w-6 h-6 text-warning fill-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{title}</h3>
                      {message && <p className="text-sm sm:text-base text-muted-foreground">{message}</p>}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0 ml-4"
                    disabled={loading}
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Star Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-4">
                    Your Rating <span className="text-destructive">*</span>
                  </label>
                  <div className="flex items-center gap-3 justify-center sm:justify-start mb-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleStarClick(value)}
                        onMouseEnter={() => handleStarHover(value)}
                        className={clsx(
                          "focus:outline-none transition-all duration-200 rounded-lg p-2",
                          "hover:bg-warning/10 hover:scale-110 active:scale-95",
                          value <= rating && "bg-warning/10 scale-110"
                        )}
                        disabled={loading}
                      >
                        <Star
                          className={clsx(
                            "w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200",
                            value <= rating
                              ? "text-warning fill-warning"
                              : "text-muted-foreground/30 fill-muted-foreground/10"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <div className="p-3 bg-accent rounded-lg text-center sm:text-left">
                      <p className="text-sm font-medium text-foreground">
                        {rating === 1 && "Poor - We're sorry to hear that"}
                        {rating === 2 && "Fair - We appreciate your feedback"}
                        {rating === 3 && "Good - Thank you for your feedback"}
                        {rating === 4 && "Very Good - We're glad you had a good experience"}
                        {rating === 5 && "Excellent - We're thrilled you loved it!"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Additional Comments <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                  </label>
                  <Textarea
                    placeholder="Tell us more about your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={loading}
                    rows={4}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      Help others by sharing your experience
                    </p>
                    <p className={clsx(
                      "text-xs font-medium",
                      comment.length > 450 ? "text-warning" : "text-muted-foreground"
                    )}>
                      {comment.length}/500
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirm}
                    loading={loading}
                    disabled={rating < 1 || rating > 5}
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

export default RatingDialog

