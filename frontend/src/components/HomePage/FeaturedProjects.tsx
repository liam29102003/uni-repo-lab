import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Eye, 
  Star, 
  Users, 
  Calendar,
  ExternalLink,
  Github,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  university: string;
  team: string[];
  tags: string[];
  visibility: 'Public' | 'University Only' | 'Team Only';
  views: number;
  stars: number;
  createdAt: string;
  image?: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Learning Assistant',
    description: 'An intelligent tutoring system that adapts to individual learning patterns using machine learning algorithms.',
    university: 'MIT',
    team: ['Sarah Johnson', 'Mike Chen', 'Emma Davis'],
    tags: ['AI', 'Machine Learning', 'Education', 'Python'],
    visibility: 'Public',
    views: 1247,
    stars: 89,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Sustainable Campus Energy System',
    description: 'IoT-based energy monitoring and optimization system for university campuses to reduce carbon footprint.',
    university: 'Stanford',
    team: ['Alex Rodriguez', 'Lisa Wang', 'David Thompson', 'Maria Garcia'],
    tags: ['IoT', 'Sustainability', 'Arduino', 'Environmental'],
    visibility: 'Public',
    views: 892,
    stars: 67,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Virtual Reality History Museum',
    description: 'Immersive VR experience showcasing historical events and artifacts with interactive educational content.',
    university: 'Harvard',
    team: ['Jessica Park', 'Ryan Miller', 'Sophie Anderson'],
    tags: ['VR', 'Unity', 'History', 'Education', 'C#'],
    visibility: 'University Only',
    views: 654,
    stars: 45,
    createdAt: '2024-01-25'
  }
];

const FeaturedProjects: React.FC = () => {
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

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold heading-academic mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-academic max-w-3xl mx-auto">
            Discover innovative projects from top universities around the world. 
            From AI research to sustainability initiatives, explore cutting-edge student work.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className="project-card animate-slide-up group hover:scale-102"
              style={{ animationDelay: `${index * 0.2}s` }}
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
                
                <p className="text-academic line-clamp-3">
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
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.tags.length - 3}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="px-12" asChild>
            <Link to="/projects">
              Explore All Projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;