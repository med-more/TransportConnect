import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera } from "../../utils/icons"
import Button from "./Button"
import Card from "./Card"
import Input from "./Input"

/**
 * Modal for confirming delivery with optional proof of delivery (POD):
 * signature, photo upload, and notes. Matches project design (card, primary, borders).
 */
const DeliveryConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  confirmText = "Confirm delivery",
  cancelText = "Cancel",
}) => {
  const [signature, setSignature] = useState("")
  const [podNotes, setPodNotes] = useState("")
  const [podPhoto, setPodPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return
    setPodPhoto(file)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPodPhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    onConfirm({ signature: signature.trim(), podNotes: podNotes.trim(), podPhoto: podPhoto || undefined })
    setSignature("")
    setPodNotes("")
    handleRemovePhoto()
  }

  const handleClose = () => {
    setSignature("")
    setPodNotes("")
    handleRemovePhoto()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delivery-confirm-title"
        >
          <Card className="overflow-hidden shadow-xl border border-border">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
              <h2 id="delivery-confirm-title" className="text-lg font-semibold text-foreground">
                Proof of delivery
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                Add optional proof: recipient signature, delivery photo, or notes.
              </p>
              <Input
                label="Recipient signature (optional)"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Name or signature"
                className="bg-background"
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Delivery photo (optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {!photoPreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-sm font-medium">Choose photo</span>
                  </button>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Notes (optional)
                </label>
                <textarea
                  value={podNotes}
                  onChange={(e) => setPodNotes(e.target.value)}
                  placeholder="Delivery notes..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={loading}
                >
                  {cancelText}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  loading={loading}
                  disabled={loading}
                >
                  {confirmText}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DeliveryConfirmModal
