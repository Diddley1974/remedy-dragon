import { Suspense } from "react";
import SignInForm from "../signin/SignInForm";

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md p-6">Loading…</main>}>
      <SignInForm />
    </Suspense>
  );
}
