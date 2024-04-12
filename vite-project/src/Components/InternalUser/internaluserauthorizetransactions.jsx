import "./internaluserauthorizetransactions.scss";
import Dashboard from "../Dashboard/dashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

let firstload = true;

const InternalUserAuthorizeTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/externaluser/transactionhistory", {
        params: {
          isSystemAdmin: true,
        },
      })
      .then((response) => {
        console.log(response.data);
        setTransactions(response.data);
      });
  }, []);

  useEffect(() => {
    if (firstload) {
      firstload = false;
      if (sessionStorage.getItem("name") === null) {
        alert("You need to log in to access this page");
        sessionStorage.clear();
        navigate("../");
      }
    }
  }, []);

  const handleAuthorization = (transaction_id) => {
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

    axios
      .put(
        `http://localhost:8000/internaluser/authorizetransaction/${transaction_id}`,
        updateDetails
      )
      .then((response) => {
        if (response.status === 200) {
          alert("Transaction authorized successfully");
          setTransactions((prevTransactions) =>
            prevTransactions.filter(
              (transaction) => transaction.transaction_id !== transaction_id
            )
          );
        }
      })
      .catch((error) => {
        console.error("There was an error authorizing the transaction!", error);
      });
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
