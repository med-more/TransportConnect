/**
 * Normalizes avatar URLs to ensure they are full HTTP URLs
 * Handles both relative paths and full URLs
 */
export const normalizeAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null

  // If it's already a full URL (http/https), return as is
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl
  }

  // If it's a Cloudinary URL (starts with cloudinary domain), return as is
  if (avatarUrl.includes("cloudinary")) {
    return avatarUrl
  }

  // If it's a relative path, convert to full URL
  // Remove leading slash if present
  const cleanPath = avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`
  
  // Get the API base URL and extract the base (without /api)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000/api"
  let baseUrl = apiBaseUrl.replace("/api", "")
  
  // If baseUrl ends with a slash, remove it
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1)
  }
  
  // Ensure cleanPath doesn't have double slashes
  const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`
  
  const fullUrl = `${baseUrl}${finalPath}`
  
  return fullUrl
}

