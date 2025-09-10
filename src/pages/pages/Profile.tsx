import { useState } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Github, 
  Edit, 
  Save, 
  Camera,
  FolderOpen,
  MessageSquare,
  ArrowUp,
  Calendar,
  Tag
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const mockProfile = {
    name: "Sarah Chen",
    email: "sarah.chen@mit.edu",
    studentId: "SC2024001",
    university: "MIT",
    major: "Computer Science",
    year: "Senior",
    rank: "Advanced",
    github: "https://github.com/sarahchen",
    description: "Passionate about AI/ML and full-stack development. Currently working on innovative projects in machine learning and web technologies.",
    avatar: "/placeholder.svg"
  };

  const mockProjects = [
    {
      id: 1,
      name: "AI-Powered Study Assistant",
      description: "Machine learning model that helps students with personalized study recommendations",
      year: "2024",
      subject: "Machine Learning",
      tags: ["Python", "TensorFlow", "React"]
    },
    {
      id: 2,
      name: "Blockchain Voting System",
      description: "Secure voting platform using blockchain technology for student elections",
      year: "2023",
      subject: "Cryptography",
      tags: ["Solidity", "Web3", "JavaScript"]
    },
    {
      id: 3,
      name: "Campus Navigation App",
      description: "Mobile app for indoor navigation within university campus",
      year: "2023",
      subject: "Mobile Development",
      tags: ["React Native", "GPS", "AR"]
    }
  ];

  const mockQuestions = [
    {
      id: 1,
      title: "Best practices for React state management?",
      year: "2024",
      tags: ["React", "JavaScript"],
      upvotes: 24
    },
    {
      id: 2,
      title: "How to optimize machine learning model performance?",
      year: "2024",
      tags: ["ML", "Python"],
      upvotes: 18
    }
  ];

  const mockAnswers = [
    {
      id: 1,
      title: "Database design patterns for scalable applications",
      year: "2024",
      tags: ["Database", "Architecture"],
      upvotes: 32
    },
    {
      id: 2,
      title: "Implementing OAuth2 authentication",
      year: "2023",
      tags: ["Authentication", "Security"],
      upvotes: 15
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={mockProfile.avatar} alt={mockProfile.name} />
                  <AvatarFallback className="text-2xl">
                    {mockProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" className="absolute -bottom-2 -right-2">
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    {isEditing ? (
                      <Input defaultValue={mockProfile.name} className="text-2xl font-bold mb-2" />
                    ) : (
                      <h1 className="text-2xl font-bold">{mockProfile.name}</h1>
                    )}
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {mockProfile.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {mockProfile.university}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                    {isEditing ? (
                      <Input defaultValue={mockProfile.studentId} />
                    ) : (
                      <p className="font-medium">{mockProfile.studentId}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Major</label>
                    {isEditing ? (
                      <Input defaultValue={mockProfile.major} />
                    ) : (
                      <p className="font-medium">{mockProfile.major}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year</label>
                    {isEditing ? (
                      <Input defaultValue={mockProfile.year} />
                    ) : (
                      <p className="font-medium">{mockProfile.year}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Rank</label>
                    <Badge variant="secondary">{mockProfile.rank}</Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">GitHub</label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Github className="w-4 h-4 mt-2" />
                      <Input defaultValue={mockProfile.github} />
                    </div>
                  ) : (
                    <p className="flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      <a href={mockProfile.github} className="text-primary hover:underline">
                        {mockProfile.github}
                      </a>
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  {isEditing ? (
                    <Textarea defaultValue={mockProfile.description} rows={3} />
                  ) : (
                    <p className="text-sm">{mockProfile.description}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Projects ({mockProjects.length})
              </TabsTrigger>
              <TabsTrigger value="qa" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Q&A Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6">
              <div className="grid gap-4">
                {mockProjects.map((project) => (
                  <Card key={project.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <p className="text-muted-foreground text-sm">{project.description}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{project.year}</p>
                        <p>{project.subject}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="qa" className="mt-6">
              <div className="space-y-6">
                {/* Questions Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Questions ({mockQuestions.length})
                  </h3>
                  <div className="space-y-3">
                    {mockQuestions.map((question) => (
                      <Card key={question.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{question.title}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {question.year}
                              </span>
                              <div className="flex gap-1">
                                {question.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <ArrowUp className="w-4 h-4" />
                            {question.upvotes}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Answers Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Answers ({mockAnswers.length})
                  </h3>
                  <div className="space-y-3">
                    {mockAnswers.map((answer) => (
                      <Card key={answer.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{answer.title}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {answer.year}
                              </span>
                              <div className="flex gap-1">
                                {answer.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-primary">
                            <ArrowUp className="w-4 h-4" />
                            {answer.upvotes}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;