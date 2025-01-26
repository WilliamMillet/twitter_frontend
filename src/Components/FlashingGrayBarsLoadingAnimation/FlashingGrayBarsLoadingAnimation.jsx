import './FlashingGrayBarsLoadingAnimation.css'

const FlashingGrayBarsLoadingAnimation = ({ numberOfBars = 3 }) => {
    
    const bars = Array.from({ length: numberOfBars}, (_, index) => {
        return <div key={index} className='flashing-gray-load-animation'></div>
    })

    return ( 
        <div className="individual-post flashing-gray-load-animation-set">
            {bars}
        </div>
     );
}
 
export default FlashingGrayBarsLoadingAnimation;