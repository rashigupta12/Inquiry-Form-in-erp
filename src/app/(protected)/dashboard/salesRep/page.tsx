

"use client";
import InquiryManagement from "@/components/salesRep/InquiryForm";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCurrentUser } from "@/hooks/auth";
import { LogOut, Menu, Settings, Users, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "Inquiery-form";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const User = useCurrentUser();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/salesRep?tab=${tab}`, { scroll: false });
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleLogout = async () => {
    await signOut({ redirectTo: "/auth/login" });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Inquiery-form":
        return <InquiryManagement/>;
      case "profile":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Profile</h2>
            <p className="text-emerald-600">View and edit your profile information.</p>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Dashboard</h2>
            <p className="text-emerald-600">Welcome to your admin dashboard.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex flex-col">
      {/* Top Navigation Bar - Sticky */}
      <nav className="bg-white shadow-lg border-b-2 border-emerald-200 px-4 sm:px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Image src="/Picture1.jpg" alt="Logo" width={70} height={70} className="object-fit" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-center text-xl sm:text-2xl font-bold text-emerald-800 hidden sm:block">
            Sales Representative
          </h1>

          {/* User Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-emerald-50 rounded-lg p-2 transition-colors">
                <span className="hidden sm:block text-emerald-700 font-medium">{User?.name}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 border-emerald-200" align="end">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-2 rounded-lg p-2 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors">
                  <Settings className="h-4 w-4" />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 rounded-lg p-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Sticky */}
        <aside
          className={`
            fixed lg:sticky top-[73px] lg:top-[73px] bottom-0 left-0 z-40 w-64 bg-white border-r-2 border-emerald-200 
            h-[calc(100vh-73px)] p-4 shadow-lg lg:shadow-none overflow-y-auto
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="space-y-2 mt-2">
            <button
              onClick={() => handleTabChange("Inquiery-form")}
              className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                activeTab === "Inquiery-form"
                  ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg transform scale-105"
                  : "text-emerald-700 hover:bg-emerald-50 hover:shadow-md"
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Inquiry Form</span>
            </button>
          </nav>
          
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Dashboard Title */}
            <div className="sm:hidden mb-6">
              <h1 className="text-2xl font-bold text-emerald-800">Sales Respresentative</h1>
            </div>

            {/* Main Content Area */}
            <div className="min-h-[calc(100vh-200px)]">
              {renderContent()}
            </div>

            {/* Footer - Sticky at bottom of content */}
            <footer className="sticky bottom-0 bg-white border-t border-emerald-200 mt-6 py-4">
              <div className="text-center text-sm text-emerald-600">
                © {new Date().getFullYear()} EcoElite. All rights reserved.
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}