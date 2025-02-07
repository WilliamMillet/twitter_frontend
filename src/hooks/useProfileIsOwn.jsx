import { useState, useEffect } from 'react';

const useProfileIsOwn = (userIdentifyingName) => {
  const [profileIsOwn, setProfileIsOwn] = useState(null);

  useEffect(() => {
    // Retrieve the personal user's name from local storage.
    const storedName = JSON.parse(localStorage.getItem("user_identifying_name"));

    if (storedName && userIdentifyingName) {
      // Compare the two names.
      const match = storedName === userIdentifyingName;
      setProfileIsOwn(match);
    } else {
      // Handle the case when one or both names are missing.
      setProfileIsOwn(false);
    }
  }, [userIdentifyingName]);

  return profileIsOwn;
};

export default useProfileIsOwn;