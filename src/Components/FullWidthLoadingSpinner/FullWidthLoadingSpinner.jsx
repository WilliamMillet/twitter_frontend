import './FullWidthLoadingSpinner.css'

const FullWidthLoadingSpinner = ({ heightInPx = 300}) => {

    return (
        <div className="full-width-center-children" style={{ height: heightInPx }}>
          <span class="loader"></span>
        </div>
      )
}
 
export default FullWidthLoadingSpinner;