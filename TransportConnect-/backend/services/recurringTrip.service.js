import RecurringTrip from "../models/RecurringTrip.js"
import Trip from "../models/Trip.js"
import { createNotification } from "../utils/notifications.js"

/**
 * Get the first occurrence date on or after startDate for a recurring rule.
 */
export function getFirstOccurrence(recurring) {
  const start = new Date(recurring.startDate)
  start.setHours(0, 0, 0, 0)
  if (recurring.frequency === "weekly") {
    const next = new Date(start)
    while (next.getDay() !== recurring.dayOfWeek) {
      next.setDate(next.getDate() + 1)
    }
    return next
  }
  if (recurring.frequency === "monthly") {
    const next = new Date(start.getFullYear(), start.getMonth(), 1)
    const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
    const day = Math.min(recurring.dayOfMonth, lastDay)
    next.setDate(day)
    if (next < start) {
      next.setMonth(next.getMonth() + 1)
      const lastDay2 = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
      next.setDate(Math.min(recurring.dayOfMonth, lastDay2))
    }
    return next
  }
  return start
}

/**
 * Compute the next run date for a recurring trip after a given date.
 * @param {Object} recurring - RecurringTrip document (or plain object with frequency, dayOfWeek/dayOfMonth)
 * @param {Date} afterDate - Date after which to compute next occurrence
 * @returns {Date} Next run date (date only, time 00:00:00)
 */
export function getNextRunAt(recurring, afterDate) {
  const after = new Date(afterDate)
  after.setHours(0, 0, 0, 0)

  if (recurring.frequency === "weekly") {
    const dayOfWeek = recurring.dayOfWeek
    const next = new Date(after)
    next.setDate(next.getDate() + 1)
    while (next.getDay() !== dayOfWeek) {
      next.setDate(next.getDate() + 1)
    }
    return next
  }

  if (recurring.frequency === "monthly") {
    const next = new Date(after.getFullYear(), after.getMonth() + 1, 1)
    const lastDay = new Date(next.getFullYear(), next.getMonth(), 0).getDate()
    const day = Math.min(recurring.dayOfMonth, lastDay)
    next.setDate(day)
    return next
  }

  return null
}

/**
 * Parse "HH:mm" and set on date.
 */
function setTimeOnDate(date, timeStr, durationHours = 8) {
  const [h, m] = (timeStr || "08:00").split(":").map(Number)
  const d = new Date(date)
  d.setHours(h || 8, m || 0, 0, 0)
  return d
}

/**
 * Create a Trip from a RecurringTrip for the given nextRunAt date.
 */
export async function createTripFromRecurring(recurring, nextRunAt) {
  const t = recurring.template
  const departureTime = t.departureTime || "08:00"
  const durationHours = t.durationHours || 8

  const departureDate = setTimeOnDate(nextRunAt, departureTime)
  const arrivalDate = new Date(departureDate.getTime() + durationHours * 60 * 60 * 1000)

  const tripData = {
    driver: recurring.driver,
    departure: t.departure,
    destination: t.destination,
    intermediateStops: [],
    departureDate,
    arrivalDate,
    availableCapacity: t.availableCapacity,
    acceptedCargoTypes: t.acceptedCargoTypes || [],
    otherCargoType: t.otherCargoType,
    pricePerKg: t.pricePerKg,
    description: t.description,
    status: "active",
    requests: [],
    acceptedRequests: [],
  }

  const trip = new Trip(tripData)
  trip.departureDate = departureDate
  trip.arrivalDate = arrivalDate
  trip.fromRecurring = recurring._id
  await trip.save()
  return trip
}

/**
 * Run the recurring-trips job: find due rules, create trips, advance nextRunAt, optionally notify.
 */
export async function runRecurringTripsJob() {
  const now = new Date()
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  const due = await RecurringTrip.find({
    isActive: true,
    nextRunAt: { $lte: todayEnd },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  }).populate("driver", "firstName")

  for (const rec of due) {
    try {
      const nextRunAt = new Date(rec.nextRunAt)
      nextRunAt.setHours(0, 0, 0, 0)

      const t = rec.template
      const [h, m] = (t?.departureTime || "08:00").split(":").map(Number)
      const departureDate = new Date(nextRunAt)
      departureDate.setHours(h || 8, m || 0, 0, 0)

      rec.lastGeneratedAt = nextRunAt
      rec.nextRunAt = getNextRunAt(rec, nextRunAt)
      await rec.save()

      if (departureDate > now) {
        const trip = await createTripFromRecurring(rec, nextRunAt)
        const dateStr = nextRunAt.toLocaleDateString()
        await createNotification({
          recipientId: rec.driver._id,
          type: "info",
          title: "Recurring trip created",
          message: `Your recurring trip for ${dateStr} has been created.`,
          relatedTripId: trip._id.toString(),
        })
      }
    } catch (err) {
      console.error("Recurring trip job: failed to create trip for", rec._id, err)
    }
  }
}
