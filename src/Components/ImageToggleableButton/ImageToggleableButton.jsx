import { useState } from "react";
import "./ImageToggleableButton.css";
import { useNavigate } from "react-router-dom";
// Every change applied to the button when you toggle it is also applied on hover

const ImageToggleableButton = ({
  imgSrcWhenInactive,
  imgSrcWhenActive,
  setToggle,
  toggle,
  widthInPx,
  text,
  textActiveColor,
  hoverColor,
  navigateLocation,
}) => {
  const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate()

    const filtersByColor = {
        twitterBlue: 'sepia(1) saturate(4) hue-rotate(180deg) brightness(140%)',
        heartPink: 'sepia(1) saturate(7) hue-rotate(305deg) brightness(140%)'
    }

    const handleClick = (e) => {
        e.stopPropagation();
        if (setToggle) {
          setToggle(!toggle);
        }
        navigate(navigateLocation)
      };


  return (
    <button
      onClick={handleClick}
      className="image-toggleable-button"
      style={{ "--text-active-color": textActiveColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="image-toggleable-button-container">
        <img
          src={toggle ? imgSrcWhenActive : imgSrcWhenInactive}
          alt="Toggle Button"
          style={{
            width: `${widthInPx}px`,
            filter: isHovered && !toggle ? filtersByColor[hoverColor] : 'none', 
            transition: !toggle ? "filter 0.3s ease" : "none" 
        }}
        />
      </div>
      <p
        className="toggleable-button-text"
        style={{
          color: toggle || isHovered
            ? textActiveColor :
            "rgb(120,120,120)" }}
      >
        {text}
      </p>
    </button>
  );
};

export default ImageToggleableButton;
