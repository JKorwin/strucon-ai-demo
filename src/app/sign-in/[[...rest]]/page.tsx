'use client';

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen justify-center pt-24">
      <SignIn 
        path="/sign-in"
        routing="path"
        redirectUrl="/dashboard"
        appearance={{
          elements: {
            card: "bg-white dark:bg-gray-800 shadow-lg",
            headerSubtitle: "hidden",
            footerAction: "hidden",
          },
        }}
      />
    </div>
  );
}