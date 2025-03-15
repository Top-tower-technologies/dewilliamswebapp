"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold my-3">Let’s Create your Account</h2>

      <Input
        type="email"
        placeholder="Enter your Email Address"
        className="my-4 h-[50px]"
      />

      <div className="relative w-full mb-8 h-[50px]">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your Password"
          className="pr-10 h-full"
        />
        <Eye
          className="absolute right-3 top-4 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
          size={20}
        />
      </div>

      <Button className="w-full bg-[#F4DE00] h-[50px] text-white text-lg">
        Create Account
      </Button>

      <p className="mt-4 text-sm text-gray-600">
        Already have an Account?{" "}
        <a href="/signup" className="text-black font-semibold">
          Login
        </a>
      </p>
    </AuthLayout>
  );
}
