import { Card } from "@/components/ui/card";
import {
  Users,
  FolderOpen,
  ClipboardList,
  TrendingUp,
  Building,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Stats {
  totalUniversities: number;
  totalStudents: number;
  totalProjects: number;
  pendingRequests: number;
}

interface API {
  ADMIN_API: string; // <-- expect this as a prop
}

const AdminDashboard = ({ ADMIN_API }: API) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        let url = `${ADMIN_API}api/admin/stats`;
        console.log("Fetching stats from:", url);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [ADMIN_API]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!stats) {
    // return
    <p>Failed to load stats.</p>;
  }
  console.log(stats);
  const mockStats = {
    totalUniversities: 156,
    totalStudents: 12847,
    totalProjects: 3421,
    pendingRequests: 23,
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor platform statistics and activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Universities
              </p>
              <p className="text-2xl font-bold">
                {mockStats.totalUniversities}
              </p>
            </div>
            <Building className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Students
              </p>
              <p className="text-2xl font-bold">{mockStats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Projects
              </p>
              <p className="text-2xl font-bold">{mockStats.totalProjects}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </p>
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
  );
};

export default AdminDashboard;
