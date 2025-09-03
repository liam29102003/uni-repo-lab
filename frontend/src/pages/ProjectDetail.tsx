import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Star, 
  Eye, 
  Download, 
  ExternalLink, 
  Github, 
  Users, 
  Calendar, 
  BookOpen,
  MessageSquare,
  Send
} from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Alice Chen',
      avatar: '/placeholder.svg',
      university: 'MIT',
      content: 'This is an amazing project! The machine learning implementation is really well done.',
      createdAt: '2024-01-20',
      replies: [
        {
          id: '2',
          author: 'Sarah Johnson',
          avatar: '/placeholder.svg',
          university: 'MIT',
          content: 'Thank you! We spent months fine-tuning the algorithm.',
          createdAt: '2024-01-21'
        }
      ]
    }
  ]);

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student' as const
  };

  const mockProject = {
    id: id,
    title: 'AI-Powered Learning Assistant',
    description: 'An intelligent tutoring system that adapts to individual learning patterns using machine learning algorithms. Features personalized content delivery, progress tracking, and adaptive testing. This comprehensive system uses natural language processing to understand student queries and provides personalized explanations based on their learning style and current knowledge level.',
    university: 'MIT',
    team: [
      { name: 'Sarah Johnson', role: 'Project Lead', avatar: '/placeholder.svg' },
      { name: 'Mike Chen', role: 'ML Engineer', avatar: '/placeholder.svg' },
      { name: 'Emma Davis', role: 'Frontend Developer', avatar: '/placeholder.svg' }
    ],
    tags: ['AI', 'Machine Learning', 'Education', 'Python', 'TensorFlow'],
    visibility: 'Public',
    views: 1247,
    stars: 89,
    createdAt: '2024-01-15',
    subject: 'Computer Science',
    screenshots: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    files: [
      { name: 'main.py', size: '12.5 KB', type: 'Python' },
      { name: 'model.pkl', size: '45.2 MB', type: 'Model' },
      { name: 'requirements.txt', size: '1.2 KB', type: 'Text' },
      { name: 'README.md', size: '8.7 KB', type: 'Markdown' }
    ],
    links: [
      { name: 'GitHub Repository', url: 'https://github.com/example/ai-tutor' },
      { name: 'Live Demo', url: 'https://demo.example.com' },
      { name: 'Research Paper', url: 'https://arxiv.org/example' }
    ]
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(),
        author: mockUser.name,
        avatar: '/placeholder.svg',
        university: 'Current University',
        content: comment,
        createdAt: new Date().toISOString().split('T')[0],
        replies: []
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'Public':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'University Only':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Team Only':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge 
                  variant="outline" 
                  className={`${getVisibilityColor(mockProject.visibility)} font-medium`}
                >
                  {mockProject.visibility}
                </Badge>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{mockProject.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{mockProject.stars}</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold heading-academic mb-4">
                {mockProject.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="font-medium">{mockProject.university}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(mockProject.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{mockProject.team.length} team members</span>
                </div>
              </div>

              <p className="text-lg text-academic leading-relaxed">
                {mockProject.description}
              </p>
            </div>

            <div className="flex gap-3 mt-6 md:mt-0 md:ml-6">
              <Button variant="outline">
                <Star className="w-4 h-4 mr-2" />
                Star Project
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {mockProject.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-academic">{mockProject.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {mockProject.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">External Links</h4>
                      <div className="space-y-2">
                        {mockProject.links.map((link, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <ExternalLink className="w-4 h-4 text-primary" />
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {link.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockProject.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {file.type.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-muted-foreground">{file.size}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="screenshots" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockProject.screenshots.map((screenshot, index) => (
                        <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground">Screenshot {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Comments ({comments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Comment */}
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Share your thoughts about this project..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button onClick={handleAddComment} disabled={!comment.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="space-y-3">
                          <div className="flex space-x-3">
                            <Avatar>
                              <AvatarImage src={comment.avatar} />
                              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">{comment.author}</span>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">{comment.university}</span>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
                              </div>
                              <p className="text-academic">{comment.content}</p>
                            </div>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.map((reply) => (
                            <div key={reply.id} className="ml-12 flex space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={reply.avatar} />
                                <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-sm">{reply.author}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{reply.university}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
                                </div>
                                <p className="text-sm text-academic">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockProject.team.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Subject:</span>
                  <span className="ml-2 text-muted-foreground">{mockProject.subject}</span>
                </div>
                <div>
                  <span className="font-medium">University:</span>
                  <span className="ml-2 text-muted-foreground">{mockProject.university}</span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2 text-muted-foreground">
                    {new Date(mockProject.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Visibility:</span>
                  <Badge variant="outline" className="ml-2">
                    {mockProject.visibility}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download All Files
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;