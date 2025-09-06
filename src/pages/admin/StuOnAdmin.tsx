import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

interface Students {
  id: number;
  name: string;
  university: number;
  email: string;
  projects: number;
}

interface API {
  ADMIN_API: string; // <-- expect this as a prop
}

const StuOnAdmin = ({ ADMIN_API }: API) => {
  const [students, setStudents] = useState<Students[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStuStats() {
      try {
        let url = `${ADMIN_API}api/admin/students`;
        console.log("Fetching stats from:", url);
        // students
        const stuRes = await fetch(url);
        if (!stuRes.ok) {
          throw new Error("Failed to fetch stats");
        }
        const stuData: Students[] = await stuRes.json();
        setStudents(stuData);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStuStats();
  }, [ADMIN_API]);

  if (loading) {
    return <p>Loading Students...</p>;
  }

  if (!students) {
    // return
    <p>Failed to load stats.</p>;
  }
  console.log(students);

  const mockStudents = [
    {
      id: 1,
      name: "Sarah Chen",
      university: "MIT",
      email: "sarah.chen@mit.edu",
      projects: 5,
    },
    {
      id: 2,
      name: "Alex Kumar",
      university: "Stanford",
      email: "alex.kumar@stanford.edu",
      projects: 3,
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      university: "UC Berkeley",
      email: "maria.r@berkeley.edu",
      projects: 7,
    },
  ];

  return (
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
  );
};

export default StuOnAdmin;
