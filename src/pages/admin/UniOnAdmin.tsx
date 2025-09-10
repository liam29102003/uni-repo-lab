import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2, UserPlus, University } from "lucide-react";

interface University {
  id: number;
  name: string;
  students: number;
  projects: number;
  status: "Active" | "Pending" | "Inactive";
}

interface API {
  ADMIN_API: string; // <-- expect this as a prop
}

const UniOnAdmin = ({ ADMIN_API }: API) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUniStats() {
      try {
        let url = `${ADMIN_API}api/admin/universities`;
        console.log("Fetching stats from:", url);
        // Universities
        const uniRes = await fetch(url);
        if (!uniRes.ok) {
          throw new Error("Failed to fetch stats");
        }
        const uniData: University[] = await uniRes.json();
        setUniversities(uniData);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUniStats();
  }, [ADMIN_API]);

  if (loading) {
    return <p>Loading Universities...</p>;
  }

  if (!universities) {
    // return
    <p>Failed to load stats.</p>;
  }
  console.log(universities);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Universities</h1>
          <p className="text-muted-foreground">
            Manage registered universities
          </p>
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
                  <Badge
                    variant={uni.status === "Active" ? "default" : "secondary"}
                  >
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
  );
};

export default UniOnAdmin;
