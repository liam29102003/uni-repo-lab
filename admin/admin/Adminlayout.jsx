import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import AdminDashboard from "./AdminDashboard";

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
  Plus,
} from "lucide-react";

const Adminlayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "universities", label: "Universities", icon: Building },
    { id: "students", label: "Students", icon: Users },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "requests", label: "Requests", icon: ClipboardList },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    if (activeTab === "requests") {
      fetch("http://127.0.0.1:8000/universities/requests")
        .then((res) => res.json())
        .then((data) => {
          console.log("Requests from backend:", data); // <-- check this
          setRequests(data);
        })
        .catch((err) => console.error(err));
    }
  }, [activeTab]);

  const handleApprove = async (id) => {
    // Remove from requests immediately
    setRequests((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/universities/${id}/approve`,
        {
          method: "POST",
        },
      );
      const data = await res.json();

      if (!res.ok) {
        alert("Failed to approve: " + data.detail);
        return;
      }

      // Add to universities
      setUniversities((prev) => [...prev, data.university]);
    } catch (err) {
      console.error(err);
      alert("Error approving university");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this university?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/universities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        alert("Failed to delete: " + data.detail);
        return;
      }

      // Remove from UI
      setUniversities((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting university");
    }
  };
  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject this request?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/universities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        alert("Failed to reject: " + data.detail);
        return;
      }

      // Remove from requests list
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error rejecting request");
    }
  };
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedUniversityId, setExpandedUniversityId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8090/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete project");
      }

      // Remove deleted project from state
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  const [universities, setUniversities] = useState([]);
  useEffect(() => {
    if (activeTab === "universities") {
      fetch("http://127.0.0.1:8000/universities/")
        .then((res) => res.json())
        .then((data) =>
          setUniversities(data.filter((u) => u.status === "approved")),
        );
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "projects") {
      fetch("http://127.0.0.1:8090/projects/")
        .then((res) => res.json())
        .then((json) => {
          // Map over json.data, fallback to empty array
          setProjects(json.data || []);
        })
        .catch((err) => {
          console.error("Error fetching projects:", err);
          setProjects([]);
        });
    }
  }, [activeTab]);

  //   const mockStats = {
  //     totalUniversities: 156,
  //     totalStudents: 12847,
  //     totalProjects: 3421,
  //     pendingRequests: 23
  //   };

  const mockUniversities = [
    { id: 1, name: "MIT", students: 2341, projects: 892, status: "Active" },
    {
      id: 2,
      name: "Stanford University",
      students: 1876,
      projects: 743,
      status: "Active",
    },
    {
      id: 3,
      name: "UC Berkeley",
      students: 2103,
      projects: 654,
      status: "Active",
    },
    {
      id: 4,
      name: "Harvard University",
      students: 1654,
      projects: 432,
      status: "Pending",
    },
  ];

  //   const mockStudents = [
  //     { id: 1, name: "Sarah Chen", university: "MIT", email: "sarah.chen@mit.edu", projects: 5 },
  //     { id: 2, name: "Alex Kumar", university: "Stanford", email: "alex.kumar@stanford.edu", projects: 3 },
  //     { id: 3, name: "Maria Rodriguez", university: "UC Berkeley", email: "maria.r@berkeley.edu", projects: 7 },
  //   ];

  const mockRequests = [
    {
      id: 1,
      university: "Yale University",
      type: "New Registration",
      date: "2024-01-15",
      contact: "admin@yale.edu",
    },
    {
      id: 2,
      university: "Princeton",
      type: "Access Request",
      date: "2024-01-14",
      contact: "it@princeton.edu",
    },
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
          {activeTab === "dashboard" && <AdminDashboard />}

          {activeTab === "universities" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Universities</h1>
                  <p className="text-muted-foreground">
                    Manage registered universities
                  </p>
                </div>
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
                    {universities.map((uni) => (
                      <React.Fragment key={uni.id}>
                        <TableRow>
                          <TableCell className="font-medium">
                            {uni.university_name}
                          </TableCell>
                          <TableCell>
                            {uni.student_count?.toLocaleString() || 0}
                          </TableCell>
                          <TableCell>{uni.projects || 0}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                uni.status === "approved"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {uni.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setExpandedUniversityId(
                                    expandedUniversityId === uni.id
                                      ? null
                                      : uni.id,
                                  )
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(uni.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedUniversityId === uni.id && (
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={5}>
                              <Card className="p-6 shadow-md rounded-2xl">
                                <h3 className="text-lg font-semibold mb-4">
                                  {uni.university_name} – Details
                                </h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <strong>Email:</strong> {uni.official_email}
                                  </div>
                                  <div>
                                    <strong>Website:</strong> {uni.website}
                                  </div>
                                  <div>
                                    <strong>Country:</strong> {uni.country}
                                  </div>
                                  <div>
                                    <strong>City:</strong> {uni.city}
                                  </div>
                                  <div>
                                    <strong>Contact Person:</strong>{" "}
                                    {uni.contact_person_name}
                                  </div>
                                  <div>
                                    <strong>Title:</strong>{" "}
                                    {uni.contact_person_title}
                                  </div>
                                  <div>
                                    <strong>Phone:</strong>{" "}
                                    {uni.contact_person_phone || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Type:</strong> {uni.type}
                                  </div>
                                  <div>
                                    <strong>Accreditation:</strong>{" "}
                                    {uni.accreditation || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Established:</strong>{" "}
                                    {uni.established || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Created At:</strong>{" "}
                                    {uni.created_at
                                      ? new Date(
                                          uni.created_at,
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </div>
                                </div>

                                {uni.description && (
                                  <div className="mt-4">
                                    <strong>Description:</strong>
                                    <p className="mt-1 text-muted-foreground">
                                      {uni.description}
                                    </p>
                                  </div>
                                )}
                              </Card>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
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
                  <p className="text-muted-foreground">
                    Manage student accounts across universities
                  </p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-10 w-64"
                  />
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
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.university}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.projects}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Suspend
                            </Button>
                            <Button variant="outline" size="sm">
                              Delete
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
                  <h1 className="text-2xl font-bold mb-2">Projects</h1>
                  <p className="text-muted-foreground">
                    Manage projects from universities
                  </p>
                </div>
                <Button>+ New Project</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{project.title}</h3>
                        <Badge
                          variant={
                            project.visibility === "Public"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {project.visibility}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>University:</strong> {project.university}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Subject:</strong> {project.subject}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Team:</strong>{" "}
                        {project.team.map((m) => m.name).join(", ")}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            setExpandedProjectId(
                              expandedProjectId === project.id
                                ? null
                                : project.id,
                            )
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                      {expandedProjectId === project.id && (
                        <div className="mt-4 space-y-2 text-sm">
                          <p>
                            <strong>University:</strong> {project.university}
                          </p>
                          <p>
                            <strong>Subject:</strong> {project.subject}
                          </p>
                          <p>
                            <strong>Team:</strong>{" "}
                            {project.team.map((t) => t.name).join(", ")}
                          </p>
                          <p>
                            <strong>Visibility:</strong> {project.visibility}
                          </p>
                          <p>
                            <strong>Tags:</strong>{" "}
                            {project.tags?.join(", ") || "None"}
                          </p>
                          <p>
                            <strong>Stars:</strong> {project.stars} ⭐ |{" "}
                            <strong>Views:</strong> {project.views}
                          </p>
                          <div>
                            <strong>Links:</strong>
                            <ul className="list-disc list-inside">
                              {project.links.map((link, idx) => (
                                <li key={idx}>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                  >
                                    {link.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Created At:{" "}
                            {new Date(project.createdAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Pending Requests</h1>
                <p className="text-muted-foreground">
                  Review and approve university registration requests
                </p>
              </div>

              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {request.university_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {request.type || "New Registration"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Contact: {request.official_email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date:{" "}
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="w-4 h-4 mr-2" /> Reject
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
                <h1 className="text-2xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">
                  Configure platform settings and preferences
                </p>
              </div>

              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Globe className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">
                        General Settings
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          Platform Name
                        </label>
                        <Input
                          defaultValue="Academic Collaboration Platform"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Default Language
                        </label>
                        <Input defaultValue="English" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time Zone</label>
                        <Input defaultValue="UTC" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Support Email
                        </label>
                        <Input
                          defaultValue="support@platform.edu"
                          className="mt-1"
                        />
                      </div>
                      <Button className="mt-4">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Shield className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">
                        Security Settings
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          Password Requirements
                        </label>
                        <Input
                          defaultValue="Minimum 8 characters, 1 uppercase, 1 number"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Session Timeout (minutes)
                        </label>
                        <Input
                          defaultValue="60"
                          type="number"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Max Login Attempts
                        </label>
                        <Input
                          defaultValue="5"
                          type="number"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="two-factor" defaultChecked />
                        <label
                          htmlFor="two-factor"
                          className="text-sm font-medium"
                        >
                          Require Two-Factor Authentication
                        </label>
                      </div>
                      <Button className="mt-4">
                        <Save className="w-4 h-4 mr-2" />
                        Save Security Settings
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Mail className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">
                        Notification Settings
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          SMTP Server
                        </label>
                        <Input
                          defaultValue="smtp.platform.edu"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">SMTP Port</label>
                        <Input
                          defaultValue="587"
                          type="number"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          From Email
                        </label>
                        <Input
                          defaultValue="noreply@platform.edu"
                          className="mt-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="registration-emails"
                            defaultChecked
                          />
                          <label
                            htmlFor="registration-emails"
                            className="text-sm"
                          >
                            Send registration confirmation emails
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="project-notifications"
                            defaultChecked
                          />
                          <label
                            htmlFor="project-notifications"
                            className="text-sm"
                          >
                            Send project update notifications
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="admin-alerts"
                            defaultChecked
                          />
                          <label htmlFor="admin-alerts" className="text-sm">
                            Send admin alerts
                          </label>
                        </div>
                      </div>
                      <Button className="mt-4">
                        <Save className="w-4 h-4 mr-2" />
                        Save Notification Settings
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="api">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Key className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">API Settings</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          API Rate Limit (requests/hour)
                        </label>
                        <Input
                          defaultValue="1000"
                          type="number"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          API Version
                        </label>
                        <Input defaultValue="v1" className="mt-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="api-logging"
                          defaultChecked
                        />
                        <label
                          htmlFor="api-logging"
                          className="text-sm font-medium"
                        >
                          Enable API Request Logging
                        </label>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">API Keys</h4>
                        <div className="bg-accent/20 p-3 rounded border">
                          <code className="text-sm">prod_key_12345...</code>
                          <Button variant="outline" size="sm" className="ml-2">
                            Revoke
                          </Button>
                        </div>
                        <Button variant="outline" size="sm">
                          Generate New API Key
                        </Button>
                      </div>
                      <Button className="mt-4">
                        <Save className="w-4 h-4 mr-2" />
                        Save API Settings
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminlayout;
