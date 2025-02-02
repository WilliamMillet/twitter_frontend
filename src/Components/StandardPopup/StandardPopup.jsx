import './StandardPopup.css'

const PopupItem = ({item}) => {
    return (
        <li className='standard-popup-item'>
            <button onClick={item.onClick}>
                <img src={item.iconImgSrc} alt={`${item.text}-icon`} className='standard-popup-icon'/>
                <span className='standard-popup-text'>{item.text}</span>
            </button>
        </li>
    )
}

// popupData should be an array of objects in the following format
// [
//     {iconImgSrc: mylink.com, text: 'my text', onClick: myfunction}
// ]

// Note that the iconImg is not necessary
const StandardPopup = ({popupData}) => {
    
    const stopPropagation = (e) => {
        e.stopPropagation()
    }
    return ( 
        <div className="standard-popup-container" onClick={stopPropagation}>
            <div className="standard-popup">
                <ul className="standard-popup-list">
                    {popupData?.length > 0 && popupData.map((item, index) => (
                        <PopupItem key={index} item={item}/>
                ))}
                </ul>
            </div>
        </div>
     );
}
 
export default StandardPopup;