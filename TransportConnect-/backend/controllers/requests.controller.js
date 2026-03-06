import Request from "../models/Request.js"
import User from "../models/User.js"
import Trip from "../models/Trip.js"
import Chat from "../models/Chat.js"
import { createNotification, getNotificationMessages } from "../utils/notifications.js"
import { sendNotificationEmailToUser } from "../services/email.service.js"




export const getPriceEstimate = async (req, res) => {
  try {
    const { tripId, weight } = req.body
    if (!tripId || weight == null || weight <= 0) {
      return res.status(400).json({
        message: "tripId and weight (positive number) are required",
      })
    }
    const trip = await Trip.findById(tripId).select("pricePerKg availableCapacity")
    if (!trip) {
      return res.status(404).json({ message: "Trajet non trouvé" })
    }
    const w = Number(weight)
    if (w > (trip.availableCapacity?.weight ?? 0)) {
      return res.status(400).json({
        message: "Le poids dépasse la capacité disponible du trajet",
        availableWeight: trip.availableCapacity?.weight,
      })
    }
    const estimatedPrice = w * (trip.pricePerKg ?? 0)
    res.json({
      estimatedPrice: Math.round(estimatedPrice * 100) / 100,
      currency: "MAD",
      weight: w,
      pricePerKg: trip.pricePerKg,
    })
  } catch (error) {
    console.error("getPriceEstimate error:", error)
    res.status(500).json({ message: "Erreur lors du calcul de l'estimation" })
  }
}

export const getUserRequests = async (req, res) => {
  
    try {
      const { status, page = 1, limit = 10 } = req.query
  
      const filter = { sender: req.user._id }
      if (status) {
        filter.status = status
      }
  
      const requests = await Request.find(filter)
        .populate({
          path: "trip",
          select: "departure destination departureDate driver",
          populate: {
            path: "driver",
            select: "firstName lastName avatar stats",
          },
        })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
  
      const total = await Request.countDocuments(filter)
  
      res.json({
        requests,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRequests: total,
        },
      })
    } catch (error) {
      console.error("Erreur récupération demandes:", error)
      res.status(500).json({ message: "Erreur lors de la récupération des demandes" })
    }
  }

export const getReceivedRequests = async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query
  
      const driverTrips = await Trip.find({ driver: req.user._id }).select("_id")
      const tripIds = driverTrips.map((trip) => trip._id)
  
      const filter = { trip: { $in: tripIds } }
      if (status) {
        filter.status = status
      }
  
      const requests = await Request.find(filter)
        .populate("sender", "firstName lastName avatar stats phone")
        .populate({
          path: "trip",
          select: "departure destination departureDate availableCapacity driver",
          populate: {
            path: "driver",
            select: "firstName lastName avatar stats",
          },
        })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
  
      const total = await Request.countDocuments(filter)
  
      res.json({
        requests,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRequests: total,
        },
      })
    } catch (error) {
      console.error("Erreur récupération demandes reçues:", error)
      res.status(500).json({ message: "Erreur lors de la récupération des demandes reçues" })
    }
}
  
export const getRequestById = async (req, res) => {
    try {
      const request = await Request.findById(req.params.id)
        .populate("sender", "firstName lastName avatar stats phone email")
        .populate({
          path: "trip",
          populate: {
            path: "driver",
            select: "firstName lastName avatar stats phone email",
          },
        })
  
      if (!request) {
        return res.status(404).json({ message: "Demande non trouvée" })
      }
  
   
      const isOwner = request.sender._id.toString() === req.user._id.toString()
      const isDriver = request.trip.driver._id.toString() === req.user._id.toString()
      const isAdmin = req.user.role === "admin"
  
      if (!isOwner && !isDriver && !isAdmin) {
        return res.status(403).json({ message: "Accès refusé" })
      }
  
      res.json({ request })
    } catch (error) {
      console.error("Erreur récupération demande:", error)
      res.status(500).json({ message: "Erreur lors de la récupération de la demande" })
    }
  }

export const createRequest = async (req, res) => {
  try {
    const { tripId, ...requestData } = req.body

    const trip = await Trip.findById(tripId).populate("driver")
    if (!trip) {
      return res.status(404).json({ message: "Trajet non trouvé" })
    }

    if (!trip.driver) {
      return res.status(400).json({ message: "Le conducteur du trajet est introuvable" })
    }

    if (trip.status !== "active") {
      return res.status(400).json({ message: "Ce trajet n'est plus disponible" })
    }

    if  (trip.driver && trip.driver._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Vous ne pouvez pas demander votre propre trajet" })
    }

    if (requestData.cargo.weight > trip.availableCapacity.weight) {
      return res.status(400).json({
        message: "Le poids de votre colis dépasse la capacité disponible",
      })
    }

    if (!trip.acceptedCargoTypes.includes(requestData.cargo.type)) {
      return res.status(400).json({
        message: "Ce type de cargaison n'est pas accepté pour ce trajet",
      })
    }

    const existingRequest = await Request.findOne({
      sender: req.user._id,
      trip: tripId,
      status: { $in: ["pending", "accepted"] },
    })

    if (existingRequest) {
      return res.status(400).json({
        message: "Vous avez déjà une demande en cours pour ce trajet",
      })
    }

    const request = new Request({
      ...requestData,
      sender: req.user._id,
      trip: tripId,
    })

    await request.save()

    trip.requests.push(request._id)
    await trip.save()

    await request.populate([
      { path: "sender", select: "firstName lastName avatar" },
      { 
        path: "trip", 
        select: "departure destination departureDate driver",
        populate: {
          path: "driver",
          select: "_id firstName lastName email",
        },
      },
    ])

    const chat = new Chat({
      request: request._id,
      participants: [req.user._id, trip.driver._id],
      messages: [],
      isActive: true,
    })
    await chat.save()

    try {
      await sendNotificationEmailToUser(
        trip.driver._id,
        "Nouvelle demande de transport",
        `Vous avez reçu une nouvelle demande de transport de ${req.user.firstName} ${req.user.lastName}.`,
      )
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError)
    }

    // Create notification for driver
    try {
      // Ensure trip.driver is populated
      if (!trip.driver || !trip.driver._id) {
        console.error("❌ Cannot create notification: trip.driver is not populated")
        // Try to populate it
        await trip.populate("driver", "_id firstName lastName")
      }
      
      const driverId = trip.driver?._id || trip.driver
      if (!driverId) {
        console.error("❌ Cannot create notification: driverId is missing", {
          tripDriver: trip.driver,
          tripId: trip._id,
        })
      } else {
        const { title, message } = getNotificationMessages("request_created", {
          shipperName: `${req.user.firstName} ${req.user.lastName}`,
          tripRoute: `${trip.departure.city} → ${trip.destination.city}`,
        })
        console.log("🔔 Creating notification for driver:", {
          recipientId: driverId,
          senderId: req.user._id,
          type: "request_created",
          requestId: request._id,
          tripId: tripId,
        })
        const notification = await createNotification({
          recipientId: driverId,
          senderId: req.user._id,
          type: "request_created",
          title,
          message,
          relatedRequestId: request._id,
          relatedTripId: tripId,
        })
        const ioNotif = req.app.get("io")
        if (ioNotif && notification) {
          ioNotif.to(`user_${notification.recipient}`).emit("new_notification", notification)
        }
        console.log("✅ Notification created successfully:", notification._id)
      }
    } catch (notifError) {
      console.error("❌ Error creating notification:", notifError)
      console.error("❌ Error stack:", notifError.stack)
    }

    const io = req.app.get("io")
    console.log("🔔 Émission de l'événement new_request vers:", `user_${trip.driver._id}`)
    console.log("📤 Données envoyées:", {
      requestId: request._id,
      sender: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        avatar: req.user.avatar,
      },
      trip: {
        departure: trip.departure.city,
        destination: trip.destination.city,
      },
      cargo: request.cargo,
    })
    
    io.to(`user_${trip.driver._id}`).emit("new_request", {
      requestId: request._id,
      sender: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        avatar: req.user.avatar,
      },
      trip: {
        departure: trip.departure.city,
        destination: trip.destination.city,
      },
      cargo: request.cargo,
    })

    res.status(201).json({
      message: "Demande créée avec succès",
      request,
    })
  } catch (error) {
    console.error("Erreur création demande:", error)
    res.status(500).json({ message: "Erreur lors de la création de la demande" })
  }
}

export const acceptRequest = async (req, res) => {
    try {
      const { message } = req.body
  
      const request = await Request.findById(req.params.id)
        .populate("sender", "firstName lastName email _id")
        .populate({
          path: "trip",
          select: "driver departure destination _id",
          populate: {
            path: "driver",
            select: "firstName lastName _id",
          },
        })
  
      if (!request) {
        return res.status(404).json({ message: "Demande non trouvée" })
      }

      const driverId = request.trip.driver?._id || request.trip.driver || request.trip.driver
  
      if (!driverId || driverId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Non autorisé à accepter cette demande" })
      }
  
      if (request.status !== "pending") {
        return res.status(400).json({ message: "Cette demande ne peut plus être acceptée" })
      }
  
      // Vérifier que la demande n'est pas déjà acceptée par quelqu'un d'autre
      if (request.status === "accepted" && request.driverResponse) {
        return res.status(400).json({ 
          message: "Cette demande a déjà été acceptée par un autre conducteur" 
        })
      }
  
      // Vérifier la capacité disponible en temps réel
      const tripId = request.trip._id || request.trip
      const trip = await Trip.findById(tripId)
      if (!trip) {
        return res.status(404).json({ message: "Trajet non trouvé" })
      }

      // Calculer la capacité déjà utilisée par les demandes acceptées
      const acceptedRequests = await Request.find({
        trip: trip._id,
        status: "accepted"
      })

      const usedCapacity = acceptedRequests.reduce((total, req) => total + req.cargo.weight, 0)
      const availableCapacity = trip.availableCapacity.weight - usedCapacity

      console.log("🔍 Vérification capacité:", {
        tripCapacity: trip.availableCapacity.weight,
        usedCapacity,
        availableCapacity,
        requestWeight: request.cargo.weight
      })

      if (request.cargo.weight > availableCapacity) {
        return res.status(400).json({
          message: `Capacité insuffisante pour accepter cette demande. Disponible: ${availableCapacity}kg, Demandé: ${request.cargo.weight}kg`,
        })
      }
  
      
      request.status = "accepted"
      request.driverResponse = {
        message: message || "Demande acceptée",
        respondedAt: new Date(),
      }
      await request.save()
  
      
      trip.acceptedRequests.push(request._id)
      trip.availableCapacity.weight -= request.cargo.weight
      await trip.save()
  
     
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { "stats.totalRequests": 1 },
      })
  
      try {
        await sendNotificationEmailToUser(
          request.sender._id,
          "Demande acceptée",
          `Votre demande de transport a été acceptée par ${req.user.firstName} ${req.user.lastName}.`,
        )
      } catch (emailError) {
        console.error("Erreur envoi email:", emailError)
      }
  
      
      const io = req.app.get("io")
      const targetUserId = request.sender._id.toString()
      const targetRoom = `user_${targetUserId}`
      
      console.log("🔔 Émission de l'événement request_accepted")
      console.log("📤 Target User ID:", targetUserId)
      console.log("📤 Target Room:", targetRoom)
      console.log("📤 Données envoyées:", {
        requestId: request._id,
        driver: {
          name: `${req.user.firstName} ${req.user.lastName}`,
          avatar: req.user.avatar,
        },
        message: request.driverResponse.message,
      })
      
      // Vérifier si la room existe
      const roomSockets = io.sockets.adapter.rooms.get(targetRoom)
      console.log("📤 Sockets dans la room:", roomSockets ? roomSockets.size : 0)
      
      io.to(targetRoom).emit("request_accepted", {
        requestId: request._id,
        driver: {
          name: `${req.user.firstName} ${req.user.lastName}`,
          avatar: req.user.avatar,
        },
        message: request.driverResponse.message,
      })
      
      console.log("✅ Événement request_accepted émis avec succès")

    // Create notification for shipper
    try {
      const senderId = request.sender?._id || request.sender
      const tripIdForNotif = request.trip?._id || request.trip || tripId
      if (!senderId) {
        console.error("❌ Cannot create notification: senderId is missing", {
          requestSender: request.sender,
          requestId: request._id,
        })
      } else {
        const { title, message: notifMessage } = getNotificationMessages("request_accepted", {
          driverName: `${req.user.firstName} ${req.user.lastName}`,
          requestDescription: request.cargo?.description,
        })
        console.log("🔔 Creating notification for shipper:", {
          recipientId: senderId,
          senderId: req.user._id,
          type: "request_accepted",
          title,
          message: notifMessage,
        })
        const notification = await createNotification({
          recipientId: senderId,
          senderId: req.user._id,
          type: "request_accepted",
          title,
          message: notifMessage,
          relatedRequestId: request._id,
          relatedTripId: tripIdForNotif,
        })
        const io = req.app.get("io")
        if (io && notification) {
          io.to(`user_${notification.recipient}`).emit("new_notification", notification)
        }
        console.log("✅ Notification created successfully:", notification._id)
      }
    } catch (notifError) {
      console.error("❌ Error creating notification:", notifError)
      console.error("❌ Error stack:", notifError.stack)
    }
  
      res.json({
        message: "Demande acceptée avec succès",
        request,
      })
    } catch (error) {
      console.error("Erreur acceptation demande:", error)
      res.status(500).json({ message: "Erreur lors de l'acceptation de la demande" })
    }
  }

  export const rejectRequest = async (req, res) => {
    try {
      const { message } = req.body
  
      const request = await Request.findById(req.params.id).populate("sender").populate("trip")
  
      if (!request) {
        return res.status(404).json({ message: "Demande non trouvée" })
      }
  
      if (request.trip.driver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Non autorisé à refuser cette demande" })
      }
  
      if (request.status !== "pending") {
        return res.status(400).json({ message: "Cette demande ne peut plus être refusée" })
      }
  
      request.status = "rejected"
      request.driverResponse = {
        message: message || "Demande refusée",
        respondedAt: new Date(),
      }
      await request.save()
  
      
      try {
        await sendNotificationEmailToUser(
          request.sender._id,
          "Demande refusée",
          `Votre demande de transport a été refusée par ${req.user.firstName} ${req.user.lastName}.`,
        )
      } catch (emailError) {
        console.error("Erreur envoi email:", emailError)
      }
  
      const io = req.app.get("io")
      console.log("🔔 Émission de l'événement request_rejected vers:", `user_${request.sender._id}`)
      console.log("📤 Données envoyées:", {
        requestId: request._id,
        driver: {
          name: `${req.user.firstName} ${req.user.lastName}`,
        },
        message: request.driverResponse.message,
      })
      
      // Create notification for shipper
      try {
        const senderId = request.sender?._id || request.sender
        if (!senderId) {
          console.error("❌ Cannot create notification: senderId is missing")
        } else {
          const { title, message } = getNotificationMessages("request_rejected", {
            driverName: `${req.user.firstName} ${req.user.lastName}`,
            requestDescription: request.cargo?.description,
          })
          
          console.log("🔔 Creating rejection notification:", {
            recipientId: senderId,
            senderId: req.user._id,
            type: "request_rejected",
          })
          
          const notif = await createNotification({
            recipientId: senderId,
            senderId: req.user._id,
            type: "request_rejected",
            title,
            message,
            relatedRequestId: request._id,
            relatedTripId: request.trip._id,
          })
          const io = req.app.get("io")
          if (io && notif) {
            io.to(`user_${notif.recipient}`).emit("new_notification", notif)
          }
          console.log("✅ Rejection notification created successfully")
        }
      } catch (notifError) {
        console.error("❌ Error creating rejection notification:", notifError)
        console.error("❌ Error stack:", notifError.stack)
      }

      io.to(`user_${request.sender._id}`).emit("request_rejected", {
        requestId: request._id,
        driver: {
          name: `${req.user.firstName} ${req.user.lastName}`,
        },
        message: request.driverResponse.message,
      })
  
      res.json({
        message: "Demande refusée",
        request,
      })
    } catch (error) {
      console.error("Erreur refus demande:", error)
      res.status(500).json({ message: "Erreur lors du refus de la demande" })
    }
  }

  export const cancelRequest = async (req, res) => {
    try {
      const request = await Request.findById(req.params.id).populate("trip")
  
      if (!request) {
        return res.status(404).json({ message: "Demande non trouvée" })
      }
  
      if (request.sender.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Non autorisé à annuler cette demande" })
      }
  
      if (!["pending", "accepted"].includes(request.status)) {
        return res.status(400).json({ message: "Cette demande ne peut plus être annulée" })
      }
  
      const oldStatus = request.status
      request.status = "cancelled"
      await request.save()

      // Populate trip to get driver info
      await request.populate({
        path: "trip",
        populate: {
          path: "driver",
          select: "_id firstName lastName",
        },
      })

      // Create notification for driver
      try {
        const driverId = request.trip?.driver?._id || request.trip?.driver
        if (!driverId) {
          console.error("❌ Cannot create notification: driverId is missing")
        } else {
          const { title, message } = getNotificationMessages("request_cancelled", {
            shipperName: `${req.user.firstName} ${req.user.lastName}`,
          })
          
          console.log("🔔 Creating cancellation notification:", {
            recipientId: driverId,
            senderId: req.user._id,
            type: "request_cancelled",
          })
          
          await createNotification({
            recipientId: driverId,
            senderId: req.user._id,
            type: "request_cancelled",
            title,
            message,
            relatedRequestId: request._id,
            relatedTripId: request.trip._id,
          })
          
          console.log("✅ Cancellation notification created successfully")
        }
      } catch (notifError) {
        console.error("❌ Error creating cancellation notification:", notifError)
        console.error("❌ Error stack:", notifError.stack)
      }
  
   
      if (oldStatus === "accepted") {
        await Trip.findByIdAndUpdate(request.trip._id, {
          $pull: { acceptedRequests: request._id },
          $inc: { "availableCapacity.weight": request.cargo.weight },
        })
      }
  
      res.json({
        message: "Demande annulée avec succès",
        request,
      })
    } catch (error) {
      console.error("Erreur annulation demande:", error)
      res.status(500).json({ message: "Erreur lors de l'annulation de la demande" })
    }
  }
  export const confirmPickup = async (req, res) => {
    try {
      const request = await Request.findById(req.params.id).populate("trip").populate("sender")
  
      if (!request) {
        return res.status(404).json({ message: "Demande non trouvée" })
      }
  
      if (request.trip.driver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Non autorisé" })
      }
  
      if (request.status !== "accepted") {
        return res.status(400).json({ message: "La demande doit être acceptée pour confirmer la collecte" })
      }
  
      request.status = "in_transit"
      request.tracking.pickupConfirmed = {
        confirmed: true,
        confirmedAt: new Date(),
        confirmedBy: req.user._id,
      }
      request.tracking.inTransit = {
        confirmed: true,
        confirmedAt: new Date(),
      }
      await request.save()

      // Create notifications for shipper
      try {
        const senderId = request.sender?._id || request.sender
        if (!senderId) {
          console.error("❌ Cannot create notification: senderId is missing")
        } else {
          const { title: pickupTitle, message: pickupMessage } = getNotificationMessages("pickup_confirmed", {
            driverName: `${req.user.firstName} ${req.user.lastName}`,
          })
          
          console.log("🔔 Creating pickup notification:", {
            recipientId: senderId,
            senderId: req.user._id,
            type: "pickup_confirmed",
          })
          
          await createNotification({
            recipientId: senderId,
            senderId: req.user._id,
            type: "pickup_confirmed",
            title: pickupTitle,
            message: pickupMessage,
            relatedRequestId: request._id,
            relatedTripId: request.trip._id,
          })

          const { title: transitTitle, message: transitMessage } = getNotificationMessages("in_transit", {
            driverName: `${req.user.firstName} ${req.user.lastName}`,
          })
          
          console.log("🔔 Creating in-transit notification:", {
            recipientId: senderId,
            senderId: req.user._id,
            type: "in_transit",
          })
          
          await createNotification({
            recipientId: senderId,
            senderId: req.user._id,
            type: "in_transit",
            title: transitTitle,
            message: transitMessage,
            relatedRequestId: request._id,
            relatedTripId: request.trip._id,
          })
          
          console.log("✅ Pickup and in-transit notifications created successfully")
        }
      } catch (notifError) {
        console.error("❌ Error creating pickup/in-transit notifications:", notifError)
        console.error("❌ Error stack:", notifError.stack)
      }
  
      res.json({
        message: "Collecte confirmée avec succès",
        request,
      })
    } catch (error) {
      console.error("Erreur confirmation collecte:", error)
      res.status(500).json({ message: "Erreur lors de la confirmation de collecte" })
    }
  }
  
  
  export const confirmDelivery = async (req, res) => {
    try {
      const { signature, podNotes } = req.body || {}
      const request = await Request.findById(req.params.id).populate("trip").populate("sender")
  
      if (!request) {
        return res.status(404).json({ message: "Demande non trouvée" })
      }
  
      const isDriver = request.trip.driver.toString() === req.user._id.toString()
      const isSender = request.sender._id.toString() === req.user._id.toString()
  
      if (!isDriver && !isSender) {
        return res.status(403).json({ message: "Non autorisé" })
      }
  
      if (request.status !== "in_transit") {
        return res.status(400).json({ message: "Le colis doit être en transit pour confirmer la livraison" })
      }
  
      const podPhotoUrl = req.file
        ? `/uploads/pod/${req.file.filename}`
        : null
      request.status = "delivered"
      request.tracking.delivered = {
        confirmed: true,
        confirmedAt: new Date(),
        confirmedBy: req.user._id,
        signature: signature || null,
        podPhotoUrl: podPhotoUrl || request.tracking?.delivered?.podPhotoUrl || null,
        podNotes: podNotes != null && String(podNotes).trim() !== "" ? String(podNotes).trim().slice(0, 500) : null,
      }
      await request.save()

      // Close conversation when request is delivered
      await Chat.findOneAndUpdate({ request: request._id }, { isActive: false })

      // Create notification for shipper (if driver confirmed) or driver (if shipper confirmed)
      try {
        if (isDriver) {
          const senderId = request.sender?._id || request.sender
          if (!senderId) {
            console.error("❌ Cannot create notification: senderId is missing")
          } else {
            const { title, message } = getNotificationMessages("delivered", {
              driverName: `${req.user.firstName} ${req.user.lastName}`,
            })
            
            console.log("🔔 Creating delivery notification:", {
              recipientId: senderId,
              senderId: req.user._id,
              type: "delivered",
            })
            
            const notification = await createNotification({
              recipientId: senderId,
              senderId: req.user._id,
              type: "delivered",
              title,
              message,
              relatedRequestId: request._id,
              relatedTripId: request.trip._id,
            })
            const io = req.app.get("io")
            if (io && notification) {
              io.to(`user_${notification.recipient}`).emit("new_notification", notification)
            }
            if (request.sender?._id) {
              try {
                await sendNotificationEmailToUser(
                  request.sender._id,
                  "Livraison confirmée",
                  `${req.user.firstName} ${req.user.lastName} a confirmé la livraison de votre colis.`,
                )
              } catch (e) {
                console.error("Erreur envoi email livraison:", e)
              }
            }
            console.log("✅ Delivery notification created successfully")
          }
        }
      } catch (notifError) {
        console.error("❌ Error creating delivery notification:", notifError)
        console.error("❌ Error stack:", notifError.stack)
      }
  
      
      if (isDriver) {
        await Trip.findByIdAndUpdate(request.trip._id, {
          $inc: { totalEarnings: request.price },
        })
      }
  
      res.json({
        message: "Livraison confirmée avec succès",
        request,
      })
    } catch (error) {
      console.error("Erreur confirmation livraison:", error)
      res.status(500).json({ message: "Erreur lors de la confirmation de livraison" })
    }
  }

  // Submit rating for a delivered request
  export const submitRating = async (req, res) => {
    try {
      const { rating, comment } = req.body
      const { id } = req.params

      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "La note doit être entre 1 et 5" })
      }

      // Find the request with populated trip and sender
      const request = await Request.findById(id)
        .populate("trip", "driver")
        .populate("sender", "_id")

      if (!request) {
        return res.status(404).json({ message: "Demande non trouvée" })
      }

      // Check if request is delivered
      if (request.status !== "delivered") {
        return res.status(400).json({ message: "Vous ne pouvez noter que les demandes livrées" })
      }

      const userId = req.user._id.toString()
      const driverId = request.trip.driver.toString()
      const senderId = request.sender._id.toString()

      // Determine if user is driver or sender
      const isDriver = userId === driverId
      const isSender = userId === senderId

      if (!isDriver && !isSender) {
        return res.status(403).json({ message: "Non autorisé à noter cette demande" })
      }

      // Determine which rating to update and who is being rated
      let ratingField, ratedUserId
      if (isDriver) {
        // Driver is rating the sender
        if (request.ratings.driverRating.rating) {
          return res.status(400).json({ message: "Vous avez déjà noté cet utilisateur pour cette demande" })
        }
        ratingField = "ratings.driverRating"
        ratedUserId = senderId
      } else {
        // Sender is rating the driver
        if (request.ratings.senderRating.rating) {
          return res.status(400).json({ message: "Vous avez déjà noté ce conducteur pour cette demande" })
        }
        ratingField = "ratings.senderRating"
        ratedUserId = driverId
      }

      // Update the request with the rating
      const updateData = {
        [`${ratingField}.rating`]: rating,
        [`${ratingField}.ratedAt`]: new Date(),
        [`${ratingField}.ratedBy`]: req.user._id,
      }

      if (comment) {
        updateData[`${ratingField}.comment`] = comment
      }

      await Request.findByIdAndUpdate(id, { $set: updateData })

      // Update the rated user's stats
      const ratedUser = await User.findById(ratedUserId)
      if (ratedUser) {
        const currentTotalRatings = ratedUser.stats.totalRatings || 0
        const currentAverageRating = ratedUser.stats.averageRating || 0

        // Calculate new average rating
        const newTotalRatings = currentTotalRatings + 1
        const newAverageRating = 
          (currentAverageRating * currentTotalRatings + rating) / newTotalRatings

        await User.findByIdAndUpdate(ratedUserId, {
          $set: {
            "stats.totalRatings": newTotalRatings,
            "stats.averageRating": Math.round(newAverageRating * 10) / 10, // Round to 1 decimal
          },
        })
      }

      // Create notification for the rated user
      try {
        const raterName = `${req.user.firstName} ${req.user.lastName}`
        const { title, message } = getNotificationMessages("rating_received", {
          raterName,
          rating,
        })
        
        console.log("🔔 Creating rating notification:", {
          recipientId: ratedUserId,
          senderId: req.user._id,
          type: "rating_received",
        })
        
        await createNotification({
          recipientId: ratedUserId,
          senderId: req.user._id,
          type: "rating_received",
          title,
          message,
          relatedRequestId: id,
        })
        
        console.log("✅ Rating notification created successfully")
      } catch (notifError) {
        console.error("❌ Error creating rating notification:", notifError)
        console.error("❌ Error stack:", notifError.stack)
      }

      // Fetch updated request
      const updatedRequest = await Request.findById(id)
        .populate("trip", "driver")
        .populate("sender", "firstName lastName avatar")

      res.json({
        message: "Note enregistrée avec succès",
        request: updatedRequest,
      })
    } catch (error) {
      console.error("Erreur soumission note:", error)
      res.status(500).json({ message: "Erreur lors de l'enregistrement de la note" })
    }
  }
  


