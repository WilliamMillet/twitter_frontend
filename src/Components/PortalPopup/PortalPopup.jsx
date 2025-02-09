import ReactDOM from 'react-dom'

const PortalPopup = ({ children }) => {
    const portalRoot = document.getElementById('portal-root')
    
    return ReactDOM.createPortal(children, portalRoot)
}

export default PortalPopup