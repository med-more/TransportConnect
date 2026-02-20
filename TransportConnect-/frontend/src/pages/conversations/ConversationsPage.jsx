import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { MessageCircle, Package } from "../../utils/icons"
import { chatAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { normalizeAvatarUrl } from "../../utils/avatar"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "open", label: "Open" },
  { id: "closed", label: "Closed" },
]

function formatTime(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return "Now"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  if (diff < 172800000) return "Yesterday"
  if (diff < 604800000) return d.toLocaleDateString([], { weekday: "short" })
  return d.toLocaleDateString([], { day: "numeric", month: "short" })
}

function ConversationListSkeleton() {
  return (
    <ul className="flex-1 min-h-0 overflow-hidden divide-y divide-border">
      {[1, 2, 3, 4, 5].map((i) => (
        <li key={i} className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-4 animate-pulse">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-muted shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function ConversationsPage() {
  const { user } = useAuth()
  const userId = user?._id ?? user?.id
  const [filter, setFilter] = useState("all")

  const { data, isLoading } = useQuery({
    queryKey: ["chats-conversations", userId],
    queryFn: () => chatAPI.getConversations().then((r) => r.data),
    enabled: !!userId,
  })

  const allConversations = data?.conversations ?? []
  const conversations =
    filter === "all"
      ? allConversations
      : filter === "unread"
        ? allConversations.filter((c) => (c.unreadCount || 0) > 0)
        : filter === "open"
          ? allConversations.filter((c) => c.isActive !== false)
          : allConversations.filter((c) => c.isActive === false)

  if (isLoading) {
    return (
      <div className="h-full min-h-0 flex flex-col w-full bg-background overflow-hidden">
        <header className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-[#f0f2f5] dark:bg-black safe-top">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="h-8 w-24 rounded bg-muted animate-pulse" />
          </div>
        </header>
        <ConversationListSkeleton />
      </div>
    )
  }

  return (
    <div className="h-full min-h-0 flex flex-col w-full bg-background overflow-hidden">
      {/* Header - full width, safe area */}
      <header className="shrink-0 border-b border-border bg-[#f0f2f5] dark:bg-black safe-top">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 shrink-0" aria-hidden>
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">Chats</h1>
              <p className="text-xs text-muted-foreground">
                {conversations.length} of {allConversations.length} conversation{allConversations.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
        {/* Filters */}
        {allConversations.length > 0 && (
          <div className="px-3 sm:px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {FILTERS.map((f) => {
              const count =
                f.id === "all"
                  ? allConversations.length
                  : f.id === "unread"
                    ? allConversations.filter((c) => (c.unreadCount || 0) > 0).length
                    : f.id === "open"
                      ? allConversations.filter((c) => c.isActive !== false).length
                      : allConversations.filter((c) => c.isActive === false).length
              const isActive = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={isActive}
                  className={`
                    shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    ${isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white dark:bg-card text-muted-foreground hover:bg-muted/60 border border-border"
                    }
                  `}
                >
                  {f.label}
                  {count > 0 && (
                    <span className={isActive ? "text-white/90" : "text-muted-foreground"}>
                      {" "}({count})
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </header>

      {conversations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="flex-1 min-h-0 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 text-center safe-bottom"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center mb-4 sm:mb-5 ring-4 ring-muted/50">
            <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
          </div>
          <p className="text-foreground font-semibold text-base sm:text-lg mb-1">
            {allConversations.length === 0 ? "No conversations yet" : `No ${filter} conversations`}
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-[280px] mb-6 leading-relaxed">
            {allConversations.length === 0
              ? "When you create or accept a request, you can chat with the driver or shipper here."
              : "Try another filter or start a new request."}
          </p>
          {allConversations.length === 0 ? (
            <Link
              to="/requests"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 touch-target"
            >
              View requests
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="px-5 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium text-sm transition-colors"
            >
              Show all
            </button>
          )}
        </motion.div>
      ) : (
        <ul className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden divide-y divide-border safe-bottom">
          {conversations.map((conv, index) => {
            const other = conv.otherParticipant
            const routeLabel =
              conv.request?.trip?.departure?.city && conv.request?.trip?.destination?.city
                ? `${conv.request.trip.departure.city} → ${conv.request.trip.destination.city}`
                : "Request"
            const lastPreview =
              conv.lastMessage?.content?.slice(0, 50) +
              (conv.lastMessage?.content?.length > 50 ? "…" : "") ||
              "No messages yet"
            const isFromMe =
              conv.lastMessage?.sender?.toString?.() === userId?.toString() ||
              conv.lastMessage?.sender === userId

            return (
              <motion.li
                key={conv._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.2) }}
              >
                <Link
                  to={`/conversations/${conv.requestId}`}
                  className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 md:px-6 py-4 sm:py-3.5 min-h-[72px] sm:min-h-0 hover:bg-muted/40 active:bg-muted/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
                >
                  <div className="relative flex-shrink-0">
                    {other?.avatar ? (
                      <img
                        src={normalizeAvatarUrl(other.avatar)}
                        alt=""
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-background dark:ring-black"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-background dark:ring-black">
                        <span className="text-primary font-semibold text-base sm:text-lg">
                          {(other?.firstName?.[0] || "?") + (other?.lastName?.[0] || "")}
                        </span>
                      </div>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-foreground truncate text-sm sm:text-[15px]">
                        {other?.firstName} {other?.lastName}
                      </span>
                      {conv.lastMessage?.createdAt && (
                        <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                      <Package className="w-3 h-3 shrink-0" />
                      {routeLabel}
                    </p>
                    <p
                      className={`text-xs sm:text-sm mt-0.5 truncate ${
                        conv.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {isFromMe && "You: "}
                      {lastPreview}
                    </p>
                  </div>
                  {!conv.isActive && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground shrink-0">
                      Closed
                    </span>
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
