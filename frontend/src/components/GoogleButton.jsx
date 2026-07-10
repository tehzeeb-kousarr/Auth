import React from "react";
import { GoogleLogin } from "@react-oauth/google";

// GoogleLogin renders Google's own branded button and hands us a signed
// ID token (JWT) — that's what we send to the backend for verification.
export default function GoogleButton({ onSuccess, onError }) {
  return (
    <div className="flex w-full justify-center [&>div]:w-full">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onSuccess?.(credentialResponse.credential);
          } else {
            onError?.("Google didn't return a credential.");
          }
        }}
        onError={() => onError?.("Google login was cancelled or failed.")}
        theme="outline"
        shape="rectangular"
        width="100%"
        text="continue_with"
      />
    </div>
  );
}
