import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import AdminDashboard from "./AdminDashboard";
import UniOnAdmin from "./UniOnAdmin";
import StuOnAdmin from "./StuOnAdmin";
import ReqView from "./ReqView";
import AdminSetting from "./AdminSetting";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FolderOpen,
  ClipboardList,
  Settings,
  Search,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  TrendingUp,
  UserPlus,
  Building,
  Save,
  Mail,
  Shield,
  Key,
  Globe,
} from "lucide-react";

const Adminlayout = () => {
  const Admin_API = import.meta.env.VITE_ADMIN_API || "http://localhost:8080/";

  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "universities", label: "Universities", icon: Building },
    { id: "students", label: "Students", icon: Users },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "requests", label: "Requests", icon: ClipboardList },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen p-4">
          <div className="mb-8">
            <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Global Administration
            </p>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <AdminDashboard ADMIN_API={Admin_API} />
          )}

          {activeTab === "universities" && <UniOnAdmin ADMIN_API={Admin_API} />}

          {activeTab === "students" && <StuOnAdmin ADMIN_API={Admin_API} />}

          {activeTab === "projects" && <AdminDashboard ADMIN_API={Admin_API} />}

          {activeTab === "requests" && <ReqView ADMIN_API={Admin_API} />}

          {activeTab === "settings" && <AdminSetting ADMIN_API={Admin_API} />}
        </div>
      </div>
    </div>
  );
};

export default Adminlayout;
