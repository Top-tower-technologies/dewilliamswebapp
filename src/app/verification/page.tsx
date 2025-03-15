"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold my-3">Verifying your identity</h2>

      <p className="text-center font-[400] text-[20px] mb-8">
        Your account details have been submitted to the Super Admin for review.
      </p>
      <Button className="w-full bg-[#F4DE00] h-[50px] text-white text-lg">
        Close Page
      </Button>
    </AuthLayout>
  );
}
