import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, BookOpen, Users, Calendar } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  university: string;
  team: string[];
  tags: string[];
  visibility: string;
  views: number;
  stars: number;
  createdAt: string;
}

const FeaturedProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams({
        limit: "3", // optional
      });

      const response = await fetch(`http://localhost:8090/projects/?${params.toString()}`);
      const data = await response.json();
      console.log("API response:", data);

      // Adjust this according to actual structure
      const projectsArray = Array.isArray(data) ? data : data.projects;

      setProjects(projectsArray.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  fetchProjects();
}, []);


  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "Public":
        return "bg-green-100 text-green-700";
      case "University Only":
        return "bg-blue-100 text-blue-700";
      case "Team Only":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="p-4">
          <div className="flex justify-between items-center mb-2">
            <Badge className={getVisibilityColor(project.visibility)}>{project.visibility}</Badge>
            <div className="flex gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {project.views}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" /> {project.stars}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> {project.university}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {project.team.join(", ")}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {new Date(project.createdAt).toLocaleDateString()}
            </div>
            <div className="flex gap-1 flex-wrap">
              {project.tags.map((tag) => (
                <Badge key={tag} className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedProjects;
