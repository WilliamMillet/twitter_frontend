import { useEffect, useState } from "react";

export const useDaysInMonth = (month, year) => {
    const [days, setDays] = useState([])

    const isLeapYear = (year) => {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          return true
        } else {
          return false
        }
      };
  
      let daysInMonth = {
        january: 31,
        february: isLeapYear(year) ? 29 : 28,
        march: 31,
        april: 30,
        may: 31,
        june: 30,
        july: 31,
        august: 31,
        september: 30,
        october: 31,
        november: 30,
        december: 31
      };

    useEffect(() => {
        
        if (month) {
          console.log(month)
            const numberOfDays = daysInMonth[month];
            if (month === 'february') {
                if (year) {
                    setDays(Array.from({length: numberOfDays}, (_, index) => index + 1 ))
                } else {
                    setDays(Array.from({length: 28}, (_, index) => index + 1))
                }
            } else {
              setDays(Array.from({length: numberOfDays}, (_, index) => index + 1 ))
            }
        } else {
            setDays(Array.from({length: 31}, (_, index) => index + 1))
        }

      }, [month, year]);

    return { days }
}