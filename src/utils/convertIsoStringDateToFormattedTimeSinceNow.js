const convertIsoStringDateToFormattedTimeSinceNow = (isoDateString) => {
    const now = new Date()
    const then = new Date(isoDateString)

    const diffInMs = now - then

    if (diffInMs  < 0) {
        return null
    }

    const diffInMinutes = diffInMs / 60000;
    const diffInHours   = diffInMinutes / 60;
    const diffInDays    = diffInHours / 24;
    const diffInWeeks   = diffInDays / 7;
    const diffInMonths  = diffInDays / 30.4375;
    const diffInYears   = diffInDays / 365.25; 

    // Check if an s is necessary

    const includeS = (value) => {
        if (value === 1) {
            return ''
        } else {
            return 's'
        }
    }

    if (diffInMinutes < 1) {
        return `${Math.round(diffInMs / 1000)}s`;
    } else if (diffInMinutes < 60) {
        return `${Math.round(diffInMinutes)}m`;
    } else if (diffInHours < 24) {
        return `${Math.round(diffInHours)}h`;
    } else if (diffInDays < 7) {
        return `${Math.round(diffInDays)}d`;
    } else if (diffInWeeks < 4.345) {
        return `${Math.round(diffInWeeks)}w`;
    } else if (diffInMonths < 12) {
        return `${Math.round(diffInMonths)}mo`;
    } else {
        return `${Math.round(diffInYears)}y`;
    }


}

export default convertIsoStringDateToFormattedTimeSinceNow


    // Old Logic
    // if (diffInMinutes < 1) {
    //     return "Less than a minute ago";
    // } else if (diffInMinutes < 60) {
    //     const rounded = Math.round(diffInMinutes);
    //     return `${rounded} minute${includeS(rounded)} ago`;
    // } else if (diffInHours < 24) {
    //     const rounded = Math.round(diffInHours);
    //     return `${rounded} hour${includeS(rounded)} ago`;
    // } else if (diffInDays < 7) {
    //     const rounded = Math.round(diffInDays);
    //     return `${rounded} day${includeS(rounded)} ago`;
    // } else if (diffInWeeks < 4.345) {
    //     const rounded = Math.round(diffInWeeks);
    //     return `${rounded} week${includeS(rounded)} ago`;
    // } else if (diffInMonths < 12) {
    //     const rounded = Math.round(diffInMonths);
    //     return `${rounded} month${includeS(rounded)} ago`;
    // } else {
    //     const rounded = Math.round(diffInYears);
    //     return `${rounded} year${includeS(rounded)} ago`;
    // }