import "./StandardPopup.css";
import React, { useState } from "react";

const PopupItem = ({ item }) => {
  const [itemClicked, setItemClicked] = useState(false); // This will only be used if the item has textAfterClick provided

  const handleClick = () => {
    setItemClicked(true)
    item.onClick()
  }

  return (
    <li className="standard-popup-item">
      <button onClick={handleClick}>
        {item.iconImgSrc && <img
          src={item.iconImgSrc}
          alt={`${item.text}-icon`}
          className="standard-popup-icon"
        />}
        <span className="standard-popup-text">
            {itemClicked ? item?.textAfterClick || item.text : item.text}
            </span>
      </button>
    </li>
  );
};

// popupData should be an array of objects in the following format
// [
//     {
//         iconImgSrc: mylink.com,
//         text: 'my text',
//         onClick: myfunction,
//         textAfterClick: 'my new text' (optional)
//     }
// ]

// position can be:
// top-left
// top-right
// bottom-left
// bottom-right

// iconImg is not necessary (Or at least it shouldnt be if i implemented it right)

const StandardPopup = React.forwardRef(({ popupData, position }, ref) => {
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="standard-popup-container"
      onClick={stopPropagation}
      ref={ref}
    >
      <div className={`standard-popup standard-popup-offset-${position}`}>
        <ul className="standard-popup-list">
          {popupData?.length > 0 &&
            popupData.map((item, index) => (
              <PopupItem key={index} item={item} />
            ))}
        </ul>
      </div>
    </div>
  );
});

export default StandardPopup;
