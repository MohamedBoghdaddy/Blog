import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux"; // Import useDispatch
import { authReducer } from "./authreducer.jsx"; // Ensure this file exists and is named correctly
import { signInSuccess, signInFailure } from "../redux/user/userSlice.js"; // Import Redux actions

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const AuthProvider = ({ children }) => {
  const [state] = useReducer(authReducer, initialState); // Use localDispatch for clarity
  const reduxDispatch = useDispatch(); // Initialize Redux dispatch

  const checkAuth = useCallback(async () => {
    if (!state.isAuthenticated && state.loading) {
      try {
        const token =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1] || localStorage.getItem("token");

        if (token) {
          const response = await axios.get(
            `${
              process.env.REACT_APP_API_URL || "http://localhost:4000"
            }/api/users/checkAuth`,
            { withCredentials: true }
          );
          const { user } = response.data;
          if (user) {
            reduxDispatch(signInSuccess(user)); // Dispatch Redux action for successful login
            // Ensure the token is set for future requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("user", JSON.stringify({ token, user }));
          } else {
            reduxDispatch(signInFailure("User not found")); // Dispatch failure action if user not found
          }
        } else {
          reduxDispatch(signInFailure("No token provided")); // Dispatch failure action if no token
        }
      } catch (error) {
        console.error("Auth check failed", error);
        reduxDispatch(signInFailure(error.message)); // Dispatch error message on failure
      }
    }
  }, [state.isAuthenticated, state.loading, reduxDispatch]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const { token, user } = JSON.parse(storedUser);
        if (user && token) {
          reduxDispatch(signInSuccess(user)); // Dispatch success with user data
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          checkAuth(); // Fallback to server check if no valid local data
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        reduxDispatch(signInFailure("Failed to parse user data")); // Dispatch failure on parse error
      }
    } else {
      checkAuth(); // Check server-side if no user is in local storage
    }
  }, [checkAuth, reduxDispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    axios.defaults.headers.common["Authorization"] = null;
    reduxDispatch(signInFailure("User logged out")); // Optionally dispatch logout action
  }, [reduxDispatch]);

  const contextValue = useMemo(() => ({ state, logout }), [state, logout]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// PropTypes validation for children
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
