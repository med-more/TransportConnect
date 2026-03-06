import { createContext, useContext, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import { SOCKET_URL } from "../config/constants"
import { useAuth } from "./AuthContext"

export const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const userId = user?._id ?? user?.id
  const [connected, setConnected] = useState(false)
  const [socketInstance, setSocketInstance] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!userId) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setConnected(false)
        setSocketInstance(null)
      }
      return
    }

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: {},
    })
    socketRef.current = socket

    socket.on("connect", () => {
      setConnected(true)
      setSocketInstance(socket)
      socket.emit("join_user", userId)
    })
    socket.on("disconnect", () => {
      setConnected(false)
      setSocketInstance(null)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setConnected(false)
      setSocketInstance(null)
    }
  }, [userId])

  const joinConversation = (conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit("join_conversation", conversationId)
    }
  }

  const leaveConversation = (conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit("leave_conversation", conversationId)
    }
  }

  const onNewMessage = (callback) => {
    if (!socketRef.current) return () => {}
    socketRef.current.on("new_message", callback)
    return () => socketRef.current?.off("new_message", callback)
  }

  const onMessageReaction = (callback) => {
    if (!socketRef.current) return () => {}
    socketRef.current.on("message_reaction", callback)
    return () => socketRef.current?.off("message_reaction", callback)
  }

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance || socketRef.current,
        connected,
        joinConversation,
        leaveConversation,
        onNewMessage,
        onMessageReaction,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const ctx = useContext(SocketContext)
  return ctx
}
