import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Home, Users, Beaker, FileText, DollarSign, Settings } from "lucide-react";

interface LimsLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function LimsLayout({ children, currentPage }: LimsLayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="blueprint-card max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-accent">SmartPathology LIMS</h1>
          <p className="mb-6 text-muted">Laboratory Information Management System</p>
          <a href={getLoginUrl()}>
            <Button className="btn-blueprint w-full">Sign In</Button>
          </a>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, roles: ["admin", "technician", "receptionist", "doctor"] },
    { id: "patients", label: "Patients", icon: Users, roles: ["admin", "receptionist", "doctor"] },
    { id: "tests", label: "Tests", icon: Beaker, roles: ["admin", "receptionist", "technician"] },
    { id: "results", label: "Results", icon: FileText, roles: ["admin", "technician", "doctor"] },
    { id: "reports", label: "Reports", icon: FileText, roles: ["admin", "doctor"] },
    { id: "billing", label: "Billing", icon: DollarSign, roles: ["admin", "receptionist"] },
    { id: "admin", label: "Admin", icon: Settings, roles: ["admin"] },
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(user?.role || "user"));

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-accent transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-accent">
          <div className="blueprint-frame p-3">
            <h1 className={`font-bold text-accent ${sidebarOpen ? "text-lg" : "text-xs text-center"}`}>
              {sidebarOpen ? "LIMS" : "L"}
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <a
                key={item.id}
                href={`/${item.id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-all ${
                  isActive
                    ? "bg-accent text-white border border-accent"
                    : "text-muted hover:text-foreground border border-transparent hover:border-accent"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-semibold">{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-accent p-4 space-y-3">
          {sidebarOpen && (
            <div className="text-xs">
              <p className="text-muted">Logged in as</p>
              <p className="font-bold text-accent truncate">{user?.name || user?.email}</p>
              <p className="text-muted uppercase text-xs">{user?.role}</p>
            </div>
          )}
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm border border-destructive text-destructive hover:bg-destructive hover:text-white transition-all"
          >
            <LogOut size={16} />
            {sidebarOpen && "Logout"}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full p-3 border-t border-accent hover:bg-accent hover:text-white transition-all"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-accent px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-accent">
            {visibleNavItems.find((item) => item.id === currentPage)?.label || "Dashboard"}
          </h2>
          <div className="text-sm text-muted">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
