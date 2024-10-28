import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    errorMessage,
    successMessage,
    isLoading,
    handleLogin,
  } = useLogin();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-200 p-5 box-border">
      <div className="max-w-5xl w-full flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Left Section (Login Form) */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-gray-200">
          <h2 className="text-4xl text-gray-800 mb-5 font-semibold">Login</h2>

          {/* Form Start */}
          <form className="w-full" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-4 flex items-center">
              <label
                htmlFor="email"
                className="min-w-[100px] text-right text-lg mr-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 flex items-center relative">
              <label
                htmlFor="password"
                className="min-w-[100px] text-right text-lg mr-2"
              >
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-1 rounded-full hover:bg-gray-500 transition"
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </button>
            </div>

            {/* Error and Success Messages */}
            {errorMessage && (
              <div className="text-red-600 mb-3">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-600 mb-3">{successMessage}</div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white font-semibold py-3 rounded-full hover:bg-gray-700 transition"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          {/* Form End */}
        </div>

        {/* Right Section (Signup Prompt) */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-gray-800 text-white">
          <h1 className="text-4xl font-semibold mb-5">
            Don't have an account?
          </h1>
          <Link to="/signup">
            <button
              type="button"
              disabled={isLoading}
              className="bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-300 transition"
            >
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
