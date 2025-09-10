import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Settings,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Upload,
  TrendingUp,
  UserPlus,
  GraduationCap,
} from "lucide-react";

const UniversityDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const UNIVERSITY_API =
    import.meta.env.VITE_UNIVERSITY_API || "http://localhost:8080/";

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const mockStudents = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@mit.edu",
      year: "Senior",
      major: "Computer Science",
      projects: 5,
    },
    {
      id: 2,
      name: "Alex Kumar",
      email: "alex.kumar@mit.edu",
      year: "Junior",
      major: "Data Science",
      projects: 3,
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      email: "maria.r@mit.edu",
      year: "Sophomore",
      major: "AI/ML",
      projects: 2,
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.w@mit.edu",
      year: "Senior",
      major: "Software Engineering",
      projects: 7,
    },
  ];

  const mockProjects = [
    {
      id: 1,
      title: "AI-Powered Study Assistant",
      team: ["Sarah Chen", "Alex Kumar"],
      subject: "Computer Science",
      year: "2024",
      status: "Active",
    },
    {
      id: 2,
      title: "Blockchain Voting System",
      team: ["Maria Rodriguez"],
      subject: "Cryptography",
      year: "2024",
      status: "Active",
    },
    {
      id: 3,
      title: "IoT Smart Campus",
      team: ["James Wilson", "Sarah Chen"],
      subject: "IoT",
      year: "2023",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen p-4">
          <div className="mb-8">
            <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MIT Dashboard
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              University Administration
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
            <UniversityDashboard UNIVERSITY_API={UNIVERSITY_API} />
          )}

          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Student Management
                  </h1>
                  <p className="text-muted-foreground">
                    Manage students in your university
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-10" />
                </div>
                <Button variant="outline">Filter by Year</Button>
                <Button variant="outline">Filter by Major</Button>
              </div>

              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Major</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>{student.major}</TableCell>
                        <TableCell>{student.projects}</TableCell>
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

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Project Management
                  </h1>
                  <p className="text-muted-foreground">
                    Manage projects from your university
                  </p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockProjects.map((project) => (
                  <Card key={project.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{project.title}</h3>
                        <Badge
                          variant={
                            project.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Team:</span>{" "}
                          {project.team.join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Subject:</span>{" "}
                          {project.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Year:</span>{" "}
                          {project.year}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">University Settings</h1>
                <p className="text-muted-foreground">
                  Configure your university profile and preferences
                </p>
              </div>

              <div className="grid gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    University Profile
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        University Name
                      </label>
                      <Input defaultValue="Massachusetts Institute of Technology" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Domain</label>
                      <Input defaultValue="mit.edu" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Contact Email
                      </label>
                      <Input defaultValue="admin@mit.edu" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Security Settings
                  </h3>
                  <div className="space-y-4">
                    <Button variant="outline">Change Admin Password</Button>
                    <Button variant="outline">Manage Access Permissions</Button>
                    <Button variant="outline">View Security Logs</Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;
