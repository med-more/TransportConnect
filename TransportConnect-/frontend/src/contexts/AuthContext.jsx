import { createContext, useContext, useReducer, useEffect } from "react"
import { authAPI } from "../services/api"
import toast from "react-hot-toast"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        const user = JSON.parse(userData)
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        })
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } catch (error) {
      console.error("Error checking auth state:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const login = async (email, password) => {
    try {
      console.log("Login attempt for:", email)
      const response = await authAPI.login(email, password)
      console.log("Login response:", response)
      
      // Backend returns: { msg, token, user: { id, firstName, lastName, ... } }
      const userData = response.data?.user
      const token = response.data?.token

      if (!userData || !token) {
        console.error("Invalid response structure:", response.data)
        toast.error("Invalid response from server")
        return { success: false, message: "Invalid response from server" }
      }

      // Convert id to _id for consistency
      const user = {
        ...userData,
        _id: userData.id || userData._id,
      }

      console.log("Setting user and token in localStorage")
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      console.log("Dispatching LOGIN_SUCCESS")
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      })

      console.log("Login successful, user:", user)
      toast.success(`Welcome ${user.firstName}!`)
      return { success: true, user }
    } catch (error) {
      console.error("Login error:", error)
      console.error("Error response:", error.response)
      const message = error.response?.data?.msg || error.response?.data?.message || error.message || "Login failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const userDataFromResponse = response.data?.user
      const token = response.data?.token

      if (!userDataFromResponse || !token) {
        console.error("Invalid response structure:", response.data)
        toast.error("Invalid response from server")
        return { success: false, message: "Invalid response from server" }
      }

      // Convert id to _id for consistency
      const user = {
        ...userDataFromResponse,
        _id: userDataFromResponse.id || userDataFromResponse._id,
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      })

      toast.success("Registration successful! Welcome to TransportConnect")
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      const message = error.response?.data?.message || error.message || "Registration failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    dispatch({ type: "LOGOUT" })
    toast.success("Déconnexion réussie")
  }

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    dispatch({ type: "UPDATE_USER", payload: userData })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
