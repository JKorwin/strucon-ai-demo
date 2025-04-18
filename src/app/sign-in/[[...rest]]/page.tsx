'use client';

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen justify-center pt-24">
      <SignIn 
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard" // 👈 Redirect here after sign-in
        appearance={{
          elements: {
            card: "bg-white dark:bg-gray-800 shadow-lg",
          },
        }}
      />
    </div>
  );
}