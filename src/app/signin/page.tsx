"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { apiService } from "@/api/apiService";
import { useRouter } from "next/navigation";
import Toast from "@/components/reusable/Toast";

export default function LoginPage() {


  return (
    <AuthLayout>

      <h2 className="text-2xl font-semibold my-3">Let’s Create your Account</h2>



      <p className="mt-4 text-sm text-gray-600">
        Already have an Account?{" "}
        <a href="/signup" className="text-black font-semibold">
          Sign up
        </a>
      </p>
    </AuthLayout>
  );
}
