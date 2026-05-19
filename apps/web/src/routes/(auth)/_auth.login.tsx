import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/features/auth/auth-form";

export const Route = createFileRoute("/(auth)/_auth/login")({
  component: () => <AuthForm mode="login" />,
});

