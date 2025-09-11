import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Upload as UploadIcon,
  File,
  Image as ImageIcon
} from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const ProjectEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student' as const
  };

  // Mock existing project data
  const [formData, setFormData] = useState({
    title: 'AI-Powered Learning Assistant',
    description: 'An intelligent tutoring system that adapts to individual learning patterns using machine learning algorithms. Features personalized content delivery, progress tracking, and adaptive testing.',
    subject: 'Computer Science',
    tags: ['AI', 'Machine Learning', 'Education', 'Python', 'TensorFlow'],
    visibility: 'Public',
    githubUrl: 'https://github.com/example/ai-tutor',
    demoUrl: 'https://demo.example.com',
    teamMembers: ['Sarah Johnson', 'Mike Chen', 'Emma Davis']
  });

  const [newTag, setNewTag] = useState('');
  const [newTeamMember, setNewTeamMember] = useState('');

  const subjects = [
    'Computer Science', 'Engineering', 'Biology', 'Physics', 'Mathematics',
    'Chemistry', 'Psychology', 'Business', 'Medicine', 'Arts', 'Literature', 'History'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddTeamMember = () => {
    if (newTeamMember.trim() && !formData.teamMembers.includes(newTeamMember.trim())) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newTeamMember.trim()]
      }));
      setNewTeamMember('');
    }
  };

  const handleRemoveTeamMember = (memberToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member !== memberToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the actual update logic
    console.log('Updated project data:', formData);
    navigate(`/projects/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to={`/projects/${id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold heading-academic mb-2">
                Edit Project
              </h1>
              <p className="text-xl text-academic">
                Update your project details and information
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your project, its goals, and key features"
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility *</Label>
                      <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public">Public - Anyone can view</SelectItem>
                          <SelectItem value="University Only">University Only - Students from your university</SelectItem>
                          <SelectItem value="Team Only">Team Only - Only team members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags & Technologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-2">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag (e.g., React, Python, AI)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.teamMembers.map((member) => (
                      <Badge key={member} variant="outline" className="flex items-center gap-2">
                        {member}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => handleRemoveTeamMember(member)}
                        />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newTeamMember}
                      onChange={(e) => setNewTeamMember(e.target.value)}
                      placeholder="Add team member name"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTeamMember();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTeamMember} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* External Links */}
              <Card>
                <CardHeader>
                  <CardTitle>External Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub Repository</Label>
                    <Input
                      id="githubUrl"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      placeholder="https://github.com/username/repository"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demoUrl">Live Demo</Label>
                    <Input
                      id="demoUrl"
                      value={formData.demoUrl}
                      onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                      placeholder="https://your-demo-url.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Files Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Files & Screenshots</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop files or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      <File className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>

                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Add project screenshots
                    </p>
                    <Button variant="outline" size="sm">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Files */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 rounded border">
                      <span>main.py</span>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border">
                      <span>requirements.txt</span>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border">
                      <span>README.md</span>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" asChild>
              <Link to={`/projects/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectEdit;