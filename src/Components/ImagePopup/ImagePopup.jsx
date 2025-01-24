import "./ImagePopup.css";

const ImagePopup = ({ src, setImagePopupActive }) => {
  const onClose = () => {
    setImagePopupActive(false);
  };
  return (
    <div className="image-popup-dark-overlay">
      <div className="image-popup-container">
        <button
          className="frosted-glass-plain-text-button close-image-popup-button"
          onClick={onClose}
        >
          ×
        </button>
        <img src={src} alt="Image popup" />
      </div>
    </div>
  );
};

export default ImagePopup;
