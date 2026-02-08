import { useState, useCallback } from "react"

const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState(null)

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmation({
        ...options,
        resolve,
      })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (confirmation) {
      confirmation.resolve(true)
      if (confirmation.onConfirm) {
        confirmation.onConfirm()
      }
      setConfirmation(null)
    }
  }, [confirmation])

  const handleCancel = useCallback(() => {
    if (confirmation) {
      confirmation.resolve(false)
      if (confirmation.onCancel) {
        confirmation.onCancel()
      }
      setConfirmation(null)
    }
  }, [confirmation])

  return {
    confirmation,
    confirm,
    handleConfirm,
    handleCancel,
  }
}

export default useConfirmation

