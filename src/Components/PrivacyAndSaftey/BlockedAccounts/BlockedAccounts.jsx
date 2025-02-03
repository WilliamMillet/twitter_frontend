import "./BlockedAccounts.css";
import { useEffect, useState } from "react";
import useFetchData from "../../../hooks/useFetchData";

// Pass the set selected option as a prompt to allow users to return to the base account options page
const BlockedAccounts = ({ setSelectedOption }) => {
  // Declare an augmented blocked accounts state. This exists so that when the user removes a blocked account,
  // the blocked account row can be removed from the DOM without having to complete another fetch.
  const [augmentedBlockedAccounts, setAugmentedBlockedAccounts] = useState([]);

  // Custom hooks for fetching data
  const getBlockedAccounts = useFetchData();
  const unblockAccount = useFetchData();

  // Get the name of the user to pass as an argument to the fetch.
  const user_identifying_name = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );

  // Initial fetch for a list of all blocked accounts.
  useEffect(() => {
    getBlockedAccounts.fetchData(
      `http://localhost:5000/api/users/${user_identifying_name}/blocked-accounts`,
      "GET",
      { includeAuth: true }
    );
  }, []);

  // Update the augmented blocked accounts state when a response is received.
  useEffect(() => {
    if (getBlockedAccounts.response) {
      setAugmentedBlockedAccounts(getBlockedAccounts.response);
    }
  }, getBlockedAccounts.response);

  const handleUnblock = (user_id_name) => {
    // Remove blocked account from the state in the client used to display blocked accounts.
    const indexOfAccountToBlock = augmentedBlockedAccounts.findIndex(
      (blockTableRow) =>
        blockTableRow.blocked_user_identifying_name === user_id_name
    );

    setAugmentedBlockedAccounts((prev) => {
      const newArray = [...prev];
      newArray.splice(indexOfAccountToBlock, 1);
      return newArray;
    });

    // Remove blocked account on the server.
    unblockAccount.fetchData(
      `http://localhost:5000/api/users/${user_id_name}/unblock`,
      "DELETE",
      { includeAuth: true }
    );
  };

  return (
    <>
      <div className="blocked-accounts-header">
        <button
          className="text-only-button settings-arrow-btn"
          onClick={() => setSelectedOption("base-page")}
        >
          🡰
        </button>
        <h4>Blocked Accounts</h4>
      </div>
      <div className="blocked-accounts-container">
        {getBlockedAccounts?.response?.length > 0 ? (
          <>
            <p className="greyed-text blocked-account-info-statement-when-blocked-users-exist">
              When you block someone, they won't be able to follow or message you.
            </p>
            {augmentedBlockedAccounts.map((blockedTableRow, index) => (
              <div key={index} className="blocked-account-list-row">
                <div className="blocked-account">
                  <p className="blocked-account-text">
                    @{blockedTableRow.blocked_user_identifying_name}
                  </p>
                </div>
                <button
                  className="text-only-button remove-blocked-account-button"
                  onClick={() =>
                    handleUnblock(blockedTableRow.blocked_user_identifying_name)
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="block-user-account-prompt-container">
            <h2>Block other user's accounts</h2>
            <p className="greyed-text">
              When you block someone, they won't be able to follow or message you.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default BlockedAccounts;