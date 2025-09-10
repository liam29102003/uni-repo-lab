import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Send,
  Eye,
  Calendar,
  User,
  Award,
  BookOpen
} from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const ForumDetail: React.FC = () => {
  const { id } = useParams();
  const [newAnswer, setNewAnswer] = useState('');
  const [answers, setAnswers] = useState([
    {
      id: '1',
      author: 'Dr. Sarah Wilson',
      avatar: '/placeholder.svg',
      university: 'MIT',
      role: 'Professor',
      reputation: 2450,
      content: `Great question! Neural networks can indeed be used for time series forecasting, and they're particularly effective for complex patterns. Here's what you need to consider:

1. **LSTM Networks**: Long Short-Term Memory networks are specifically designed for sequential data and can capture long-term dependencies in your time series.

2. **Data Preprocessing**: Make sure to normalize your data and create appropriate sliding windows for training.

3. **Architecture**: Start with a simple LSTM layer followed by dense layers. You can experiment with multiple LSTM layers for more complex patterns.

Here's a basic implementation structure:
\`\`\`python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(timesteps, features)),
    Dropout(0.2),
    LSTM(50, return_sequences=False),
    Dropout(0.2),
    Dense(25),
    Dense(1)
])
\`\`\`

The key is to experiment with different architectures and hyperparameters based on your specific dataset.`,
      createdAt: '2024-01-20',
      upvotes: 23,
      downvotes: 1,
      hasUpvoted: false,
      hasDownvoted: false
    },
    {
      id: '2',
      author: 'Alex Chen',
      avatar: '/placeholder.svg',
      university: 'Stanford',
      role: 'PhD Student',
      reputation: 856,
      content: `I've worked extensively with time series prediction using neural networks. While Dr. Wilson's answer is excellent, I'd like to add a few practical tips:

- **Feature Engineering**: Don't forget to include relevant features like seasonality indicators, rolling averages, and lag features.
- **Validation Strategy**: Use time-based cross-validation rather than random splits to avoid data leakage.
- **Ensemble Methods**: Consider combining LSTM with other models like ARIMA or Prophet for better robustness.

Also, transformers are becoming increasingly popular for time series forecasting. Check out papers on "Temporal Fusion Transformers" if you're interested in cutting-edge approaches.`,
      createdAt: '2024-01-21',
      upvotes: 15,
      downvotes: 0,
      hasUpvoted: true,
      hasDownvoted: false
    }
  ]);

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student' as const
  };

  const mockQuestion = {
    id: id,
    title: 'How to implement neural networks for time series forecasting in Python?',
    content: `I'm working on a project that involves predicting stock prices using historical data, and I've been reading about neural networks for time series forecasting. 

I have a dataset with daily stock prices for the past 5 years, including features like:
- Open, High, Low, Close prices
- Trading volume
- Various technical indicators (RSI, MACD, etc.)

My questions are:
1. What type of neural network architecture would be most suitable for this task?
2. How should I structure my input data for training?
3. What are the key preprocessing steps I should consider?
4. How do I handle the temporal dependencies in the data?

I'm using Python with TensorFlow/Keras. Any code examples or resources would be greatly appreciated!

**Background**: I'm a Computer Science student with basic knowledge of machine learning, but this is my first deep dive into time series analysis.`,
    author: 'Mike Rodriguez',
    avatar: '/placeholder.svg',
    university: 'UC Berkeley',
    year: '3rd Year',
    reputation: 234,
    tags: ['Python', 'Neural Networks', 'Time Series', 'TensorFlow', 'Machine Learning'],
    visibility: 'Public',
    views: 1847,
    upvotes: 34,
    downvotes: 2,
    createdAt: '2024-01-19',
    hasUpvoted: false,
    hasDownvoted: false
  };

  const handleUpvote = (answerId: string) => {
    setAnswers(prev => prev.map(answer => {
      if (answer.id === answerId) {
        if (answer.hasUpvoted) {
          return { ...answer, upvotes: answer.upvotes - 1, hasUpvoted: false };
        } else {
          return {
            ...answer,
            upvotes: answer.upvotes + 1,
            downvotes: answer.hasDownvoted ? answer.downvotes - 1 : answer.downvotes,
            hasUpvoted: true,
            hasDownvoted: false
          };
        }
      }
      return answer;
    }));
  };

  const handleDownvote = (answerId: string) => {
    setAnswers(prev => prev.map(answer => {
      if (answer.id === answerId) {
        if (answer.hasDownvoted) {
          return { ...answer, downvotes: answer.downvotes - 1, hasDownvoted: false };
        } else {
          return {
            ...answer,
            downvotes: answer.downvotes + 1,
            upvotes: answer.hasUpvoted ? answer.upvotes - 1 : answer.upvotes,
            hasDownvoted: true,
            hasUpvoted: false
          };
        }
      }
      return answer;
    }));
  };

  const handleSubmitAnswer = () => {
    if (newAnswer.trim()) {
      const answer = {
        id: Date.now().toString(),
        author: mockUser.name,
        avatar: '/placeholder.svg',
        university: 'Current University',
        role: 'Student',
        reputation: 120,
        content: newAnswer,
        createdAt: new Date().toISOString().split('T')[0],
        upvotes: 0,
        downvotes: 0,
        hasUpvoted: false,
        hasDownvoted: false
      };
      setAnswers(prev => [...prev, answer]);
      setNewAnswer('');
    }
  };

  const getReputationBadge = (reputation: number) => {
    if (reputation > 2000) return { text: 'Expert', color: 'bg-purple-100 text-purple-700 border-purple-200' };
    if (reputation > 1000) return { text: 'Advanced', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (reputation > 500) return { text: 'Intermediate', color: 'bg-green-100 text-green-700 border-green-200' };
    return { text: 'Beginner', color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {mockQuestion.visibility}
                  </Badge>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{mockQuestion.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUp className="w-4 h-4" />
                      <span>{mockQuestion.upvotes}</span>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-foreground">
                  {mockQuestion.title}
                </h1>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={mockQuestion.avatar} />
                      <AvatarFallback>{mockQuestion.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{mockQuestion.author}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>{mockQuestion.university}</span>
                        <span>•</span>
                        <span>{mockQuestion.year}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(mockQuestion.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {mockQuestion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                <div className="prose max-w-none text-academic">
                  {mockQuestion.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Question Actions */}
                <div className="flex items-center space-x-4 mt-6 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold">{mockQuestion.upvotes - mockQuestion.downvotes}</span>
                    <Button size="sm" variant="outline">
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{answers.length} answers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answers */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {answers.length} Answer{answers.length !== 1 ? 's' : ''}
                </h2>
              </div>

              {answers.map((answer) => {
                const reputationBadge = getReputationBadge(answer.reputation);
                return (
                  <Card key={answer.id} className="border-l-2 border-l-muted">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={answer.avatar} />
                            <AvatarFallback>{answer.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold">{answer.author}</p>
                              <Badge variant="outline" className={reputationBadge.color}>
                                <Award className="w-3 h-3 mr-1" />
                                {reputationBadge.text}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{answer.role}</span>
                              <span>•</span>
                              <BookOpen className="w-4 h-4" />
                              <span>{answer.university}</span>
                              <span>•</span>
                              <span>{answer.reputation} rep</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="prose max-w-none text-academic mb-4">
                        {answer.content.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Answer Actions */}
                      <div className="flex items-center space-x-4 pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant={answer.hasUpvoted ? "default" : "outline"}
                            onClick={() => handleUpvote(answer.id)}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold">{answer.upvotes - answer.downvotes}</span>
                          <Button 
                            size="sm" 
                            variant={answer.hasDownvoted ? "default" : "outline"}
                            onClick={() => handleDownvote(answer.id)}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Add Answer */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Your Answer</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write your answer here... Be detailed and helpful!"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="min-h-[150px]"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Please be respectful and provide helpful, accurate information.
                  </p>
                  <Button onClick={handleSubmitAnswer} disabled={!newAnswer.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Post Answer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Question Stats */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Question Stats</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asked</span>
                  <span>{new Date(mockQuestion.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Viewed</span>
                  <span>{mockQuestion.views} times</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active</span>
                  <span>Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Answers</span>
                  <span>{answers.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Questions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Related Questions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <Link to="/forum/2" className="block p-3 rounded hover:bg-muted transition-colors">
                    <p className="text-sm font-medium line-clamp-2">
                      Best practices for preprocessing time series data?
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">12 answers • 245 views</p>
                  </Link>
                  <Link to="/forum/3" className="block p-3 rounded hover:bg-muted transition-colors">
                    <p className="text-sm font-medium line-clamp-2">
                      LSTM vs GRU for sequence prediction tasks
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">8 answers • 189 views</p>
                  </Link>
                  <Link to="/forum/4" className="block p-3 rounded hover:bg-muted transition-colors">
                    <p className="text-sm font-medium line-clamp-2">
                      How to handle overfitting in neural networks?
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">15 answers • 432 views</p>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Related Tags</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockQuestion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForumDetail;