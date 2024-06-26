import "./externalusertransferfunds.scss";
import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/dashboard";
import Modal from "../Modal/Modal";
import SetPinModal from "../Modal/SetPinModal";
import axios from "axios";
import Cookies from "js-cookie";
import CSRFToken from "../CSRFToken/CSRFToken";
import { useNavigate } from "react-router-dom";

// let ISAUTHENTICATED = "http://localhost:8000/authenticated";
let ISAUTHENTICATED = "https://156.56.103.251:8000/authenticated";

let isAuthenticated = false;
let firstload = true;

const ExternalUserTransferFunds = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSetPinModalOpen, setIsSetPinModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

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
          `https://156.56.103.251:8000/externaluser/viewaccountpin`,
          config
        );

        if (
          response.status === 200 &&
          response.data.message === "Account pin is set"
        ) {
          setIsSetPinModalOpen(false);
        } else {
          setIsSetPinModalOpen(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const transferFunds = (event) => {
    event.preventDefault();
    let amount = event.target.amount.value;
    let sourceAccount = event.target.sourceAccount.value;
    let destinationAccount = event.target.destinationAccount.value;
    let isAuthoriseRequired = amount > 5000 ? true : false;
    setFormData({
      amount: amount,
      from_account: sourceAccount,
      to_account: destinationAccount,
      isAuthoriseRequired: isAuthoriseRequired,
    });
    setIsModalOpen(true);
  };

  const handleTransferFunds = async (formdata) => {
    setIsModalOpen(false);
    console.log(formdata);

    const config = {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      const response = await axios.post(
        `https://156.56.103.251:8000/externaluser/transferfunds`,
        formdata,
        config
      );

      if (response.status === 200) {
        alert(`Funds transferred successfully`);
        setFormData({});
      } else if (response.status === 400) {
        console.log(response.data);
        alert(`Funds transfer failed`);
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data["from_account_id"]) {
        alert(`Funds transfer failed. Check Source account number`);
      } else if (error.response.data["to_account_id"]) {
        alert(`Funds transfer failed. Check Destination account number`);
      } else if (error.response.data["amount"]) {
        alert(`Funds transfer failed. Check amount`);
      } else if (error.response.data["message"]) {
        alert(`${error.response.data["message"]}`);
      }
    }
  };

  return (
    <>
      <Dashboard role="externaluser" />
      <div className="transferfunds">
        <h1>Transfer Funds</h1>
        <form
          action=""
          className="transferfund_container"
          method="post"
          onSubmit={transferFunds}
        >
          <CSRFToken />
          <label htmlFor="amount">Amount</label>
          <input type="number" id="amount" name="amount" />
          <label htmlFor="sourceAccount">Source Account</label>
          <input type="text" id="sourceAccount" name="sourceAccount" />
          <label htmlFor="destinationAccount">Destination Account</label>
          <input
            type="text"
            id="destinationAccount"
            name="destinationAccount"
          />
          <button type="submit">Transfer</button>
        </form>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleTransferFunds}
          formData={formData}
        ></Modal>
        <SetPinModal
          isOpen={isSetPinModalOpen}
          onClose={() => setIsSetPinModalOpen(false)}
        ></SetPinModal>
      </div>
    </>
  );
};

export default ExternalUserTransferFunds;
