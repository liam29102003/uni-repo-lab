import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
import {
  Building,
  Users,
  FolderOpen,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    universities: 0,
    students: 0,
    pending_requests: 0,
  });
  const [totalProjects, setTotalProjects] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch other dashboard stats
        const dashboardRes = await fetch(
          "http://127.0.0.1:8000/dashboard/stats",
        );
        const dashboardData = await dashboardRes.json();
        setStats({
          universities: dashboardData.universities,
          students: dashboardData.students,
          pending_requests: dashboardData.pending_requests,
        });

        // Fetch total projects from /projects
        const projectsRes = await fetch("http://127.0.0.1:8090/projects/");
        const projectsData = await projectsRes.json();
        const total = projectsData?.pagination?.total || 0;
        setTotalProjects(total);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard stats...</p>;

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
              <p className="text-2xl font-bold">{stats.universities}</p>
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
              <p className="text-2xl font-bold">{stats.students}</p>
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
              <p className="text-2xl font-bold">{totalProjects}</p>
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
              <p className="text-2xl font-bold">{stats.pending_requests}</p>
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
