"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const IDLE_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

  const logout = useCallback(() => {
    // Clear any stored tokens/auth data
    localStorage.removeItem('AuthKey');
    // Add any other cleanup here (clear cookies, etc.)
    
    // Redirect to login page
    router.push('/');
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      logout();
    }, IDLE_TIME);
  }, [logout, IDLE_TIME]);

  // Set up idle timeout and activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Start the timer
    resetTimer();

    // Reset timer on user activity
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [resetTimer]);

  // Set up global 401 error interceptor
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      if (response.status === 401) {
        logout();
        return response;
      }
      
      return response;
    };

    // For axios users (if you're using axios instead of fetch)
    // You can add axios interceptor here
    /*
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    */

    // Cleanup
    return () => {
      window.fetch = originalFetch;
      // If using axios: axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className="z-50" />
        <div className="w-full bg-[#FBFBFB]">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}