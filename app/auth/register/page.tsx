import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Create Account | Clara",
  description: "Create your Clara account to save your election picks and preferences",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
} 
