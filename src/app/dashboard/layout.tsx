import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
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
