import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Building
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "universities", label: "Universities", icon: Building },
    { id: "students", label: "Students", icon: Users },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "requests", label: "Requests", icon: ClipboardList },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const mockStats = {
    totalUniversities: 156,
    totalStudents: 12847,
    totalProjects: 3421,
    pendingRequests: 23
  };

  const mockUniversities = [
    { id: 1, name: "MIT", students: 2341, projects: 892, status: "Active" },
    { id: 2, name: "Stanford University", students: 1876, projects: 743, status: "Active" },
    { id: 3, name: "UC Berkeley", students: 2103, projects: 654, status: "Active" },
    { id: 4, name: "Harvard University", students: 1654, projects: 432, status: "Pending" },
  ];

  const mockStudents = [
    { id: 1, name: "Sarah Chen", university: "MIT", email: "sarah.chen@mit.edu", projects: 5 },
    { id: 2, name: "Alex Kumar", university: "Stanford", email: "alex.kumar@stanford.edu", projects: 3 },
    { id: 3, name: "Maria Rodriguez", university: "UC Berkeley", email: "maria.r@berkeley.edu", projects: 7 },
  ];

  const mockRequests = [
    { id: 1, university: "Yale University", type: "New Registration", date: "2024-01-15", contact: "admin@yale.edu" },
    { id: 2, university: "Princeton", type: "Access Request", date: "2024-01-14", contact: "it@princeton.edu" },
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
            <p className="text-sm text-muted-foreground mt-1">Global Administration</p>
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
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-muted-foreground">Monitor platform statistics and activity</p>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Universities</p>
                      <p className="text-2xl font-bold">{mockStats.totalUniversities}</p>
                    </div>
                    <Building className="w-8 h-8 text-primary" />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Students</p>
                      <p className="text-2xl font-bold">{mockStats.totalStudents}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Projects</p>
                      <p className="text-2xl font-bold">{mockStats.totalProjects}</p>
                    </div>
                    <FolderOpen className="w-8 h-8 text-primary" />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                      <p className="text-2xl font-bold">{mockStats.pendingRequests}</p>
                    </div>
                    <ClipboardList className="w-8 h-8 text-primary" />
                  </div>
                </Card>
              </div>

              {/* Chart Placeholder */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
                <div className="h-64 bg-accent/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-muted-foreground" />
                </div>
              </Card>
            </div>
          )}

          {activeTab === "universities" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Universities</h1>
                  <p className="text-muted-foreground">Manage registered universities</p>
                </div>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add University
                </Button>
              </div>
              
              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUniversities.map((uni) => (
                      <TableRow key={uni.id}>
                        <TableCell className="font-medium">{uni.name}</TableCell>
                        <TableCell>{uni.students.toLocaleString()}</TableCell>
                        <TableCell>{uni.projects.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={uni.status === "Active" ? "default" : "secondary"}>
                            {uni.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Students</h1>
                  <p className="text-muted-foreground">Manage student accounts across universities</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-10 w-64" />
                </div>
              </div>
              
              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.university}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.projects}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Suspend</Button>
                            <Button variant="outline" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Pending Requests</h1>
                <p className="text-muted-foreground">Review and approve university registration requests</p>
              </div>
              
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <Card key={request.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{request.university}</h3>
                        <p className="text-sm text-muted-foreground">{request.type}</p>
                        <p className="text-sm text-muted-foreground">Contact: {request.contact}</p>
                        <p className="text-sm text-muted-foreground">Date: {request.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm">
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;