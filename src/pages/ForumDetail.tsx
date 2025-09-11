

import React, { useEffect, useState } from 'react';
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
  BookOpen
} from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { toast } from 'sonner';
import CommentComp from '@/components/CommentComp';

const ForumDetail: React.FC = () => {
  const { id } = useParams();
  const user_id = localStorage.getItem("user_object_id")
  const [newAnswer, setNewAnswer] = useState('');
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);

  const [questionVoters, setQuestionVoters] = useState<any[]>([]);
  const [answerVoters, setAnswerVoters] = useState<any[]>([]);

  // const mockUser = {
  //   name: 'John Doe',
  //   email: 'john.doe@university.edu',
  //   role: 'student' as const
  // };

  function getUserVoteOnQuestion(userId: string): number | undefined {
    
    const voter = questionVoters.find(v => v.userId === userId);
    return voter ? voter.vote : undefined;
  }

  function getUserVoteOnAnswer(userId: string, answerId: string): number | undefined {
    const voter = answerVoters.find(v => v.userId === userId && v.answerId === answerId);
    console.log(voter)
    return voter ? voter.vote : undefined;
  }

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:8070/api/questions/${id}`);
      const data = await res.json();
      setQuestion(data.question);
      setAnswers(data.answers);
       // Flatten all voters from answers
      const answerVoters = data.answers.flatMap((ans: any) => 
        (ans.voters || []).map(v => ({
          answerId: ans._id,
          userId: v.userId,
          vote: v.vote
        }))
      );
      console.log(answerVoters)

    setAnswerVoters(answerVoters);
    setQuestionVoters(data.question.voters || []);
      console.log(data)
    } catch (err) {
      console.error('Failed to fetch question detail:', err);
    }
  };

  const updateViewCount = async() =>{
    try {
      await fetch(`http://localhost:8070/api/questions/${id}/view`, {
        method: "PATCH"
      });
    } catch (err) {
      console.error("Failed to increment view count:", err);
    }
  }

  useEffect(() => {
    fetchData();
    updateViewCount()
  }, [id]);

  const handleSubmitAnswer = async () => {
    try {
      const payload = {
        questionId: id,
        answeredBy: user_id, // change later 
        body: newAnswer
      };
      const res = await fetch(`http://localhost:8070/api/questions/save_answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      toast(data?.message || 'Answer submitted');
      setNewAnswer('');
      fetchData();
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };


  // vote: 1 (upvote) or -1 (downvote)
  async function saveVote(questionId: any, userId: any, vote: any) {
    try {
      const res = await fetch(`http://localhost:8070/api/questions/vote/${questionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, vote }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to save vote");
      }
      const data = await res.json();
      toast(data?.message || 'Vote saved');
      fetchData();
    } catch (error: any) {
      console.error("Error saving vote:", error.message);
    }
  }

  async function saveAnswerVote(answerId: any, userId: any, vote: any) {
    try {
      const res = await fetch(`http://localhost:8070/api/questions/answers/${answerId}/vote?user_id=${userId}&vote=${vote}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, vote }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to save vote");
      }
      const data = await res.json();
      toast(data?.message || 'Vote saved');
      fetchData();
    } catch (error: any) {
      console.error("Error saving vote:", error.message);
    }
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {question?.visibility}
                  </Badge>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{question?.views+1}</span>
                    </div>
                    {

                    }
                    <div className={`flex items-center space-x-1 `}>
                      <ArrowUp className="w-4 h-4" />
                      <span>{question?.upvotes}</span>
                    </div>
                    <div className={`flex items-center space-x-1 `}>
                      <ArrowDown className="w-4 h-4" />
                      <span>{question?.downvotes}</span>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-foreground">
                  {question?.title}
                </h1>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW_PQ8BnjD0vx3F_kX0ekjJQePDXzTBGz5mA&s" />
                      <AvatarFallback>{question?.askedByUser?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{question?.askedByUser?.name}</p>
                      <div className="flex gap-5">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <BookOpen className="w-4 h-4" />
                          <span>{question?.university}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(question?.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {question?.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                <div className="prose max-w-none text-academic">
                  {question?.content?.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
                  ))}
                </div>

                {/* Question Actions */}
                <div className="flex items-center space-x-4 mt-6 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={question?.hasUpvoted ? "default" : "outline"}
                      onClick={() => saveVote(question?._id, user_id, 1)}
                      className={`${getUserVoteOnQuestion(user_id) == 1 && 'bg-blue-200' }`}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold">{question?.upvotes}</span>

                    <Button
                      size="sm"
                      variant={question?.hasDownvoted ? "default" : "outline"}
                      onClick={() => saveVote(question?._id, user_id, -1)}
                      className={`${getUserVoteOnQuestion(user_id) == -1 && 'bg-blue-200' }`}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold">{question?.downvotes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{answers?.length} answers</span>
                  </div>
                  <CommentComp parentId={id} parentType={"question"}/>
                </div>
              </CardContent>
            </Card>


            {/* Answers */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {answers?.length} Answer{answers?.length !== 1 ? 's' : ''}
                </h2>
              </div>

              {answers?.map((answer) => {
                // const reputationBadge = getReputationBadge(answer?.reputation);
                return (
                  <Card key={answer?._id} className="border-l-2 border-l-muted">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnFRPx77U9mERU_T1zyHcz9BOxbDQrL4Dvtg&s" />
                            <AvatarFallback>{answer?.answeredByUser?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold">{answer?.answeredByUser?.name}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>Student</span>
                              <span>•</span>
                              <BookOpen className="w-4 h-4" />
                              <span>{answer?.answeredByUser?.university}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(answer?.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="prose max-w-none text-academic mb-4">
                        {answer?.body.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-3 leading-relaxed">{paragraph}</p>
                        ))}
                      </div>

                      {/* Answer Actions */}
                      <div className="flex items-center space-x-4 pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant={answer?.hasUpvoted ? "default" : "outline"}
                            onClick={() => saveAnswerVote(answer?._id, user_id, 1)}
                            className={`${getUserVoteOnAnswer(user_id,answer?._id) == 1 && 'bg-blue-200' }`}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold">{answer?.upvotes}</span>

                          <Button
                            size="sm"
                            variant={answer?.hasDownvoted ? "default" : "outline"}
                            onClick={() => saveAnswerVote(answer?._id, user_id, -1)}
                            className={`${getUserVoteOnAnswer(user_id,answer?._id) == -1 && 'bg-blue-200' }`}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold">{answer?.downvotes}</span>
                        </div>
                        <CommentComp parentId={answer?._id} parentType={"answer"}/>
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
                  <span>{new Date(question?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Viewed</span>
                  <span>{question?.views+1} times</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active</span>
                  <span>Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Answers</span>
                  <span>{answers?.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Questions */}
            {/* <Card>
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
            </Card> */}

            {/* Tags */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Related Tags</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {question?.tags?.map((tag) => (
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
