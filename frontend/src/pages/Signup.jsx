import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import GoogleButton from "../components/GoogleButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { signup, loginWithGoogle } from "../api/auth.js";

export default function Signup() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await signup(form);
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
      eyebrow="Get started"
      title="Create your account"
      subtitle="It only takes a minute."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          required
          value={form.name}
          onChange={handleChange}
        />
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
          autoComplete="new-password"
          minLength={8}
          required
          value={form.password}
          onChange={handleChange}
        />
        <p className="!mt-1.5 text-xs text-ink/40">At least 8 characters.</p>

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
          {submitting ? "Creating account…" : "Create account"}
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
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-ink underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
