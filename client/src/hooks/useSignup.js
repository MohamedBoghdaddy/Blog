import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import { useAuthContext } from "../context/AuthContext.jsx";

const apiUrl = "http://localhost:4000";

export const useSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useAuthContext();
  const reduxDispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    reduxDispatch(signInStart());

    try {
      const response = await axios.post(
        `${apiUrl}/api/users/signup`,
        formData,
        { withCredentials: true }
      );

      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));

      reduxDispatch(signInSuccess(user));
      dispatch({ type: "REGISTRATION_SUCCESS", payload: user });

      setSuccessMessage("Registration successful");
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage(
        error.response?.data?.message || "Signup failed. Please try again."
      );
      reduxDispatch(signInFailure(error.response?.data?.message));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...formData,
    setFormData,
    handleChange,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errorMessage,
    successMessage,
    isLoading,
    handleSignup,
  };
};
