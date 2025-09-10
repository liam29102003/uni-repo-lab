import { useState } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageSquare, TrendingUp, Calendar, User, ArrowUp, ArrowDown } from "lucide-react";

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockQuestions = [
    {
      id: 1,
      title: "Best practices for React state management in large projects?",
      author: "Sarah Chen",
      university: "MIT",
      year: "2024",
      tags: ["React", "State Management", "JavaScript"],
      upvotes: 24,
      answers: 8,
      isAnswered: true,
      createdAt: "2 hours ago"
    },
    {
      id: 2,
      title: "How to implement machine learning model deployment?",
      author: "Alex Kumar",
      university: "Stanford",
      year: "2024",
      tags: ["Machine Learning", "Python", "Deployment"],
      upvotes: 15,
      answers: 3,
      isAnswered: false,
      createdAt: "1 day ago"
    },
    {
      id: 3,
      title: "Database design patterns for microservices architecture",
      author: "Maria Rodriguez",
      university: "UC Berkeley",
      year: "2023",
      tags: ["Database", "Microservices", "Architecture"],
      upvotes: 32,
      answers: 12,
      isAnswered: true,
      createdAt: "3 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  UniRepo Forum
                </h1>
                <p className="text-muted-foreground mt-2">
                  Connect, learn, and collaborate with students worldwide
                </p>
              </div>
              <Button className="w-fit">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Forum Tabs */}
          <Tabs defaultValue="public" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="public" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Public Forum
              </TabsTrigger>
              <TabsTrigger value="university" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                My University
              </TabsTrigger>
            </TabsList>

            <TabsContent value="public">
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Most Popular
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Recent
                  </Button>
                  <Button variant="outline" size="sm">Unanswered</Button>
                  <Button variant="outline" size="sm">JavaScript</Button>
                  <Button variant="outline" size="sm">Python</Button>
                  <Button variant="outline" size="sm">AI/ML</Button>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {mockQuestions.map((question) => (
                    <Card key={question.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground hover:text-primary">
                              {question.title}
                            </h3>
                            {question.isAnswered && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                Answered
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {question.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {question.author} • {question.university}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {question.createdAt}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-4 ml-6">
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <ArrowUp className="w-4 h-4" />
                              <span className="font-medium">{question.upvotes}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">votes</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-sm font-medium">{question.answers}</div>
                            <div className="text-xs text-muted-foreground">answers</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="university">
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">University Forum</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with students from your university. Login to access university-specific discussions.
                </p>
                <Button>Login to Continue</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Forum;