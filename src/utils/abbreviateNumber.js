const abbreviateNumber = (num) => {
    if (num >= 1_000_000) {
        return parseFloat((num / 1_000_000).toFixed(1)) + 'm';
    } else if (num >= 10_000) {
        return Math.round(num / 1_000) + 'k';
    } else if (num >= 1_000) {
        return parseFloat((num / 1_000).toFixed(1)) + 'k';
    } else {
        return num.toString();
    }
};

export default abbreviateNumber;