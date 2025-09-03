import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
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

// Mock data
const mockProjects = [
  {
    id: '1',
    title: 'AI-Powered Learning Assistant',
    description: 'An intelligent tutoring system that adapts to individual learning patterns using machine learning algorithms. Features personalized content delivery, progress tracking, and adaptive testing.',
    university: 'MIT',
    team: ['Sarah Johnson', 'Mike Chen', 'Emma Davis'],
    tags: ['AI', 'Machine Learning', 'Education', 'Python', 'TensorFlow'],
    visibility: 'Public',
    views: 1247,
    stars: 89,
    createdAt: '2024-01-15',
    subject: 'Computer Science'
  },
  {
    id: '2',
    title: 'Sustainable Campus Energy System',
    description: 'IoT-based energy monitoring and optimization system for university campuses to reduce carbon footprint. Real-time analytics and automated energy management.',
    university: 'Stanford',
    team: ['Alex Rodriguez', 'Lisa Wang', 'David Thompson', 'Maria Garcia'],
    tags: ['IoT', 'Sustainability', 'Arduino', 'Environmental', 'React'],
    visibility: 'Public',
    views: 892,
    stars: 67,
    createdAt: '2024-01-20',
    subject: 'Environmental Engineering'
  },
  {
    id: '3',
    title: 'Virtual Reality History Museum',
    description: 'Immersive VR experience showcasing historical events and artifacts with interactive educational content and guided tours.',
    university: 'Harvard',
    team: ['Jessica Park', 'Ryan Miller', 'Sophie Anderson'],
    tags: ['VR', 'Unity', 'History', 'Education', 'C#'],
    visibility: 'University Only',
    views: 654,
    stars: 45,
    createdAt: '2024-01-25',
    subject: 'History'
  },
  {
    id: '4',
    title: 'Blockchain-Based Voting System',
    description: 'Secure and transparent voting platform using blockchain technology for student government elections.',
    university: 'Caltech',
    team: ['David Kim', 'Anna Williams'],
    tags: ['Blockchain', 'Security', 'Web3', 'Ethereum', 'Solidity'],
    visibility: 'Public',
    views: 543,
    stars: 38,
    createdAt: '2024-02-01',
    subject: 'Computer Science'
  }
];

const subjects = ['All Subjects', 'Computer Science', 'Environmental Engineering', 'History', 'Biology', 'Physics', 'Mathematics'];
const technologies = ['All Technologies', 'AI', 'Machine Learning', 'React', 'Python', 'Unity', 'Blockchain', 'IoT'];
const universities = ['All Universities', 'MIT', 'Stanford', 'Harvard', 'Caltech', 'Oxford', 'Cambridge'];

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedTechnology, setSelectedTechnology] = useState('All Technologies');
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string>('');

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student' as const
  };

  // Check if user owns the project (simplified logic)
  const isProjectOwner = (project: any) => {
    return project.team.includes('Sarah Johnson'); // Mock logic - in real app would check actual ownership
  };

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProject = () => {
    // Here you would handle the actual deletion
    console.log('Deleting project:', projectToDelete);
    setDeleteDialogOpen(false);
    setProjectToDelete('');
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'Public':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'University Only':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Team Only':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filter projects based on search and filters
  React.useEffect(() => {
    let filtered = mockProjects;

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedSubject !== 'All Subjects') {
      filtered = filtered.filter(project => project.subject === selectedSubject);
    }

    if (selectedTechnology !== 'All Technologies') {
      filtered = filtered.filter(project =>
        project.tags.some(tag => tag.toLowerCase().includes(selectedTechnology.toLowerCase()))
      );
    }

    if (selectedUniversity !== 'All Universities') {
      filtered = filtered.filter(project => project.university === selectedUniversity);
    }

    setFilteredProjects(filtered);
  }, [searchQuery, selectedSubject, selectedTechnology, selectedUniversity]);

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
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

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search projects, technologies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg py-6"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
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

              {/* View Mode Toggle */}
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

          {/* Results Count */}
          <div className="text-muted-foreground mt-4">
            Showing {filteredProjects.length} of {mockProjects.length} projects
          </div>
        </div>

        {/* Projects Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="project-card group hover:scale-102"
            >
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
                
                <p className={`text-academic ${viewMode === 'grid' ? 'line-clamp-3' : 'line-clamp-2'}`}>
                  {project.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* University */}
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{project.university}</span>
                </div>

                {/* Team */}
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {project.team.slice(0, 2).join(', ')}
                    {project.team.length > 2 && ` +${project.team.length - 2} more`}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
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

                {/* Actions */}
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
                  
                  {/* Edit/Delete dropdown for project owners */}
                  {isProjectOwner(project) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="px-3">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border shadow-md">
                        <DropdownMenuItem asChild>
                          <Link to={`/projects/${project.id}/edit`} className="flex items-center">
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
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedSubject('All Subjects');
              setSelectedTechnology('All Technologies');
              setSelectedUniversity('All Universities');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteProjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        projectTitle={mockProjects.find(p => p.id === projectToDelete)?.title || ''}
        onConfirm={confirmDeleteProject}
      />

      <Footer />
    </div>
  );
};

export default Projects;