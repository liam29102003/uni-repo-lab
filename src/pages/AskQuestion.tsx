import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Plus,
  X,
  Globe,
  Lock,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Users
} from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const AskQuestion: React.FC = () => {
  const [questionData, setQuestionData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    visibility: 'Public',
    category: '',
    askedBy:'',
    university:""
  });

  
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Computer Science',
    'Mathematics', 
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Business',
    'Economics',
    'Psychology',
    'History',
    'Literature',
    'Art & Design',
    'General'
  ];

  const popularTags = [
    'Python', 'JavaScript', 'React', 'Machine Learning', 'AI', 'Web Development',
    'Data Science', 'Algorithms', 'Database', 'Mobile Development', 'Cloud Computing',
    'Security', 'DevOps', 'UI/UX', 'Statistics', 'Research Methods'
  ];

  const addTag = (tagToAdd?: string) => {
    const tag = tagToAdd || newTag.trim();
    if (tag && !questionData.tags.includes(tag)) {
      setQuestionData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setQuestionData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // questionData.askedBy = JSON.parse(localStorage.getItem('userInfo'))._id || "66ccf4a1a4d8c2b567890456"
  //  questionData.askedBy = "66ccf4a1a4d8c2b567890456",
  questionData.askedBy =localStorage.getItem('user_object_id'),
   questionData.university = JSON.parse(localStorage.getItem('user')).university,
   console.log(questionData)
  try {
    const res = await fetch("http://127.0.0.1:8070/api/questions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionData),
    });

    if (!res.ok) {
      throw new Error("Failed to post question");
    }

    const data = await res.json();
    console.log("Question saved:", data);

    // Optionally reset form
    setQuestionData({
      title: "",
      content: "",
      tags: [],
      visibility: "Public",
      category: "",
      askedBy:'',
      university:""
    });

    alert("Your question has been posted successfully!");
  } catch (error) {
    console.error("Error posting question:", error);
    alert("Something went wrong. Please try again.");
  }
};


  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'Public':
        return <Globe className="w-4 h-4" />;
      case 'University Only':
        return <Lock className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Header user={mockUser} /> */}
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/forum">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold heading-academic mb-2">
            Ask a Question
          </h1>
          <p className="text-xl text-academic">
            Get help from the global university community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question Title */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Question Title
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                      placeholder="What's your programming question? Be specific and descriptive..."
                      value={questionData.title}
                      onChange={(e) => setQuestionData(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg py-3"
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Be specific and imagine you're asking a question to another person
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Question Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Question Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Textarea
                      placeholder="Describe your question in detail. Include:
• What you're trying to achieve
• What you've already tried
• Any error messages or unexpected behavior
• Relevant code snippets or examples
• Your current level of understanding"
                      value={questionData.content}
                      onChange={(e) => setQuestionData(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[200px]"
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      The more details you provide, the better answers you'll receive
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add relevant tags (e.g., python, react, machine-learning)..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={() => addTag()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {questionData.tags.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {questionData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2">Popular tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularTags
                        .filter(tag => !questionData.tags.includes(tag))
                        .slice(0, 10)
                        .map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => addTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Question Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Select value={questionData.category} onValueChange={(value) => 
                        setQuestionData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Visibility</label>
                      <Select value={questionData.visibility} onValueChange={(value) => 
                        setQuestionData(prev => ({ ...prev, visibility: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4" />
                              <span>Public - Visible to all students</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="University Only">
                            <div className="flex items-center space-x-2">
                              <Lock className="w-4 h-4" />
                              <span>University Only - Your university only</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

                        {/* Project Id  */}
               {/* <Card>
                <CardHeader>
                  <CardTitle>Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Select value={questionData.category} onValueChange={(value) => 
                        setQuestionData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Tips for Great Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Write a clear, descriptive title that summarizes your problem</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Provide context about what you're trying to accomplish</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Include relevant code snippets or error messages</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Mention what you've already tried</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Use appropriate tags to help others find your question</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getVisibilityIcon(questionData.visibility)}
                    <span className="text-sm font-medium">{questionData.visibility}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{questionData.category || 'Not selected'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Tags</p>
                    <p className="text-sm">{questionData.tags.length} tags added</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Title length</p>
                    <p className="text-sm">{questionData.title.length} characters</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Content length</p>
                    <p className="text-sm">{questionData.content.length} characters</p>
                  </div>
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Be respectful and professional</p>
                  <p>• Search for similar questions first</p>
                  <p>• Provide all relevant information</p>
                  <p>• Accept and upvote helpful answers</p>
                  <p>• Follow your university's code of conduct</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" asChild>
              <Link to="/forum">Cancel</Link>
            </Button>
            <Button type="submit" className="px-8">
              <HelpCircle className="w-4 h-4 mr-2" />
              Post Question
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default AskQuestion;