import "./Button.css";

const Button = ({
  onClick,
  children,
  variant,
  size,
  className,
  type,
  disabled,
  setHovered
}) => {
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

return (
    <button
        onClick={onClick}
        className={`main-button-style ${variant}-button ${size}-button ${className}`}
        type={type}
        disabled={disabled}
        onMouseEnter={setHovered ? handleMouseEnter : undefined}
        onMouseLeave={setHovered ? handleMouseLeave : undefined}
    >
        {children}
    </button>
);
};

export default Button;
