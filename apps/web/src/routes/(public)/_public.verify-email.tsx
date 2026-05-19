import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/features/public/verify-email-page";

function VerifyEmailRouteComponent() {
  return (
    <div className="section-shell flex min-h-dvh items-center justify-center py-16">
      <VerifyEmailPage />
    </div>
  );
}

export const Route = createFileRoute("/(public)/_public/verify-email")({
  component: VerifyEmailRouteComponent,
});

