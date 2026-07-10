import React from "react";

// A quiet split-screen shell: a dark editorial panel on the left carries the
// brand voice, the form lives on a plain paper panel on the right. The two
// never compete for attention.
export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full bg-paper lg:flex">
      {/* Left panel — brand / editorial */}
      <div className="relative hidden overflow-hidden bg-ink px-12 py-16 text-paper lg:flex lg:w-[44%] lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #F7F5F1 0px, #F7F5F1 1px, transparent 1px, transparent 64px)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm tracking-[0.2em] text-brass">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            SYSTEMS
          </div>
        </div>

        <div className="relative max-w-sm">
          <p className="mb-6 text-sm uppercase tracking-[0.2em] text-mist/70">
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl font-medium italic leading-[1.15] text-paper">
            "Your workspace, always within reach."
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-mist/70">
            One account, kept carefully — sync your work across every device
            without a second thought.
          </p>
        </div>

        <div className="relative flex items-center gap-8 text-xs text-mist/50">
          <span>© {new Date().getFullYear()} Systems, Inc.</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2 text-sm tracking-[0.2em] text-brass">
              <span className="h-1.5 w-1.5 rounded-full bg-brass" />
              SYSTEMS
            </div>
          </div>

          <h2 className="font-display text-3xl font-medium text-ink">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-ink/60">{subtitle}</p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
