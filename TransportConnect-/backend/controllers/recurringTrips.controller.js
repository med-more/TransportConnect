import RecurringTrip from "../models/RecurringTrip.js"
import { getFirstOccurrence, getNextRunAt } from "../services/recurringTrip.service.js"

export const listRecurringTrips = async (req, res) => {
  try {
    const isDriver = req.user.role === "conducteur"
    const query = isDriver ? { driver: req.user._id } : { isActive: true }
    const recurring = await RecurringTrip.find(query)
      .sort({ nextRunAt: 1 })
      .populate("driver", "firstName lastName avatar")
    const payload = recurring.map((rec) => ensureTemplateTimeFields(rec))
    res.json({ recurringTrips: payload })
  } catch (error) {
    console.error("List recurring trips:", error)
    res.status(500).json({ message: "Erreur lors de la récupération des trajets récurrents" })
  }
}

function ensureTemplateTimeFields(rec) {
  const obj = rec && typeof rec.toObject === "function" ? rec.toObject() : { ...rec }
  if (!obj.template) obj.template = {}
  if (obj.template.departureTime == null || obj.template.departureTime === "") obj.template.departureTime = "08:00"
  if (obj.template.durationHours == null || typeof obj.template.durationHours !== "number") obj.template.durationHours = 8
  return obj
}

export const getRecurringTripById = async (req, res) => {
  try {
    const rec = await RecurringTrip.findById(req.params.id).populate("driver", "firstName lastName avatar phone email")
    if (!rec) return res.status(404).json({ message: "Trajet récurrent non trouvé" })
    const isDriver = req.user.role === "conducteur"
    const driverId = rec.driver?._id?.toString() || rec.driver?.toString()
    if (isDriver && driverId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" })
    }
    const payload = ensureTemplateTimeFields(rec)
    res.json({ recurringTrip: payload })
  } catch (error) {
    console.error("Get recurring trip:", error)
    res.status(500).json({ message: "Erreur lors de la récupération du trajet récurrent" })
  }
}

export const createRecurringTrip = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      driver: req.user._id,
    }
    if (!payload.template.acceptedCargoTypes) payload.template.acceptedCargoTypes = []
    if (!payload.template.departureTime) payload.template.departureTime = "08:00"
    if (payload.template.durationHours == null) payload.template.durationHours = 8

    const rec = new RecurringTrip(payload)
    rec.nextRunAt = getFirstOccurrence(rec)
    await rec.save()

    res.status(201).json({ message: "Trajet récurrent créé", recurringTrip: rec })
  } catch (error) {
    console.error("Create recurring trip:", error)
    res.status(500).json({ message: "Erreur lors de la création du trajet récurrent" })
  }
}

export const updateRecurringTrip = async (req, res) => {
  try {
    const rec = await RecurringTrip.findById(req.params.id)
    if (!rec) return res.status(404).json({ message: "Trajet récurrent non trouvé" })
    if (rec.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" })
    }

    const { frequency, dayOfWeek, dayOfMonth, startDate, endDate, template } = req.body
    const scheduleChanged =
      frequency != null || dayOfWeek != null || dayOfMonth != null || startDate != null
    if (frequency != null) rec.frequency = frequency
    if (dayOfWeek != null) rec.dayOfWeek = dayOfWeek
    if (dayOfMonth != null) rec.dayOfMonth = dayOfMonth
    if (startDate != null) rec.startDate = startDate
    if (endDate !== undefined) rec.endDate = endDate
    if (template != null) rec.template = { ...rec.template.toObject(), ...template }

    if (scheduleChanged) {
      rec.nextRunAt = rec.lastGeneratedAt
        ? getNextRunAt(rec, rec.lastGeneratedAt)
        : getFirstOccurrence(rec)
    }
    await rec.save()

    res.json({ message: "Trajet récurrent modifié", recurringTrip: rec })
  } catch (error) {
    console.error("Update recurring trip:", error)
    res.status(500).json({ message: "Erreur lors de la modification du trajet récurrent" })
  }
}

export const deleteRecurringTrip = async (req, res) => {
  try {
    const rec = await RecurringTrip.findById(req.params.id)
    if (!rec) return res.status(404).json({ message: "Trajet récurrent non trouvé" })
    if (rec.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" })
    }
    await RecurringTrip.findByIdAndDelete(req.params.id)
    res.json({ message: "Trajet récurrent supprimé" })
  } catch (error) {
    console.error("Delete recurring trip:", error)
    res.status(500).json({ message: "Erreur lors de la suppression du trajet récurrent" })
  }
}
