import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-md rounded-2xl border border-mist bg-white p-8 shadow-panel">
        <div className="flex items-center gap-2 text-sm tracking-[0.2em] text-brass">
          <span className="h-1.5 w-1.5 rounded-full bg-brass" />
          SYSTEMS
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-display text-lg text-paper">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="font-display text-xl font-medium text-ink">
              Welcome, {user?.name || "there"}
            </h1>
            <p className="text-sm text-ink/50">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-mist/40 px-4 py-3 text-sm text-ink/70">
          Signed in via <span className="font-medium capitalize">{user?.provider}</span>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-6 w-full rounded-lg border border-mist px-4 py-2.5 text-sm font-medium text-ink transition hover:border-ink/30 hover:bg-mist/40"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
