import "./FlashingGrayBarsLoadingAnimation.css";

// Vertical positions can be any justify content option

const FlashingGrayBarsLoadingAnimation = ({
  numberOfBars = 3,
  spacingPx = 10,
  verticalPosition = "center",
}) => {
  const bars = Array.from({ length: numberOfBars }, (_, index) => {
    return <div key={index} className="flashing-gray-load-animation"></div>;
  });

  return (
    <div className="flashing-gray-load-animation-container"style={{justifyContent: verticalPosition}}>
      <div
        className={`flashing-gray-load-animation-set`}
        style={{ gap: spacingPx }}
      >
        {bars}
      </div>
    </div>
  );
};

export default FlashingGrayBarsLoadingAnimation;
