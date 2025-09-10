import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Eye,
  Star,
  Users,
  Calendar,
  ExternalLink,
  Github,
  BookOpen,
  Upload,
  Grid3X3,
  List,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteProjectDialog } from '@/components/ui/alert-dialog-delete';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const subjects = ['All Subjects', 'Computer Science', 'Environmental Engineering', 'History', 'Biology', 'Physics', 'Mathematics'];
const technologies = ['All Technologies', 'AI', 'Machine Learning', 'React', 'Python', 'Unity', 'Blockchain', 'IoT'];
const universities = ['All Universities', 'MIT', 'Stanford', 'Harvard', 'Caltech', 'Oxford', 'Cambridge'];

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedTechnology, setSelectedTechnology] = useState('All Technologies');
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string>('');

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student' as const
  };

  // Check if user owns the project (simplified logic)
  const isProjectOwner = (project: any): boolean => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored user from localStorage:", storedUser);
    if (!storedUser || !project?.team) return false;

    try {
      const user = JSON.parse(storedUser); // { _id, name, ... }

      // Check if user is in the team as Owner
      const owner = project.team.find(
        (member: any) => member._id === user.user_id && member.role.toLowerCase() === "owner"
      );

      return !!owner;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return false;
    }
  };

  const canViewProject = (project: any): boolean => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return false;

    try {
      const user = JSON.parse(storedUser);

      if (project.visibility === "Public") {
        return true;
      }

      // ✅ allow if private but same university
      if (
        project.visibility === "Private" &&
        user.university?.toLowerCase() === project.university?.toLowerCase()
      ) {
        return true;
      }

      // ✅ allow if owner
      if (isProjectOwner(project)) {
        return true;
      }

      return false;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return false;
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const { toast } = useToast();

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await axios.delete(`http://localhost:8090/projects/${projectToDelete}`);

      // ✅ Update UI by removing the deleted project
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));

      // Close dialog and reset
      setDeleteDialogOpen(false);
      setProjectToDelete('');

      // 🎉 Show success toast
      toast({
        title: "Project Deleted",
        description: "The project was deleted successfully.",
        variant: "default",  // ✅ success → default
      });
    } catch (err) {
      console.error("Failed to delete project", err);

      // ❌ Show error toast
      toast({
        title: "Delete Failed",
        description: "Something went wrong while deleting the project.",
        variant: "destructive", // ✅ error → destructive
      });
    }
  };



  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'Public':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Private':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (selectedSubject && selectedSubject !== "All Subjects") params.append("subject", selectedSubject);
        if (selectedTechnology && selectedTechnology !== "All Technologies") params.append("tags", selectedTechnology);
        if (selectedUniversity && selectedUniversity !== "All Universities") params.append("university", selectedUniversity);
        if (searchQuery) params.append("search", searchQuery); // if backend supports search

        const response = await fetch(`http://localhost:8090/projects/?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch projects');

        const data = await response.json();
        setProjects(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery, selectedSubject, selectedTechnology, selectedUniversity]);


  const [subjects, setSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:8090/subjects");
        setSubjects(res.data.subjects || []);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const [technologies, setTechnologies] = useState<string[]>([]);

  // Fetch all distinct technologies from API
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await axios.get('http://localhost:8090/tags'); // your API endpoint
        // console.log(Array.isArray(res.data.tags));

        if (res.data && Array.isArray(res.data.tags)) {
          console.log('Fetched technologies from API:', res.data.tags);
          setTechnologies(res.data.tags);
        }
        // console.log('Fetched technologies:', technologies);
      } catch (err) {
        console.error('Failed to fetch technologies:', err);
        setTechnologies([]);
      }
    };

    fetchTechnologies();
  }, []);


  // Filter projects
  // const filteredProjects = projects.filter(project => {
  //   if (searchQuery) {
  //     if (
  //       !project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //       !project.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //       !project.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  //     ) return false;
  //   }
  //   if (selectedSubject !== 'All Subjects' && project.subject !== selectedSubject) return false;
  //   if (selectedTechnology !== 'All Technologies' && !project.tags.some((tag: string) => tag.toLowerCase().includes(selectedTechnology.toLowerCase()))) return false;
  //   if (selectedUniversity !== 'All Universities' && project.university !== selectedUniversity) return false;
  //   return true;
  // });

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold heading-academic mb-2">
                Project Repository
              </h1>
              <p className="text-xl text-academic">
                Discover innovative projects from universities worldwide
              </p>
            </div>
            <Button className="mt-4 md:mt-0" asChild>
              <Link to="/upload">
                <Upload className="w-5 h-5 mr-2" />
                Upload Project
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search projects, technologies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg py-6"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* "All Subjects" option */}
                    <SelectItem key="all" value="All Subjects">
                      All Subjects
                    </SelectItem>

                    {/* Dynamic subjects from API */}
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>


                <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Technology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all" value="All Technologies">
                      All Technologies
                    </SelectItem>
                    {technologies.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>


                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select University" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>
                        {uni}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="text-muted-foreground mt-4">
            {/* Showing {filteredProjects?.length} of {projects.length} projects */}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('All Subjects');
                setSelectedTechnology('All Technologies');
                setSelectedUniversity('All Universities');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
            }`}
          >
            {projects.map((project) =>
              canViewProject(project) && (
                <Card key={project.id} className="project-card group hover:scale-102 relative">
                  {/* 👇 highlight if owner */}
                  {isProjectOwner(project) && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary text-white text-xs font-semibold shadow-md"
                      >
                        Owner
                      </Badge>
                    </div>
                  )}

                  {/* 👇 highlight if private + same university */}
                  {!isProjectOwner(project) &&
                    project.visibility === "Private" && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="outline"
                          className="bg-muted text-xs font-medium shadow"
                        >
                          Same University
                        </Badge>
                      </div>
                    )}

                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <Badge
                        variant="outline"
                        className={`${getVisibilityColor(project.visibility)} font-medium`}
                      >
                        {project.visibility}
                      </Badge>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{project.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{project.stars}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p
                      className={`text-academic ${viewMode === "grid" ? "line-clamp-3" : "line-clamp-2"
                        }`}
                    >
                      {project.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {project.university}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {project.team.slice(0, 2).map((member) => member.name).join(", ")}
                        {project.team.length > 2 && ` +${project.team.length - 2} more`}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - 4}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <Link to={`/projects/${project.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" className="px-3">
                        <Github className="w-4 h-4" />
                      </Button>

                      {isProjectOwner(project) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="px-3">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-background border shadow-md"
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/projects/${project.id}/edit`}
                                className="flex items-center"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Project
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            )}

          </div>
        )}


      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteProjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        projectTitle={projects.find(p => p.id === projectToDelete)?.title || ''}
        onConfirm={confirmDeleteProject}
      />

      <Footer />
    </div>
  );
};

export default Projects;
