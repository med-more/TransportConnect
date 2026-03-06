import { useState, useMemo, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { FileText, CheckCircle, XCircle, Clock, ExternalLink, User, Search } from "../../utils/icons"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { documentsAPI } from "../../services/api"
import toast from "react-hot-toast"
import clsx from "clsx"

const DOC_TYPES = ["license", "insurance", "registration", "id_card", "other"]
const STATUS_FILTER = ["all", "pending", "approved", "rejected"]
const PAGE_SIZE = 10

const AdminDocumentsPage = () => {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["admin-documents", statusFilter],
    queryFn: () =>
      documentsAPI.list(statusFilter === "all" ? {} : { status: statusFilter }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason: reason }) =>
      documentsAPI.update(id, { status, rejectionReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-documents"] })
      toast.success("Document updated")
      setRejectModal(null)
      setRejectionReason("")
    },
    onError: (e) => toast.error(e.response?.data?.message || "Update failed"),
  })

  const handleApprove = (doc) => {
    updateMutation.mutate({ id: doc._id, status: "approved" })
  }
  const handleReject = () => {
    if (!rejectModal) return
    updateMutation.mutate({
      id: rejectModal._id,
      status: "rejected",
      rejectionReason: rejectionReason.trim() || "Rejected by admin",
    })
  }

  const handleViewFile = async (doc) => {
    try {
      const { data } = await documentsAPI.getFile(doc._id)
      const url = URL.createObjectURL(data)
      window.open(url, "_blank", "noopener,noreferrer")
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (e) {
      let msg = "Could not open file"
      if (e.response?.data instanceof Blob) {
        try {
          const text = await e.response.data.text()
          const j = JSON.parse(text)
          if (j.message) msg = j.message
        } catch (_) {}
      } else if (e.response?.data?.message) {
        msg = e.response.data.message
      }
      toast.error(msg)
    }
  }

  const filteredDocuments = useMemo(() => {
    let list = documents
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter((doc) => {
        const name = [doc.user?.firstName, doc.user?.lastName].filter(Boolean).join(" ").toLowerCase()
        const email = (doc.user?.email || "").toLowerCase()
        const type = (doc.type || "").replace("_", " ").toLowerCase()
        return name.includes(q) || email.includes(q) || type.includes(q)
      })
    }
    if (typeFilter !== "all") {
      list = list.filter((doc) => doc.type === typeFilter)
    }
    if (dateFrom) {
      const from = new Date(dateFrom)
      from.setHours(0, 0, 0, 0)
      list = list.filter((doc) => doc.createdAt && new Date(doc.createdAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      list = list.filter((doc) => doc.createdAt && new Date(doc.createdAt) <= to)
    }
    return list
  }, [documents, searchQuery, typeFilter, dateFrom, dateTo])

  const totalFiltered = filteredDocuments.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))
  const paginatedDocuments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredDocuments.slice(start, start + PAGE_SIZE)
  }, [filteredDocuments, page])

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  const docCard = (doc) => (
    <Card key={doc._id} className="p-4 sm:p-5 border border-border">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {doc.user?.firstName} {doc.user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{doc.user?.email}</p>
            </div>
          </div>
          <span
            className={clsx(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium flex-shrink-0",
              doc.status === "approved" && "bg-success/10 text-success",
              doc.status === "rejected" && "bg-destructive/10 text-destructive",
              doc.status === "pending" && "bg-warning/10 text-warning"
            )}
          >
            {doc.status === "approved" && <CheckCircle className="w-3.5 h-3.5" />}
            {doc.status === "rejected" && <XCircle className="w-3.5 h-3.5" />}
            {doc.status === "pending" && <Clock className="w-3.5 h-3.5" />}
            {doc.status}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">Type:</span>
          <span className="text-foreground capitalize">{doc.type.replace("_", " ")}</span>
          <span className="text-muted-foreground">Submitted:</span>
          <span className="text-foreground">
            {doc.createdAt
              ? new Date(doc.createdAt).toLocaleDateString(undefined, { dateStyle: "short" })
              : "—"}
          </span>
        </div>
        {doc.status === "rejected" && doc.rejectionReason && (
          <p className="text-xs text-destructive bg-destructive/5 rounded-lg p-2" title={doc.rejectionReason}>
            Reason: {doc.rejectionReason}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
          <button
            type="button"
            onClick={() => handleViewFile(doc)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View file
          </button>
          {doc.status === "pending" && (
            <>
              <Button
                size="small"
                variant="outline"
                className="text-success hover:bg-success/10 flex-1 sm:flex-initial min-w-0"
                onClick={() => handleApprove(doc)}
                disabled={updateMutation.isPending}
              >
                <CheckCircle className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Approve</span>
              </Button>
              <Button
                size="small"
                variant="outline"
                className="text-destructive hover:bg-destructive/10 flex-1 sm:flex-initial min-w-0"
                onClick={() => setRejectModal(doc)}
                disabled={updateMutation.isPending}
              >
                <XCircle className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Reject</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="w-full min-w-0 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 space-y-4 sm:space-y-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 flex-wrap">
          <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
          <span className="truncate">Document verification</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
          Review driver documents (license, insurance, registration). Approve or reject with a reason.
        </p>
      </div>

      <Card className="p-3 sm:p-4 md:p-5 overflow-hidden">
        {/* Filters: responsive layout — stacked on mobile, toolbar on desktop */}
        <div className="space-y-4 mb-4">
          {/* Row 1: Search + Status */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <div className="relative min-w-0 flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                placeholder="Search by name, email or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full pl-9 pr-3 py-2 sm:py-1.5 text-sm min-h-[44px] sm:min-h-[38px]"
                aria-label="Search documents"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-foreground shrink-0">Status</span>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTER.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={clsx(
                      "px-3 py-2 sm:py-1.5 rounded-lg text-sm font-medium capitalize transition-colors min-h-[44px] sm:min-h-[38px] touch-manipulation",
                      statusFilter === s
                        ? "bg-primary text-white"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Type + Date range — single row on md+ */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 min-w-0 sm:min-w-[180px]">
              <label className="text-sm font-medium text-foreground shrink-0 w-10 sm:w-auto">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
                className="input-field flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm min-h-[44px] sm:min-h-[38px] w-full sm:w-[140px]"
                aria-label="Filter by document type"
              >
                <option value="all">All types</option>
                {DOC_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
              <label className="text-sm font-medium text-foreground shrink-0 w-10 sm:w-auto">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
                className="input-field flex-1 min-w-0 px-3 py-2 rounded-lg text-sm min-h-[44px] sm:min-h-[38px] sm:w-[152px]"
                aria-label="Filter from date"
              />
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
              <label className="text-sm font-medium text-foreground shrink-0 w-10 sm:w-auto">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
                className="input-field flex-1 min-w-0 px-3 py-2 rounded-lg text-sm min-h-[44px] sm:min-h-[38px] sm:w-[152px]"
                aria-label="Filter to date"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground py-8 text-center text-sm sm:text-base">Loading…</p>
        ) : documents.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm sm:text-base">
            No documents {statusFilter !== "all" ? `with status "${statusFilter}"` : ""}.
          </p>
        ) : filteredDocuments.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm sm:text-base">
            {searchQuery.trim() || typeFilter !== "all" || dateFrom || dateTo
              ? "No documents match the current filters."
              : "No documents " + (statusFilter !== "all" ? `with status "${statusFilter}"` : "") + "."}
          </p>
        ) : (
          <>
            {/* Mobile/tablet: card list */}
            <div className="flex flex-col gap-3 md:hidden">
              {paginatedDocuments.map(docCard)}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto -mx-1">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-foreground">User</th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Submitted</th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDocuments.map((doc) => (
                    <tr key={doc._id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="font-medium text-foreground block truncate">
                              {doc.user?.firstName} {doc.user?.lastName}
                            </span>
                            <span className="text-muted-foreground text-xs truncate block">{doc.user?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 capitalize text-foreground">
                        {doc.type.replace("_", " ")}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                            doc.status === "approved" && "bg-success/10 text-success",
                            doc.status === "rejected" && "bg-destructive/10 text-destructive",
                            doc.status === "pending" && "bg-warning/10 text-warning"
                          )}
                        >
                          {doc.status === "approved" && <CheckCircle className="w-3 h-3" />}
                          {doc.status === "rejected" && <XCircle className="w-3 h-3" />}
                          {doc.status === "pending" && <Clock className="w-3 h-3" />}
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString(undefined, { dateStyle: "short" })
                          : "—"}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewFile(doc)}
                            className="text-primary hover:underline inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0 font-inherit"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </button>
                          {doc.status === "pending" && (
                            <>
                              <Button
                                size="small"
                                variant="outline"
                                className="text-success hover:bg-success/10"
                                onClick={() => handleApprove(doc)}
                                disabled={updateMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => setRejectModal(doc)}
                                disabled={updateMutation.isPending}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                        {doc.status === "rejected" && doc.rejectionReason && (
                          <p className="text-xs text-destructive mt-1 max-w-xs truncate" title={doc.rejectionReason}>
                            Reason: {doc.rejectionReason}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalFiltered > PAGE_SIZE && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalFiltered)} of {totalFiltered}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="min-h-[36px]"
                  >
                    Previous
                  </Button>
                  <span className="flex items-center gap-1 px-2 text-sm text-muted-foreground">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={clsx(
                          "min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors",
                          page === p ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </span>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="min-h-[36px]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 overflow-y-auto">
          <Card className="w-full sm:max-w-md sm:rounded-xl rounded-t-xl rounded-b-none sm:rounded-b-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto safe-area-pb">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Reject document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a reason (driver will see it in their profile). Optional but recommended.
            </p>
            <Input
              placeholder="Reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2 justify-end flex-wrap">
              <Button
                variant="ghost"
                className="min-h-[44px] sm:min-h-0"
                onClick={() => { setRejectModal(null); setRejectionReason("") }}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10 min-h-[44px] sm:min-h-0"
                onClick={handleReject}
                loading={updateMutation.isPending}
              >
                Reject
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminDocumentsPage
