import { Link } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";
import { useDispatch } from "react-redux"; // Import useDispatch
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice.js"; // Import Redux actions

const Signup = () => {
  const {
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
    errorMessage,
    successMessage,
    isLoading,
    handleSignup,
  } = useSignup();

  const reduxDispatch = useDispatch(); // Initialize Redux dispatch

  const handleSignupWithRedux = async (e) => {
    e.preventDefault();
    reduxDispatch(signInStart()); // Dispatch signInStart action for loading state

    try {
      await handleSignup(e); // Call the existing handleSignup function
      reduxDispatch(signInSuccess({ username, email })); // Dispatch success with user data
    } catch (error) {
      reduxDispatch(signInFailure(error.message)); // Dispatch failure on error
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-200 p-5 box-border">
      <div className="max-w-3xl w-full flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
        {/* Left Signup Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-gray-100">
          <h2 className="text-4xl text-gray-800 mb-5 font-semibold">Signup</h2>
          <form onSubmit={handleSignupWithRedux} className="w-full">
            {/* Username Input */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-lg mb-1 text-gray-700"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-lg mb-1 text-gray-700"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={70}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-lg mb-1 text-gray-700"
              >
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-700 hover:text-gray-800 transition"
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4 relative">
              <label
                htmlFor="confirmPassword"
                className="block text-lg mb-1 text-gray-700"
              >
                Confirm Password:
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-gray-700 hover:text-gray-800 transition"
              >
                <i
                  className={
                    showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                  }
                ></i>
              </button>
            </div>

            {/* Gender Selection */}
            <div className="mb-4">
              <label className="block text-lg mb-1 text-gray-700">
                Gender:
              </label>
              <div className="flex gap-4 items-center">
                <label className="text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="mr-1"
                  />
                  Male
                </label>
                <label className="text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="mr-1"
                  />
                  Female
                </label>
              </div>
            </div>

            {/* Error and Success Messages */}
            {errorMessage && (
              <div className="text-red-600 mb-3">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-600 mb-3">{successMessage}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white font-semibold py-3 rounded-full hover:bg-gray-700 transition"
            >
              {isLoading ? "Signing up..." : "Signup"}
            </button>
          </form>
        </div>

        {/* Right Section (Login Prompt) */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-gray-800 text-white">
          <h1 className="text-4xl font-semibold mb-5">
            Already have an account?
          </h1>
          <Link to="/login">
            <button
              type="button"
              className="bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-300 transition"
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
