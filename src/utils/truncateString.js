const truncateString = (string, maxLength) => {
    if (!maxLength) {
        console.log("Please provide a maximum length")
        return string
    }
    if (string.length <= maxLength) {
        return string
    } else {
        return string.slice(0, maxLength) + '...'
    }
}
 
export default truncateString;