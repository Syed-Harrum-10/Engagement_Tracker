import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "./api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("That email and password combination wasn't recognized.");
        return;
      }
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch {
      setError("We couldn't connect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-layout">
      <aside className="auth-aside">
        <div>
          <p className="eyebrow">A more mindful way to explore</p>
          <h2>Make room for what moves you.</h2>
        </div>
        <p>Save a little time for the things you love. Your interests, gathered in one place.</p>
      </aside>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-heading">
            <p className="eyebrow">Welcome back</p>
            <h1>Good to see you.</h1>
            <p>Log in to pick up right where you left off.</p>
          </div>
          <div className="form-fields">
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
          </div>
          {error && <p className="form-message" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
          <p className="auth-switch">New around here? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}

export default Login;