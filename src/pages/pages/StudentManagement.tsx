import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserPlus, 
  Upload, 
  Search, 
  Edit, 
  Trash2, 
  RotateCcw,
  Download,
  Filter
} from "lucide-react";

const StudentManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const mockStudents = [
    { id: 1, name: "Sarah Chen", email: "sarah.chen@mit.edu", semester: "Fall 2024", note: "Excellent performance", status: "Active" },
    { id: 2, name: "Alex Kumar", email: "alex.kumar@mit.edu", semester: "Fall 2024", note: "Great team player", status: "Active" },
    { id: 3, name: "Maria Rodriguez", email: "maria.r@mit.edu", semester: "Spring 2024", note: "Outstanding projects", status: "Active" },
    { id: 4, name: "James Wilson", email: "james.w@mit.edu", semester: "Fall 2024", note: "Leadership potential", status: "Inactive" },
    { id: 5, name: "Emily Zhang", email: "emily.z@mit.edu", semester: "Spring 2024", note: "Creative problem solver", status: "Active" },
  ];

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = selectedSemester === "all" || student.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Student Management
          </h1>
          <p className="text-muted-foreground">
            Manage student accounts and registrations for your university
          </p>
        </div>

        <Tabs defaultValue="add-student" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="add-student" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Students
            </TabsTrigger>
            <TabsTrigger value="registered-students" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Registered Students
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add-student">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual Add Student */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <UserPlus className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Add Student Manually</h2>
                </div>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="student@university.edu" />
                  </div>
                  
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input id="studentId" placeholder="Enter student ID" />
                  </div>
                  
                  <div>
                    <Label htmlFor="defaultPassword">Default Password</Label>
                    <Input id="defaultPassword" type="password" placeholder="Set default password" />
                  </div>
                  
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fall2024">Fall 2024</SelectItem>
                        <SelectItem value="spring2024">Spring 2024</SelectItem>
                        <SelectItem value="summer2024">Summer 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="major">Major</Label>
                    <Input id="major" placeholder="Computer Science" />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </form>
              </Card>

              {/* CSV Upload */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Upload className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Bulk Upload via CSV</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Columns: Name, Email, Student ID, Semester, Major</li>
                      <li>• Use comma-separated values</li>
                      <li>• Include header row</li>
                      <li>• Maximum 1000 students per upload</li>
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV Template
                  </Button>
                  
                  <Button className="w-full" disabled>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Students
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="registered-students">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                    <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.semester}</TableCell>
                        <TableCell className="max-w-xs truncate">{student.note}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            student.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No students found matching your criteria.</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentManagement;