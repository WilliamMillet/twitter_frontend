
const isoDateToDisplayableFormat = (date, includeYears, includeMonths, includeDays) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const ordinalSuffixes = [
        "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
        "th", "th", "th", "th", "th", "th", "th", "th", "th", "th",
        "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th",
        "st" 
      ];


    const splitDate = String(date).split(/[-T]/)

    const toReturn = []

    if (includeMonths) {
         const month = months[Number(splitDate[1]) - 1]
        toReturn.push(month)
    }
    if (includeDays) {
        const day = splitDate[2]
        const formattedDay = day + ordinalSuffixes[Number(day) - 1]
        toReturn.push(formattedDay)
    } if  (includeYears) {
        const year = splitDate[0]
        toReturn.push(year)
    }

    return toReturn.join(" ")
}
 
export default isoDateToDisplayableFormat;