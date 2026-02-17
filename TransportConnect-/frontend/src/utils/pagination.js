/**
 * Generates smart pagination page numbers with ellipsis
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @returns {Array} Array of page numbers and ellipsis markers
 */
export const generatePageNumbers = (currentPage, totalPages) => {
  const pages = []
  const maxVisible = 7 // Maximum visible page numbers

  if (totalPages <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (currentPage <= 3) {
      // Near the beginning
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push('ellipsis')
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // In the middle
      pages.push('ellipsis')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages)
    }
  }

  return pages
}

