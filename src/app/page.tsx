"use client";
import Marquee from "react-fast-marquee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { apiService } from "@/api/apiService";
import Toast from "@/components/reusable/Toast";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info" | "warning">("success");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      const token = response.data.data.token;

      // Store token
      localStorage.setItem('AuthKey', token);

      // Decode token to extract role
      const decoded = jwtDecode(token);
      const role = (decoded as any).role || (decoded as any)?.user?.role || null;

      // Store or use role
      localStorage.setItem('UserRole', role); // optional: set context/global state instead

      // Navigate & show success
      router.push("/dashboard/home");
      setToastMessage(response.data.message || "Login successful");
      setToastType("success");
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error?.response?.data?.message || "Login failed");
      setToastType("error");
      setShowToast(true);
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  // const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
      <h2 className="text-2xl font-semibold my-3">
        Welcome back Administrator!
      </h2>

      <Input
        type="email"
        placeholder="Enter your Email Address"
        className="my-4 h-[50px]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="relative w-full mb-8 h-[50px]">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your Password"
          className="pr-10 h-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Eye
          className="absolute right-3 top-4 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
          size={20}
        />
      </div>

      <Button className="w-full bg-[#F4DE00] h-[50px] text-white text-lg" onClick={handleLogin}>
        {loading ? <Loader2 /> : "Sign In"}
      </Button>

      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account yet?{" "}
        <a href="/signup" className="text-black font-semibold">
          Sign up now
        </a>
      </p>
    </AuthLayout>
  );
}
