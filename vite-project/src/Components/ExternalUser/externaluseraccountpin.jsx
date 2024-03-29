import React, { useState, useEffect, useRef } from "react";
import "./externaluseraccountpin.scss";
import Dashboard from "../Dashboard/dashboard";
import axios from "axios";

let UPDATE_URL = "http://localhost:8000/externaluser/setaccountpin";

const ExternalUserAccountPin = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const timerId = useRef(null);

  const clearErrorMessageTimeout = () => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
  };

  useEffect(() => {
    return clearErrorMessageTimeout;
  }, []);

  const handleSetAccountPinSubmit = async (event) => {
    event.preventDefault();
    clearErrorMessageTimeout();
    let accountnumber = event.target.accountnumber.value;
    let setpin = event.target.setpin.value;
    let confirmpin = event.target.confirmpin.value;

    if (accountnumber === "" || setpin === "" || confirmpin === "") {
      setErrorMessage("All fields are required");
    } else if (setpin !== confirmpin) {
      setErrorMessage("Pin and Confirm Pin should match");
    } else if (setpin.length !== 6) {
      setErrorMessage("Pin should be 6 digits");
    } else if (confirmpin.length !== 6) {
      setErrorMessage("Confirm Pin should be 6 digits");
    } else if (setpin[0] === "0") {
      setErrorMessage("Pin should not start with 0");
    } else {
      setErrorMessage("");
      try {
        const updateDetails = {
          account_pin: setpin,
        };
        const response = await axios.put(
          `${UPDATE_URL}/${accountnumber}`,
          updateDetails
        );
        console.log(response);
        if (response.status === 200) {
          alert("Account pin updated successfully!");
          event.target.accountnumber.value = "";
          event.target.setpin.value = "";
          event.target.confirmpin.value = "";
        } else if (response.status === 404) {
          alert("Account pin update failed");
        }
      } catch (error) {
        console.error(
          "Error updating account pin:",
          error.response ? error.response.data : error.message
        );
        event.target.accountnumber.value = "";
        event.target.setpin.value = "";
        event.target.confirmpin.value = "";
      }

      // Set a new timeout for the error message
      timerId.current = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <>
      <Dashboard role="externaluser" />
      <div className="accountpin">
        <h1>Set Account Pin</h1>
        <form
          className="accountpin_container"
          onSubmit={handleSetAccountPinSubmit}
        >
          <label htmlFor="accountnumber">Account Number</label>
          <input type="text" id="accountnumber" name="accountnumber" />
          <label htmlFor="setpin">Set Pin</label>
          <input type="password" id="setpin" name="setpin" maxLength={6} />
          <label htmlFor="confirmpin">Confirm Pin</label>
          <input
            type="password"
            id="confirmpin"
            name="confirmpin"
            maxLength={6}
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit">Set Pin</button>
        </form>
      </div>
    </>
  );
};

export default ExternalUserAccountPin;
