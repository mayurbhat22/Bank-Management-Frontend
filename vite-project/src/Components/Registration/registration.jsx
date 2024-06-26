import "./registration.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import CSRFToken from "../CSRFToken/CSRFToken";

// let REGISTRATION_URL = "http://localhost:8000/registration";
let REGISTRATION_URL = "https://156.56.103.251:8000/registration";

const Registration = () => {
  const [userName, setUserName] = useState("");
  const [user_userName, setUser_UserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("External");
  const [roleType, setRoleType] = useState("");

  const navigate = useNavigate();

  const secondDropdownOptions = {
    Internal: ["System Admin", "System Manager", "Employee"],
    External: ["Customer", "Merchant/Organisation"],
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    // check all fields filled out
    if (
      userName === "" ||
      user_userName === "" ||
      userEmail === "" ||
      userPassword === "" ||
      confirmPassword === "" ||
      userType === "" ||
      roleType === ""
    ) {
      alert("Registration failed. Please fill out all fields");
      return;
    }

    // Validate password rules
    if (!validatePassword(userPassword)) {
      alert(
        "Registration failed. Password must contain at least 8 characters, one uppercase letter, one number, and one special character."
      );
      return;
    }

    if (userPassword !== confirmPassword) {
      alert("Registration failed. Passwords do not match.");
      return;
    }

    // verify email address
    await axios
      .post("https://bank-management-backend-five.vercel.app/verify-email", {
        email: userEmail,
      })
      .then(
        (response) => {
          if (response.status === 200) {
            alert(`Email sent for verification. Please check your email.`);
            navigate("/verify-email", {
              state: {
                name: userName,
                username: user_userName,
                email: userEmail,
                user_role: roleType,
                userType: userType,
                password: userPassword,
              },
            });
          } else {
            alert(
              `Email verification failed. There was an error verifying the email. Please try again`
            );
          }
        },
        (error) => {
          console.log(error);
          alert(
            `Email verification failed. There was an error verifying the email. Please try again`
          );
        }
      );
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <>
      <div className="box-container">
        <div className="registration-container">
          <h1>Register a User</h1>
          <form
            className="input-container"
            onSubmit={handleRegistrationSubmit}
            method="post"
          >
            <CSRFToken />
            <div>
              {/* <select
                value={userType}
                className="user-dropdown"
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="">Select User Type</option>
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </select> */}

              {userType && (
                <select
                  value={roleType}
                  className="role-dropdown"
                  onChange={(e) => setRoleType(e.target.value)}
                >
                  <option value="">Select Option</option>
                  {secondDropdownOptions[userType].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <input
                value={userName}
                className="username"
                type="text"
                placeholder="Name"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <input
                value={user_userName}
                className="username"
                type="text"
                placeholder="Username"
                onChange={(e) => setUser_UserName(e.target.value)}
              />
            </div>
            <div>
              <input
                value={userEmail}
                className="emailaddress"
                type="email"
                placeholder="Enter your Email"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                value={userPassword}
                className="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                value={confirmPassword}
                className="confirm-password"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="primary-button" type="submit">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;
