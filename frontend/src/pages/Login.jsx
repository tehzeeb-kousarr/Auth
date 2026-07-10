import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import GoogleButton from "../components/GoogleButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { login, loginWithGoogle} from "../api/auth.js";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await login(form);
      signIn(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuthSuccess = async (fn, payload) => {
    setError("");
    try {
      const data = await fn(payload);
      signIn(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Enter your details below to continue."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={handleChange}
        />

        {error && (
          <p className="rounded-lg bg-clay/10 px-3.5 py-2.5 text-sm text-clay">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-mist" />
        <span className="text-xs uppercase tracking-wide text-ink/40">or</span>
        <div className="h-px flex-1 bg-mist" />
      </div>

      <div className="space-y-3">
        <GoogleButton
          onSuccess={(credential) => handleOAuthSuccess(loginWithGoogle, credential)}
          onError={setError}
        />
      </div>

      <p className="mt-8 text-center text-sm text-ink/60">
        Don't have an account?{" "}
        <Link to="/signup" className="font-medium text-ink underline underline-offset-4">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
