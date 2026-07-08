import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/AuthSlice";
import { useAdminLoginMutation } from "../../api/LoginApi";
import type { RootState } from "../../redux/store";
import "./LoginScreen.css";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [adminLogin, { isLoading, error }] = useAdminLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if already authenticated
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminLogin({ email, password }).unwrap();
      dispatch(
        setCredentials({
          token: response.access,
          user: response.user,
        })
      );
    } catch (err: any) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo"></div>
        </div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to the Admin Dashboard</p>

        {error && (
          <div className="login-error">
            {(error as any)?.data?.detail || "Failed to login. Please check your credentials."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="login-input"
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
