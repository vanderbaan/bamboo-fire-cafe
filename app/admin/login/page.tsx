import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

/**
 * Server shell for /admin/login. The actual form lives in <LoginForm /> (client) which
 * reads useSearchParams(). Next.js 14 requires any consumer of useSearchParams to sit
 * inside a Suspense boundary or the build bails out of static prerendering with an error.
 * The Suspense fallback is null because the form renders instantly on the client — no
 * meaningful loading state to show.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
