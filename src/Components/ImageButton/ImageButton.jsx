import { useState } from "react";
import "./ImageButton.css";

const ImageButton = ({
  imgSrc,
  widthInPx,
  text,
  textActiveColor,
  hoverColor,
  handleClick
}) => {
  const [isHovered, setIsHovered] = useState(false);


    const filtersByColor = {
        twitterBlue: 'sepia(1) saturate(4) hue-rotate(180deg) brightness(140%)',
        heartPink: 'sepia(1) saturate(7) hue-rotate(305deg) brightness(140%)'
    }

    
    const handleStopPropagationAndCustomLogic = (e) => {
        e.stopPropagation();
        if (handleClick) {
            handleClick()
        }
      };

  return (
    <button
      onClick={handleStopPropagationAndCustomLogic}
      className="image-button"
      style={{ "--text-active-color": textActiveColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="image-button-container">
        <img
          src={imgSrc}
          alt="Toggle Button"
          style={{
            width: `${widthInPx}px`,
            filter: isHovered ? filtersByColor[hoverColor] : 'none', // Add a filter when hovering, but remove it with the coloured icon comes in 
            transition: "filter 0.3s ease" 
        }}
        />
      </div>
      <p
        className="image-button-text"
        style={{ color: isHovered ? textActiveColor : "rgb(120,120,120)" }}
      >
        {text}
      </p>
    </button>
  );
};

export default ImageButton;
