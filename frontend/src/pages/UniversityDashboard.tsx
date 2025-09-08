import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import UniHeader from "@/components/Layout/Header";
import api from "@/utils/api"; // Axios instance with token interceptor
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  GraduationCap
} from "lucide-react";

const UniversityDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    student_id: "",
    username: "",
    email: "",
    year: "",
    semester: "",
    major: "",
    password: "unistudent",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [defaultCsvPassword, setDefaultCsvPassword] = useState("unistudent");
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMajor, setFilterMajor] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resetTargetStudent, setResetTargetStudent] = useState<any>(null);


  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      s.username?.toLowerCase().includes(term) ||
      s.student_id?.toLowerCase().includes(term);

    const matchesMajor = filterMajor ? s.major === filterMajor : true;
    const matchesYear = filterYear ? String(s.year) === filterYear : true;

    return matchesSearch && matchesMajor && matchesYear;
});


  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const mockStats = {
    totalStudents: students.length,
    totalProjects: 892,
    activeProjects: 234,
    completedProjects: 658,
  };

  const mockProjects = [
    { id: 1, title: "AI-Powered Study Assistant", team: ["Sarah Chen", "Alex Kumar"], subject: "Computer Science", year: "2024", status: "Active" },
    { id: 2, title: "Blockchain Voting System", team: ["Maria Rodriguez"], subject: "Cryptography", year: "2024", status: "Active" },
    { id: 3, title: "IoT Smart Campus", team: ["James Wilson", "Sarah Chen"], subject: "IoT", year: "2023", status: "Completed" },
  ];


  // Fetch students from backend
      const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        console.log("Using token:", token);

        const res = await api.get("/users/students");
        console.log("Fetch students response:", res.data);  // <--- add this
        // Some backends return `_id` instead of `id`, normalize it
        const normalized = res.data.map((s: any) => (
          { ...s,
             id: s.user_id, // use UUID for internal operations
          }));
        setStudents(normalized);
      } catch (err: any) {
        console.error("Fetch students failed:", err.response?.data || err.message);
        alert(err.response?.data?.detail || "Failed to fetch students. Check your permissions.");
      }
    };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        year: Number(formData.year) || 0,
        semester: Number(formData.semester) || 0,
        role: "student",
      };
      const res = await api.post("/users/create-student", payload);
      const student = { ...res.data, id: res.data.user_id };
      setStudents((prev) => [...prev, student]);
      alert(`Student ${student.username} added successfully!`);
      setFormData({ student_id: "", username: "", email: "", year: "", semester: "", major: "", password: "unistudent" });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to add student");
    }
  };

const handleCsvUpload = async () => {
  if (!csvFile) return alert("Please select a CSV file.");
  const formDataCsv = new FormData();
  formDataCsv.append("file", csvFile);
  formDataCsv.append("default_password", defaultCsvPassword || "unistudent");

  try {
    const res = await api.post("/users/upload-csv", formDataCsv, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Normalize response so every student has `id` = UUID
    const added = res.data.added.map((s: any) => ({
      ...s,
      id: s.id || s.user_id, // unify to "id"
    }));

    setStudents((prev) => [...prev, ...added]);
    setCsvFile(null);
    alert(`Upload complete! Added: ${added.length} users`);
  } catch (err: any) {
    console.error("CSV upload failed:", err.response?.data || err.message);
    alert(err.response?.data?.detail || "Failed to upload CSV");
  }
};

const openResetModal = (student: any) => {
  setResetTargetStudent(student);
  setResetPasswordValue(""); // clear old value
  setResetModalOpen(true);
};

const handleResetPassword = async (userId: string) => {
  const newPassword = prompt("Enter a new password for this student:");
  if (!newPassword) return; // cancelled

  try {
    const formData = new FormData();
    formData.append("new_password", newPassword);

    const res = await api.post(`/users/admin/reset-password/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert(res.data.detail || "Password reset successfully!");
  } catch (err: any) {
    console.error("Reset password failed:", err.response?.data || err.message);
    alert(err.response?.data?.detail || "Failed to reset password");
  }
};


const openEditModal = (student: any) => {
  setSelectedStudent(student); // student already has `id`
  setEditFormData({
    student_id: student.student_id || "",
    username: student.username,
    email: student.email,
    year: student.year || "",
    semester: student.semester || "",
    major: student.major || "",
  });
  setEditModalOpen(true);
};

 
  const handleEditStudent = async (userId: string, data: any) => {
  try {
    // Remove empty or null fields
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "" && v !== null)
    );

    // Log token to confirm
    const token = localStorage.getItem("access_token");
    console.log("Using token for edit:", token);

    // Axios PUT request with token header
    const res = await api.put(`/users/admin/edit/${userId}`, cleanedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Normalize response id
    const updated = { ...res.data, id: res.data.user_id };

    // Update students state
    setStudents(prev => prev.map(s => (s.id === updated.id ? updated : s)));

    alert("Student updated successfully!");
  } catch (err: any) {
    console.error("Edit student error:", err.response?.data || err.message);
    alert(err.response?.data?.detail || "Failed to update student");
  }
};


  const handleDeleteStudent = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/users/admin/delete/${userId}`);
      setStudents((prev) => prev.filter((s) => s.id !== userId));
      alert("Student deleted successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to delete student");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen p-4">
          <div className="mb-8">
            <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MIT Dashboard
            </h2>
            <p className="text-sm text-muted-foreground mt-1">University Administration</p>
          </div>
          <nav className="space-y-2">
            {sidebarItems.map(item => {
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
            <Button
              variant="ghost"
              className="w-full justify-start mt-8 text-red-600 hover:bg-red-100"
              onClick={() => {
                localStorage.removeItem("access_token");
                window.location.href = '/login';
              }}
            >
              <FolderOpen className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold mb-2">University Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">{mockStats.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </Card>
                <Card className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{mockStats.totalProjects}</p>
                  </div>
                  <FolderOpen className="w-8 h-8 text-primary" />
                </Card>
                <Card className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold">{mockStats.activeProjects}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </Card>
                <Card className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{mockStats.completedProjects}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-primary" />
                </Card>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="space-y-6">
              {/* Add Student & CSV Upload */}
              <Card className="p-6">
                <h2 
                  className="text-xl font-bold mb-2 cursor-pointer select-none " 
                  onClick={() => setOpen(prev => !prev)}
                >
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Student {open ? "👆" : "👇"}
                  </Button>
                </h2>

                {open && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Single student form */}
                    <div className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm h-full">
                      <h3 className="text-lg font-semibold mb-3">Add Single Student</h3>
                      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                        <Input placeholder="Student ID" name="student_id" value={formData.student_id} onChange={handleChange} className="mb-3" required />

                        <Input placeholder="Student Name" name="username" value={formData.username} onChange={handleChange} className="mb-3" required />
                        <Input placeholder="Student Email" type="email" name="email" value={formData.email} onChange={handleChange} className="mb-3" required />
                        <Input placeholder="Year" name="year" value={formData.year} onChange={handleChange} className="mb-3" required />
                        <Input placeholder="Semester" name="semester" value={formData.semester} onChange={handleChange} className="mb-3" required />
                        <Input placeholder="Major" name="major" value={formData.major} onChange={handleChange} className="mb-3" required />
                        <Input placeholder="Password" name="password" value={formData.password} onChange={handleChange} className="mb-3" />
                        <div className="mt-auto flex gap-3">
                          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Add Student</Button>
                        </div>
                      </form>
                    </div>

                    {/* CSV Upload */}
                    <div className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm h-full">
                      <h3 className="text-lg font-semibold mb-3">Upload CSV</h3>
                      <div className="flex flex-col flex-1">
                        <input 
                          type="file" 
                          accept=".csv" 
                          onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                          className="mb-3 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <Input 
                          value={defaultCsvPassword} 
                          onChange={(e) => setDefaultCsvPassword(e.target.value)} 
                          placeholder="Default CSV Password"
                          className="mb-3"
                        />
                        <div className="mt-auto flex gap-3">
                          <Button onClick={handleCsvUpload} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Upload CSV</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
              {/* <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                </div>
                <Button variant="outline">Filter by Year</Button>
                <Button variant="outline">Filter by Major</Button>
              </div> */}
              {/* search bar and filter buttons */}
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Year filter */}
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="">All Years</option>
                  {[...new Set(students.map((s) => s.year))].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {/* Major filter */}
                <select
                  value={filterMajor}
                  onChange={(e) => setFilterMajor(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="">All Majors</option>
                  {[...new Set(students.map((s) => s.major))].map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>

              {/* Students Table */}
              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Major</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s: any) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.student_id}</TableCell>
                        <TableCell>{s.username}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{s.year}</TableCell>
                        <TableCell>{s.semester}</TableCell>
                        <TableCell>{s.major}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditModal(s)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteStudent(s.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleResetPassword(s.id)}>
                              Reset password
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
                  <h1 className="text-2xl font-bold mb-2">Project Management</h1>
                  <p className="text-muted-foreground">Manage projects from your university</p>
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
                        <Badge variant={project.status === "Active" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Team:</span> {project.team.join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Subject:</span> {project.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Year:</span> {project.year}
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
                <p className="text-muted-foreground">Configure your university profile and preferences</p>
              </div>
              
              <div className="grid gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">University Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">University Name</label>
                      <Input defaultValue="Massachusetts Institute of Technology" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Domain</label>
                      <Input defaultValue="mit.edu" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Email</label>
                      <Input defaultValue="admin@mit.edu" />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
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

      {/* Edit Modal */}
      {editModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            
            <div className="flex flex-col space-y-3">
              <Input
                name="student_id"
                value={editFormData.student_id}
                onChange={handleEditChange}
                placeholder="Student ID"
              />
              <Input
                name="username"
                value={editFormData.username}
                onChange={handleEditChange}
                placeholder="Username"
              />
              <Input
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleEditChange}
                placeholder="Email"
              />
              <Input
                name="year"
                type="number"
                value={editFormData.year}
                onChange={handleEditChange}
                placeholder="Year"
              />
              <Input
                name="semester"
                type="number"
                value={editFormData.semester}
                onChange={handleEditChange}
                placeholder="Semester"
              />
              <Input
                name="major"
                value={editFormData.major}
                onChange={handleEditChange}
                placeholder="Major"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
               onClick={async () => {
                  if (!selectedStudent?.id) return alert("Student ID missing!"); // now id is UUID
                  if (!editFormData.student_id) return alert("Student ID (student_id) missing!");

                  await handleEditStudent(selectedStudent.id, editFormData);
                  setEditModalOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default UniversityDashboard;
