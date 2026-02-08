import clsx from "clsx"

const Card = ({ children, className, hover = false, padding = true, ...props }) => {
  return (
    <div
      className={clsx(
        "card",
        padding && "p-6",
        hover && "card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
