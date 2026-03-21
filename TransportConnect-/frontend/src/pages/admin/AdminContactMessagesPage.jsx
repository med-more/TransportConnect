import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import clsx from "clsx"
import toast from "react-hot-toast"
import { Mail, Search, Clock, CheckCircle, Send, User, ArrowRight, MessageSquare, Trash2, ChevronLeft, ChevronRight } from "../../utils/icons"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import ConfirmationDialog from "../../components/ui/ConfirmationDialog"
import { adminAPI } from "../../services/api"

const statusOptions = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
]

const labelByStatus = {
  new: "New",
  in_progress: "In Progress",
  replied: "Replied",
  closed: "Closed",
}

const badgeByStatus = {
  new: "bg-warning/10 text-warning",
  in_progress: "bg-info/10 text-info",
  replied: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
}

export default function AdminContactMessagesPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [selectedId, setSelectedId] = useState(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [submittingReply, setSubmittingReply] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [deletingTicket, setDeletingTicket] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const {
    data: listData,
    isLoading,
    refetch: refetchList,
  } = useQuery({
    queryKey: ["admin-contact-messages", search, status, currentPage, pageSize],
    queryFn: () => adminAPI.getContactMessages({ search, status, page: currentPage, limit: pageSize }),
  })

  const messages = listData?.messages || []
  const pagination = listData?.pagination || { page: 1, totalPages: 1, total: 0, limit: pageSize }

  const {
    data: selectedMessage,
    isLoading: selectedLoading,
    refetch: refetchSelected,
  } = useQuery({
    queryKey: ["admin-contact-message", selectedId],
    queryFn: () => adminAPI.getContactMessageById(selectedId),
    enabled: !!selectedId,
  })

  const stats = useMemo(() => {
    const base = { total: pagination.total || 0, new: 0, in_progress: 0, replied: 0, closed: 0 }
    for (const m of messages) {
      if (base[m.status] != null) base[m.status] += 1
    }
    return base
  }, [messages, pagination.total])

  useEffect(() => {
    setCurrentPage(1)
    setSelectedId(null)
  }, [search, status, pageSize])

  const handleSelect = (id) => {
    setSelectedId(id)
    setReplyMessage("")
  }

  const handleStatusUpdate = async (nextStatus) => {
    if (!selectedMessage?._id) return
    setUpdatingStatus(true)
    try {
      await adminAPI.updateContactMessageStatus(selectedMessage._id, nextStatus)
      toast.success("Status updated")
      await Promise.all([refetchList(), refetchSelected()])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleReply = async () => {
    if (!selectedMessage?._id || !replyMessage.trim()) return
    setSubmittingReply(true)
    try {
      await adminAPI.replyToContactMessage(selectedMessage._id, replyMessage.trim())
      toast.success("Reply sent successfully")
      setReplyMessage("")
      await Promise.all([refetchList(), refetchSelected()])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send reply")
    } finally {
      setSubmittingReply(false)
    }
  }

  const handleDeleteTicket = async () => {
    if (!selectedMessage?._id) return
    setDeleteDialogOpen(true)
  }

  const handleConfirmDeleteTicket = async () => {
    if (!selectedMessage?._id) return
    setDeletingTicket(true)
    try {
      await adminAPI.deleteContactMessage(selectedMessage._id)
      toast.success("Ticket deleted")
      setSelectedId(null)
      setReplyMessage("")
      setDeleteDialogOpen(false)
      await refetchList()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete ticket")
    } finally {
      setDeletingTicket(false)
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">Contact Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage incoming support messages and reply professionally.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-xl px-3 py-2">
          <Clock className="w-4 h-4" />
          Live support workspace
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { key: "total", label: "Total", icon: MessageSquare },
          { key: "new", label: "New", icon: Mail },
          { key: "in_progress", label: "In Progress", icon: Clock },
          { key: "replied", label: "Replied", icon: Send },
          { key: "closed", label: "Closed", icon: CheckCircle },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.key} className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-black text-foreground mt-1">{stats[item.key]}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
        <Card className={clsx("xl:col-span-5 p-4 sm:p-5", selectedId && "hidden xl:block")}>
          <div className="flex flex-col gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, subject..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[10, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>{n}/page</option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-auto pr-1">
            {isLoading ? (
              <div className="text-sm text-muted-foreground p-4">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 border border-dashed border-border rounded-xl">No messages found.</div>
            ) : (
              messages.map((m) => (
                <button
                  key={m._id}
                  type="button"
                  onClick={() => handleSelect(m._id)}
                  className={clsx(
                    "w-full text-left rounded-xl border p-3 transition-all",
                    selectedId === m._id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                    </div>
                    <span className={clsx("px-2 py-1 rounded-md text-[10px] font-semibold uppercase", badgeByStatus[m.status] || badgeByStatus.new)}>
                      {labelByStatus[m.status] || "New"}
                    </span>
                  </div>
                  <p className="text-xs text-foreground mt-2 font-medium truncate">{m.subject || "No subject"}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.message}</p>
                  <div className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
                    <span>{m.ticketId}</span>
                    <span>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">
              Page {pagination.page} / {pagination.totalPages} - {pagination.total} tickets
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="min-h-[34px] px-3"
                disabled={pagination.page <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="min-h-[34px] px-3"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className={clsx("xl:col-span-7 p-4 sm:p-5", !selectedId && "hidden xl:block")}>
          {!selectedId ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center text-muted-foreground">
              <Mail className="w-10 h-10 mb-3 opacity-70" />
              <p className="text-sm">Select a message to view and reply.</p>
            </div>
          ) : selectedLoading || !selectedMessage ? (
            <div className="text-sm text-muted-foreground p-4">Loading message details...</div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="xl:hidden inline-flex items-center gap-1 text-xs font-semibold text-primary mb-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to tickets
                  </button>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{selectedMessage.ticketId}</p>
                  <h2 className="text-xl font-black text-foreground mt-1">{selectedMessage.subject || "No subject"}</h2>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedMessage.name}</span>
                    <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedMessage.email}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updatingStatus}
                    className="w-full sm:w-auto rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statusOptions.filter((s) => s.value !== "all").map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    className="min-h-[38px] px-3 border-destructive/40 text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                    onClick={handleDeleteTicket}
                    disabled={deletingTicket}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground mb-2">Customer message</p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {selectedMessage?.adminReply?.message ? (
                <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                  <p className="text-xs text-success mb-2">Latest reply sent</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedMessage.adminReply.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Sent on {selectedMessage.adminReply.sentAt ? new Date(selectedMessage.adminReply.sentAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              ) : null}

              <div className="space-y-3">
                <Input
                  label="Reply subject context"
                  value={`Re: ${selectedMessage.subject || "Your request"}`}
                  disabled
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Reply message</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write a professional and helpful reply..."
                    className="w-full min-h-[180px] px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleReply}
                    disabled={!replyMessage.trim() || submittingReply}
                    loading={submittingReply}
                    className="min-h-[46px] px-6 w-full sm:w-auto"
                  >
                    Send reply <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => !deletingTicket && setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDeleteTicket}
        title="Delete ticket?"
        message="This action is permanent and cannot be undone."
        confirmText="Delete ticket"
        cancelText="Cancel"
        variant="danger"
        loading={deletingTicket}
      />
    </div>
  )
}
