import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, Package, Phone } from "../../utils/icons"
import { chatAPI, usersAPI } from "../../services/api"

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "😊"]
import { useAuth } from "../../contexts/AuthContext"
import { useSocket } from "../../contexts/SocketContext"
import { normalizeAvatarUrl } from "../../utils/avatar"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import toast from "react-hot-toast"

function formatMessageTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatLastSeen(lastSeenAt) {
  if (!lastSeenAt) return null
  const d = new Date(lastSeenAt)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return "Last seen just now"
  if (diffMins < 60) return `Last seen ${diffMins}m ago`
  if (diffHours < 24) return `Last seen ${diffHours}h ago`
  if (diffDays === 1) return "Last seen yesterday"
  if (diffDays < 7) return `Last seen ${diffDays} days ago`
  return `Last seen ${d.toLocaleDateString([], { day: "numeric", month: "short" })}`
}

function getDateLabel(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const msgDate = new Date(d)
  msgDate.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((today - msgDate) / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "long" })
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined })
}

function groupMessagesByDate(messages) {
  const groups = []
  let currentDate = null
  let currentGroup = []
  for (const msg of messages) {
    const dateStr = msg.createdAt
    const label = dateStr ? getDateLabel(dateStr) : null
    if (label && label !== currentDate) {
      if (currentGroup.length) groups.push({ type: "messages", messages: currentGroup })
      groups.push({ type: "date", label })
      currentGroup = []
      currentDate = label
    }
    currentGroup.push(msg)
  }
  if (currentGroup.length) groups.push({ type: "messages", messages: currentGroup })
  return groups
}

export default function ConversationThreadPage() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { joinConversation, leaveConversation, onNewMessage, onMessageReaction } = useSocket()
  const userId = user?._id ?? user?.id
  const [input, setInput] = useState("")
  const [reactionPickerFor, setReactionPickerFor] = useState(null)
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const pickerRef = useRef(null)

  const { data, isLoading } = useQuery({
    queryKey: ["chat-by-request", requestId],
    queryFn: () => chatAPI.getConversationByRequest(requestId).then((r) => r.data),
    enabled: !!requestId && !!userId,
  })

  const conversation = data?.conversation
  const conversationId = conversation?._id
  const messages = conversation?.messages ?? []
  const otherParticipant = conversation?.otherParticipant
  const isActive = conversation?.isActive !== false
  const requestDetails = conversation?.requestDetails

  useEffect(() => {
    if (!conversationId) return
    joinConversation(conversationId)
    return () => leaveConversation(conversationId)
  }, [conversationId, joinConversation, leaveConversation])

  useEffect(() => {
    if (!conversationId) return
    chatAPI.markAsRead(conversationId).catch(() => {})
    queryClient.invalidateQueries({ queryKey: ["chats-conversations", userId] })
    queryClient.invalidateQueries({ queryKey: ["chats-unread"] })
  }, [conversationId, queryClient, userId])

  useEffect(() => {
    if (userId && conversationId) usersAPI.updateLastSeen().catch(() => {})
  }, [conversationId, userId])

  useEffect(() => {
    const unsub = onNewMessage((payload) => {
      if (!payload || !conversationId) return
      const senderId = payload.sender?._id?.toString?.() ?? payload.sender?.toString?.()
      const isFromMe = senderId === userId?.toString()
      queryClient.setQueryData(
        ["chat-by-request", requestId],
        (prev) => {
          if (!prev?.conversation) return prev
          const existing = prev.conversation.messages || []
          const hasId = (m) => (m._id ?? m.id)?.toString() === (payload._id ?? payload.id)?.toString()
          if (existing.some(hasId)) return prev // dedupe: already added (e.g. from send mutation)
          return {
            ...prev,
            conversation: {
              ...prev.conversation,
              messages: [...existing, payload],
            },
          }
        }
      )
      if (!isFromMe) {
        queryClient.invalidateQueries({ queryKey: ["chats-conversations", userId] })
        queryClient.invalidateQueries({ queryKey: ["chats-unread"] })
      }
    })
    return unsub
  }, [onNewMessage, conversationId, requestId, queryClient, userId])

  const sendMessageMutation = useMutation({
    mutationFn: ({ content }) => chatAPI.sendMessage(conversationId, content),
    onSuccess: (res) => {
      const msg = res.data?.message
      if (msg) {
        queryClient.setQueryData(
          ["chat-by-request", requestId],
          (prev) => {
            if (!prev?.conversation) return prev
            const existing = prev.conversation.messages || []
            const hasId = (m) => (m._id ?? m.id)?.toString() === (msg._id ?? msg.id)?.toString()
            if (existing.some(hasId)) return prev
            return {
              ...prev,
              conversation: {
                ...prev.conversation,
                messages: [...existing, msg],
              },
            }
          }
        )
        queryClient.invalidateQueries({ queryKey: ["chats-conversations", userId] })
      }
      setInput("")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send message")
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages?.length])

  useEffect(() => {
    const unsub = onMessageReaction((payload) => {
      if (!payload?.messageId || !requestId) return
      queryClient.setQueryData(
        ["chat-by-request", requestId],
        (prev) => {
          if (!prev?.conversation?.messages) return prev
          const next = {
            ...prev,
            conversation: {
              ...prev.conversation,
              messages: prev.conversation.messages.map((m) =>
                (m._id ?? m.id)?.toString() === payload.messageId?.toString()
                  ? { ...m, reactions: payload.message?.reactions ?? m.reactions }
                  : m
              ),
            },
          }
          return next
        }
      )
    })
    return unsub
  }, [onMessageReaction, requestId, queryClient])

  useEffect(() => {
    if (!reactionPickerFor) return
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setReactionPickerFor(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [reactionPickerFor])

  const reactMutation = useMutation({
    mutationFn: ({ messageId, emoji }) =>
      chatAPI.reactToMessage(conversationId, messageId, emoji),
    onSuccess: (res, { messageId }) => {
      const reactions = res.data?.reactions
      if (!reactions) return
      queryClient.setQueryData(
        ["chat-by-request", requestId],
        (prev) => {
          if (!prev?.conversation?.messages) return prev
          const msgId = messageId?.toString()
          const messages = prev.conversation.messages.map((m) =>
            (m._id ?? m.id)?.toString() === msgId ? { ...m, reactions } : m
          )
          return { ...prev, conversation: { ...prev.conversation, messages } }
        }
      )
      setReactionPickerFor(null)
    },
  })

  const handleReaction = (messageId, emoji) => {
    if (!conversationId || !messageId) return
    reactMutation.mutate({ messageId, emoji })
  }

  const handleSend = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || !conversationId || !isActive) return
    sendMessageMutation.mutate({ content: text })
  }

  const otherPhone =
    requestDetails?.pickup?.contactPerson?.phone ||
    requestDetails?.delivery?.contactPerson?.phone ||
    otherParticipant?.phone

  if (isLoading || !conversation) {
    return (
      <div className="h-full min-h-0 flex flex-col">
        <div className="flex-1 flex justify-center items-center min-h-[200px]">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  const otherUserId = otherParticipant?._id?.toString?.() ?? otherParticipant?.id?.toString?.()
  const lastMessageFromOther = otherUserId
    ? [...(messages || [])]
        .filter(
          (m) =>
            (m.sender?._id?.toString?.() ?? m.sender?.toString?.()) === otherUserId
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    : null
  const lastSeenOrActive = otherParticipant?.lastSeenAt
    ? formatLastSeen(otherParticipant.lastSeenAt)
    : lastMessageFromOther?.createdAt
      ? formatLastSeen(lastMessageFromOther.createdAt).replace("Last seen", "Last active")
      : null

  return (
    <div className="h-full min-h-0 flex flex-col w-full chat-wallpaper overflow-hidden">
      {/* Header - full width, touch-friendly, safe area */}
      <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 bg-[#f0f2f5] dark:bg-black border-b border-border shadow-sm shrink-0 safe-top">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="touch-target min-w-[44px] min-h-[44px] flex items-center justify-center -ml-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
        </button>
        <Link
          to={`/requests/${requestId}`}
          className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0 rounded-xl py-1 active:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset"
        >
          {otherParticipant?.avatar ? (
            <img
              src={normalizeAvatarUrl(otherParticipant.avatar)}
              alt=""
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover flex-shrink-0 ring-2 ring-white dark:ring-black shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ring-2 ring-white dark:ring-black">
              <span className="text-primary font-semibold text-sm sm:text-lg">
                {(otherParticipant?.firstName?.[0] || "?") +
                  (otherParticipant?.lastName?.[0] || "")}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1 text-left">
            <p className="font-semibold text-foreground truncate text-sm sm:text-[15px]">
              {otherParticipant?.firstName} {otherParticipant?.lastName}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {requestDetails?.trip?.departure?.city} → {requestDetails?.trip?.destination?.city}
            </p>
            {lastSeenOrActive && (
              <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
                {lastSeenOrActive}
              </p>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {otherPhone && (
            <a
              href={`tel:${otherPhone}`}
              className="touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              title="Call"
              aria-label="Call"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => navigate(`/requests/${requestId}`)}
            className="touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            title="Request details"
            aria-label="Request details"
          >
            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Closed banner */}
      {!isActive && (
        <div className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-amber-500/10 border-b border-amber-500/20 text-center text-xs sm:text-sm text-amber-800 dark:text-amber-200 shrink-0">
          Conversation closed (request delivered). History is read-only.
        </div>
      )}

      {/* Messages - full width, smooth scroll */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/60 dark:bg-black/20 flex items-center justify-center mb-3 sm:mb-4">
              <Package className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium text-xs sm:text-sm">No messages yet</p>
            <p className="text-muted-foreground text-[10px] sm:text-xs mt-1 max-w-[220px] px-2">
              Send a message to coordinate pickup or delivery.
            </p>
          </div>
        ) : (
          <>
            {messageGroups.map((group, gIdx) =>
              group.type === "date" ? (
                <div key={`date-${gIdx}`} className="flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 text-xs font-medium text-foreground/80">
                    {group.label}
                  </span>
                </div>
              ) : (
                <div key={`msg-${gIdx}`} className="space-y-0.5">
                  {(group.messages || []).map((msg, i) => {
                    const isMe =
                      msg.sender?._id?.toString?.() === userId?.toString() ||
                      msg.sender?.toString?.() === userId?.toString() ||
                      msg.sender === userId
                    const showTime = i === (group.messages?.length ?? 0) - 1
                    const msgId = (msg._id ?? msg.id)?.toString()
                    const reactions = msg.reactions || []
                    const showPicker = reactionPickerFor === msgId
                    const isReacting = reactMutation.isPending && reactionPickerFor === msgId
                    return (
                      <motion.div
                        key={msg._id || `${gIdx}-${i}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className="relative max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
                          {/* Floating reaction bar (above bubble, like Telegram) */}
                          {showPicker && (
                            <div
                              ref={pickerRef}
                              className="absolute left-0 bottom-full mb-0.5 flex gap-0.5 py-1 px-1.5 rounded-full bg-[#233138] dark:bg-card dark:border border-border shadow-xl z-20"
                            >
                              {REACTION_EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => handleReaction(msgId, emoji)}
                                  disabled={isReacting}
                                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 text-base transition-transform"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                          <div
                            data-message-bubble
                            className={`
                              rounded-2xl px-3.5 sm:px-4 py-2 shadow-md group relative
                              ${isMe
                                ? "rounded-br-md bg-[#005c4b] dark:bg-[#056162] text-white"
                                : "rounded-bl-md bg-white dark:bg-card text-foreground border border-border"
                              }
                            `}
                          >
                            <p className="text-[13px] sm:text-[15px] leading-snug whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                            <div className="flex items-center justify-end gap-1.5 mt-1 min-h-[18px]">
                              {reactions.length > 0 && (
                                <div className="flex items-center gap-0.5 flex-wrap justify-end">
                                  {reactions.map((r) => {
                                    const users = r.users || []
                                    const count = users.length
                                    const hasMe = users.some(
                                      (u) => (u?.toString?.() ?? u) === userId?.toString()
                                    )
                                    return (
                                      <button
                                        key={r.emoji}
                                        type="button"
                                        onClick={() => handleReaction(msgId, r.emoji)}
                                        disabled={!isActive || isReacting}
                                        className={`
                                          inline-flex items-center rounded-full text-[11px] leading-none px-1.5 py-0.5 transition-colors
                                          ${isMe
                                            ? hasMe
                                              ? "bg-white/25"
                                              : "bg-white/15 hover:bg-white/20"
                                            : hasMe
                                              ? "bg-primary/25 dark:bg-primary/30"
                                              : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15"
                                          }
                                        `}
                                      >
                                        <span>{r.emoji}</span>
                                        {count > 1 && (
                                          <span className="ml-0.5 opacity-90 text-[10px]">
                                            {count}
                                          </span>
                                        )}
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                              {showTime && (
                                <span
                                  className={`text-[10px] sm:text-[11px] shrink-0 ${
                                    isMe ? "text-white/60" : "text-muted-foreground"
                                  }`}
                                >
                                  {formatMessageTime(msg.createdAt)}
                                </span>
                              )}
                              {isActive && (
                                <button
                                  data-reaction-add
                                  type="button"
                                  onClick={() => setReactionPickerFor(showPicker ? null : msgId)}
                                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 w-5 h-5 flex items-center justify-center rounded-full shrink-0 transition-opacity hover:bg-black/10 dark:hover:bg-white/10"
                                  aria-label="Add reaction"
                                >
                                  <span className="text-sm">😊</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input bar - full width, safe area for notched devices */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 md:px-6 bg-[#f0f2f5] dark:bg-black border-t border-border shrink-0 safe-bottom"
      >
        <div className="flex items-end gap-2 rounded-2xl bg-white dark:bg-card border border-border px-3 sm:px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isActive ? "Message" : "Conversation closed"}
            disabled={!isActive}
            maxLength={2000}
            className="flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground text-sm sm:text-[15px] py-2.5 min-h-[44px] outline-none"
            aria-label="Message"
          />
          <button
            type="submit"
            disabled={!input.trim() || !isActive || sendMessageMutation.isPending}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center text-white transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 touch-target"
            aria-label="Send"
          >
            {sendMessageMutation.isPending ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
