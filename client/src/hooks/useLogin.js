import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; // Import useDispatch from react-redux
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";

const apiUrl = "http://localhost:4000";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const reduxDispatch = useDispatch(); // Use Redux dispatch

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      reduxDispatch(signInStart()); // Dispatch signInStart action
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const response = await axios.post(
          `${apiUrl}/api/users/login`,
          { email, password },
          { withCredentials: true }
        );

        const { token, user } = response.data;

        if (token && user) {
          // Store token and user in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({ token, user }));

          // Set Authorization header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Dispatch login success
          reduxDispatch(signInSuccess(user)); // Dispatch signInSuccess action

          setSuccessMessage("Login successful");
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage(
          error.response?.data?.message || "Login failed. Please try again."
        );
        reduxDispatch(signInFailure(error.response?.data?.message)); // Dispatch signInFailure action with error message
      } finally {
        // The loading state is now managed by Redux
      }
    },
    [email, password, reduxDispatch]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    errorMessage,
    successMessage,
    handleLogin,
  };
};
