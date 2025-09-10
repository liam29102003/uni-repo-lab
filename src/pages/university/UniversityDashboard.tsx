import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, FolderOpen, TrendingUp, GraduationCap } from "lucide-react";

interface Stats {
  totalStudents: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

interface API {
  UNIVERSITY_API: string; // <-- expect this as a prop
}
const UniversityDashboard = ({ UNIVERSITY_API }: API) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        let url = `${UNIVERSITY_API}api/university/stats`;
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
  }, [UNIVERSITY_API]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!stats) {
    // return
    <p>Failed to load stats.</p>;
  }
  console.log(stats);
  // Mock data for demonstration
  const mockStats = {
    totalStudents: 2341,
    totalProjects: 892,
    activeProjects: 234,
    completedProjects: 658,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">University Overview</h1>
        <p className="text-muted-foreground">
          Monitor your university's activity and statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Students
              </p>
              <p className="text-2xl font-bold">
                {mockStats.totalStudents.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Projects
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
                Active Projects
              </p>
              <p className="text-2xl font-bold">{mockStats.activeProjects}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-2xl font-bold">
                {mockStats.completedProjects}
              </p>
            </div>
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Activity</h3>
        <div className="h-64 bg-accent/20 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-16 h-16 text-muted-foreground" />
        </div>
      </Card>
    </div>
  );
};

export default UniversityDashboard;
