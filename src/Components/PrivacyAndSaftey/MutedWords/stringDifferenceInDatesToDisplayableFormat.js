const stringDifferenceInDatesToDispayableFormat = (mutedAtString, mutedUntilString) => {

    if (mutedUntilString === null) {
        return 'Forever'
    }

    const mutedAtIso = new Date(mutedAtString)
    const mutedUntilIso = new Date(mutedUntilString)

    const durationInMs = mutedUntilIso - mutedAtIso

    const durations = {
        "24 hours": 24 * 60 * 60 * 1000,
        "7 days": 7 * 24 * 60 * 60 * 1000,
        "30 days": 30 * 24 * 60 * 60 * 1000
      };

      let duration = Object.keys(durations).find(
        key => Math.abs(durations[key] - durationInMs) <= 10000
      );
      
      return duration

}
 
export default stringDifferenceInDatesToDispayableFormat

