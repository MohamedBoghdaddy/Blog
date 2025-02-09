import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";

const apiUrl = "http://localhost:4000";

export const useLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const reduxDispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      reduxDispatch(signInStart());
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const response = await axios.post(
          `${apiUrl}/api/users/login`,
          formData,
          { withCredentials: true }
        );

        const { token, user } = response.data;

        if (token && user) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          reduxDispatch(signInSuccess(user));

          setSuccessMessage("Login successful");
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage(
          error.response?.data?.message || "Login failed. Please try again."
        );
        reduxDispatch(signInFailure(error.response?.data?.message));
      }
    },
    [formData, reduxDispatch]
  );

  return {
    ...formData,
    handleChange,
    showPassword,
    setShowPassword,
    errorMessage,
    successMessage,
    handleLogin,
  };
};
