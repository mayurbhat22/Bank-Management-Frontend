import React from "react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "../Dashboard/dashboard";
import "./externaluserhome.css";
import Cookies from "js-cookie";

// let VIEW_PROFILE_URL = "http://localhost:8000/viewuserprofiles";
let VIEW_PROFILE_URL = "https://156.56.103.251:8000/viewuserprofiles";

// let ISAUTHENTICATED = "http://localhost:8000/authenticated";
let ISAUTHENTICATED = "https://156.56.103.251:8000/authenticated";

let isAuthenticated = false;
let firstload = true;

export default function ExternalUser() {
  const [user_data, setUserData] = useState({
    userName: "",
    accountNumber: "",
    balance: "",
  });

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
        const response = await axios.get(VIEW_PROFILE_URL, config);
        const user = response.data.profile;
        setUserData({
          userName: user.name,
          accountNumber: user.account.account_number,
          balance: user.account.balance,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    navigate("/externaluser/editprofile");
  };

  return (
    <>
      <Dashboard role="externaluser" />
      <div className="bank-page">
        <main className="bank-content">
          <section className="user-info">
            <h1>Hi, {user_data.userName}</h1>
            <p>Account Number: {user_data.accountNumber}</p>
            <p>Balance: ${user_data.balance}</p>
            <button className="edit_profile" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </section>
        </main>
      </div>
    </>
  );
}
