import "./internaluserauthorizetransactions.scss";
import Dashboard from "../Dashboard/dashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// let ISAUTHENTICATED = "http://localhost:8000/authenticated";
let ISAUTHENTICATED = "https://156.56.103.251:8000/authenticated";

let isAuthenticated = false;
let firstload = true;

const InternalUserAuthorizeTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await axios.get(ISAUTHENTICATED, config);
        if (response.data.error || response.data.isAuthenticated === "error") {
          alert("You need to login to access this page");
          navigate("/");
        } else if (response.data.isAuthenticated === "success") {
          isAuthenticated = true;
        } else {
          alert("Something went wrong");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (firstload) {
      fetchData();
      firstload = false;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      };
      try {
        const response = await axios.get(
          "https://156.56.103.251:8000/externaluser/transactionhistory",
          config
        );
        setTransactions(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (firstload) {
  //     firstload = false;
  //     if (sessionStorage.getItem("name") === null) {
  //       alert("You need to log in to access this page");
  //       sessionStorage.clear();
  //       navigate("../");
  //     }
  //   }
  // }, []);

  const handleAuthorization = async (transaction_id) => {
    const from_account_number = transactions.find(
      (transaction) => transaction.transaction_id === transaction_id
    ).from_account_number;
    const to_account_number = transactions.find(
      (transaction) => transaction.transaction_id === transaction_id
    ).to_account_number;
    const amount = transactions.find(
      (transaction) => transaction.transaction_id === transaction_id
    ).amount;

    const updateDetails = {
      transaction_id: transaction_id,
      from_account_number: from_account_number,
      to_account_number: to_account_number,
      amount: amount,
    };

    console.log("Update Details", updateDetails);
    const config = {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      const response = await axios.put(
        `https://156.56.103.251:8000/internaluser/authorizetransaction/${transaction_id}`,
        updateDetails,
        config
      );
      if (response.status === 200) {
        alert("Transaction authorized successfully");
        setTransactions((prevTransactions) =>
          prevTransactions.filter(
            (transaction) => transaction.transaction_id !== transaction_id
          )
        );
      }
    } catch (error) {
      console.error("There was an error authorizing the transaction!", error);
    }
  };

  return (
    <>
      <Dashboard role="internaluser" />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
              <th>Source Account</th>
              <th>Destination Account</th>
              <th>Authorize Transaction</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.transaction_id}>
                <td>{transaction.transaction_id}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.transaction_type}</td>
                <td>{transaction.created_at}</td>
                <td>{transaction.from_account_number}</td>
                <td>{transaction.to_account_number}</td>
                <td>
                  <button
                    id="delete"
                    className="authorize"
                    onClick={() =>
                      handleAuthorization(transaction.transaction_id)
                    }
                  >
                    Authorize Transaction
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InternalUserAuthorizeTransactions;
