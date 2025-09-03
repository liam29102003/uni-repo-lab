import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Settings,
  Search,
  UserPlus,
  GraduationCap,
  Edit,
  Trash2,
  Eye,
  TrendingUp
} from "lucide-react";

const UniversityDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Student management states
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState({ username: "", email: "", password: "unistudent" });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [defaultCsvPassword, setDefaultCsvPassword] = useState("unistudent");
  const [open, setOpen] = useState(false); // Add student form toggle

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});

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
    completedProjects: 658
  };

  // Fetch students from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/v1/users");
        setStudents(res.data.filter((s: any) => s.role === "student"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Add single student
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/users/create",
        { ...formData, role: "student" },
        { headers: { "Content-Type": "application/json" } }
      );
      setStudents(prev => [...prev, res.data]);
      setFormData({ username: "", email: "", password: "unistudent" });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to add student");
    }
  };

  // CSV upload
  const handleCsvUpload = async () => {
    if (!csvFile) return alert("Please select a CSV file.");
    const formDataCsv = new FormData();
    formDataCsv.append("file", csvFile);
    formDataCsv.append("default_password", defaultCsvPassword || "unistudent");
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/users/upload-csv",
        formDataCsv,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const { added } = res.data;
      setStudents(prev => [...prev, ...added]);
      setCsvFile(null);
      alert(`Upload complete! Added: ${added.length} users`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to upload CSV");
    }
  };

  // Open edit modal
  const openEditModal = (student: any) => {
    setSelectedStudent(student);
    setEditFormData({
      username: student.username,
      email: student.email,
      year: student.year || "",
      semester: student.semester || "",
      major: student.major || "",
    });
    setEditModalOpen(true);
  };

  // Save edited student
  const handleEditStudent = async (userId: string, data: any) => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/v1/users/admin/edit/${userId}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      setStudents(prev =>
        prev.map(s => (s.user_id === userId ? res.data : s))
      );
      alert("Student updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update student");
    }
  };

  // Delete student
  const handleDeleteStudent = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/users/admin/delete/${userId}`);
      setStudents(prev => prev.filter(s => s.user_id !== userId));
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
                        <Input placeholder="Student Name" name="username" value={formData.username} onChange={handleChange} className="mb-3" required />
                        <Input placeholder="Student Email" type="email" name="email" value={formData.email} onChange={handleChange} className="mb-3" required />
                        <Input placeholder="Student Password" name="password" value={formData.password} onChange={handleChange} className="mb-3" />
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

              {/* Students Table */}
              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Major</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s: any) => (
                      <TableRow key={s.user_id}>
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
                            <Button variant="outline" size="sm" onClick={() => handleDeleteStudent(s.user_id)}>
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
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            
            <div className="flex flex-col space-y-3">
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
                  await handleEditStudent(selectedStudent.user_id, editFormData);
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
