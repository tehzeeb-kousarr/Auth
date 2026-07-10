import React from "react";

export default function FormField({ label, id, error, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink/80">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-4 focus:ring-brass/15 ${
          error ? "border-clay" : "border-mist"
        }`}
        {...inputProps}
      />
      {error && <p className="mt-1.5 text-xs text-clay">{error}</p>}
    </div>
  );
}
