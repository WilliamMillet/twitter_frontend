import './Button.css'

const Button = ({ onClick, children, variant, size, className, type, disabled}) => {
    return (
        <button onClick={onClick} className={`main-button-style ${variant}-button ${size}-button ${className}`} type={type} disabled={disabled}>
            {children}
        </button>
     );
}
 
export default Button;