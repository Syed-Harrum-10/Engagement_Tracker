import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "./api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/users/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        setError("We couldn't create your account with those details. Please try again.");
        return;
      }
      setSuccess(true);
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
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-heading">
            <p className="eyebrow">Start exploring</p>
            <h1>Make it yours.</h1>
            <p>Create an account and find more of what you love.</p>
          </div>
          <div className="form-fields">
            <div className="form-field">
              <label htmlFor="name">Your name</label>
              <input id="name" type="text" autoComplete="name" placeholder="Jamie Parker" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="new-password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
          </div>
          {error && <p className="form-message" role="alert">{error}</p>}
          {success && <p className="form-message success" role="status">Your account is ready. Log in to get started.</p>}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
          <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </section>
    </main>
  );
}

export default Register;