const LoadingSpinner = ({ size = "medium", className = "" }) => {
    const sizeClasses = {
      small: "w-4 h-4",
      medium: "w-8 h-8",
      large: "w-12 h-12",
    }
  
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="w-full h-full border-3 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }
  
  export default LoadingSpinner
  