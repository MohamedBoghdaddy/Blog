import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; // Import useDispatch
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js"; // Import Redux actions
import { useAuthContext } from "../context/AuthContext.jsx";

const apiUrl = "http://localhost:4000";

export const useSignup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const reduxDispatch = useDispatch(); // Initialize Redux dispatch

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    reduxDispatch(signInStart()); // Dispatch signInStart action for loading state

    try {
      const response = await axios.post(
        `${apiUrl}/api/users/signup`,
        {
          username,
          email,
          password,
          gender,
          firstName,
          middleName,
          lastName,
        },
        { withCredentials: true }
      );

      const { user } = response.data;

      // Store user in local storage
      localStorage.setItem("user", JSON.stringify({ user }));

      // Dispatch signup success
      reduxDispatch(signInSuccess(user)); // Dispatch success with user data
      dispatch({ type: "REGISTRATION_SUCCESS", payload: user }); // Optionally dispatch another success action

      setSuccessMessage("Registration successful");
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage(
        error.response?.data?.message || "Signup failed. Please try again."
      );
      reduxDispatch(signInFailure(error.response?.data?.message)); // Dispatch failure on error
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    gender,
    setGender,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    errorMessage,
    successMessage,
    isLoading,
    handleSignup,
  };
};
