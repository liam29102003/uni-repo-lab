import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

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
  Send,
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
import { mock } from 'node:test';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

interface File {
  name: string;
  size: string;
  type: string;
}

interface LinkItem {
  name: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  university: string;
  team: TeamMember[];
  tags: string[];
  visibility: string;
  views: number;
  stars: number;
  createdAt: string;
  subject: string;
  screenshots: string[];
  files: File[];
  links: LinkItem[];
  starredByMe: boolean;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview") // or "overview", etc.


  const projectId = id; // Assuming id is the project ID from the route
  const mockUser = {
    id: 'user2',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student' as const
  };

  
  const handleDeleteProjectUi = () => {
    setDeleteDialogOpen(true);
  };

  // const confirmDeleteProject = () => {
  //   // Here you would handle the actual deletion
  //   console.log('Deleting project:', mockProject.id);
  //   setDeleteDialogOpen(false);
  //   // Navigate back to projects page
  //   window.location.href = '/projects';
  // };

  // Check if user owns the project (simplified logic)
  // const isProjectOwner = () => {
  //   return mockProject.team.some(member => member.name === 'Sarah Johnson'); // Mock logic
  // };

  const handleDeleteProject = () => {
    setDeleteDialogOpen(true);
  };

  // const confirmDeleteProject = () => {
  //   // Here you would handle the actual deletion
  //   console.log('Deleting project:', mockProject.id);
  //   setDeleteDialogOpen(false);
  //   // Navigate back to projects page
  //   window.location.href = '/projects';
  // };


  //  const [comment, setComment] = useState("")
  // const [loading, setLoading] = useState(false)
  // const [comments, setComments] = useState<any[]>([])

  // Add new comment
  // const handleAddComment = () => {
  //   if (!comment.trim()) return
  //   setLoading(true)

  //   const newComment = {
  //     id: Date.now(),
  //     author: "You",
  //     avatar: null,
  //     university: "My University",
  //     content: comment,
  //     createdAt: new Date(),
  //     isEditing: false,
  //     editContent: "",
  //     showReplyBox: false,
  //     replyContent: "",
  //     replies: []
  //   }

  //   setComments([newComment, ...comments])
  //   setComment("")
  //   setLoading(false)
  // }

  // Start editing
  const handleStartEdit = (id: number) => {
    setComments(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isEditing: true, editContent: c.content } : c
      )
    )
  }

  // Change text while editing
  const handleEditChange = (id: number, value: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === id ? { ...c, editContent: value } : c
      )
    )
  }

  // Save edit
  const handleSaveEdit = (id: number) => {
    setComments(prev =>
      prev.map(c =>
        c.id === id ? { ...c, content: c.editContent, isEditing: false } : c
      )
    )
  }

  // Cancel edit
  const handleCancelEdit = (id: number) => {
    setComments(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isEditing: false, editContent: "" } : c
      )
    )
  }

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8090/projects/${projectId}/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => c.id !== commentId)) // update UI
    } catch (err) {
      console.error("Failed to delete comment", err)
    }
  }

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      const form = new FormData()
      form.append("content", newContent)

      await axios.put(
        `http://localhost:8090/projects/${projectId}/comments/${commentId}`,
        form
      )
      fetchComments() // reload
    } catch (err) {
      console.error("Failed to update comment", err)
    }
  }



  // Toggle reply box
  const toggleReplyBox = (id: number) => {
    setComments(prev =>
      prev.map(c =>
        c.id === id ? { ...c, showReplyBox: !c.showReplyBox } : c
      )
    )
  }

  // Handle reply typing
  const handleReplyChange = (id: number, value: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === id ? { ...c, replyContent: value } : c
      )
    )
  }

  const handleStarClick = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", mockUser.id);

      const res = await axios.post(
        `http://localhost:8090/projects/${project.id}/star`,
        formData
      );
      console.log("Star toggled", res.data);
      setProject((prev) => ({
        ...prev,
        stars: res.data.stars,
        starredByMe: res.data.starredBy?.includes(mockUser.id) || false
      }));
    } catch (err) {
      console.error("Failed to toggle star", err);
    }
  };





  // Add reply
  const handleAddReply = async (commentId, replyText) => {
    if (!replyText?.trim()) return
      const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    try {
      const form = new FormData()
      form.append("author", user.username) // or logged-in user
      form.append("content", replyText)
      form.append("authorId", mockUser.id) // assuming mockUser has id

      await axios.post(
        `http://localhost:8090/projects/${projectId}/comments/${commentId}/replies`,
        form
      )

      fetchComments() // refresh after adding
    } catch (err) {
      console.error("Failed to add reply", err)
    }
  }


  const handleUpdateReply = async (commentId, replyId, newContent) => {
    try {
      const form = new FormData()
      form.append("content", newContent)

      await axios.put(
        `http://localhost:8090/projects/${projectId}/comments/${commentId}/replies/${replyId}`,
        form
      )
      fetchComments()
    } catch (err) {
      console.error("Failed to update reply", err)
    }
  }
  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await axios.delete(
        `http://localhost:8090/projects/${projectId}/comments/${commentId}/replies/${replyId}`
      )
      fetchComments()
    } catch (err) {
      console.error("Failed to delete reply", err)
    }
  }




  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8090/projects/${projectId}/comments`)
      setComments(res.data.comments)
    } catch (err) {
      console.error("Failed to fetch comments", err)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return
      const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    try {
      setLoading(true)
      const form = new FormData()
      form.append("author", "user.username") // or from logged in user
      form.append("content", comment)
      form.append("authorId", mockUser.id) // assuming mockUser has id

      await axios.post(`http://localhost:8090/projects/${projectId}/comments`, form)
      setComment("")
      fetchComments() // Refresh comments
    } catch (err) {
      console.error("Failed to post comment", err)
    } finally {
      setLoading(false)
    }
  }


  // Start editing a reply
  const handleStartReplyEdit = (commentId, replyId) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? {
            ...c,
            replies: c.replies.map(r =>
              r.id === replyId ? { ...r, isEditing: true, editContent: r.content } : r
            ),
          }
          : c
      )
    )
  }

  // Cancel reply edit
  const handleCancelReplyEdit = (commentId, replyId) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? {
            ...c,
            replies: c.replies.map(r =>
              r.id === replyId ? { ...r, isEditing: false, editContent: "" } : r
            ),
          }
          : c
      )
    )
  }

  // Handle reply text change
  const handleReplyEditChange = (commentId, replyId, value) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? {
            ...c,
            replies: c.replies.map(r =>
              r.id === replyId ? { ...r, editContent: value } : r
            ),
          }
          : c
      )
    )
  }

  // Save reply edit
  const handleSaveReplyEdit = async (commentId, replyId) => {
    const comment = comments.find(c => c.id === commentId)
    const reply = comment.replies.find(r => r.id === replyId)

    try {
      await axios.put(
        `http://localhost:8090/projects/${projectId}/comments/${commentId}/replies/${replyId}`,
        { content: reply.editContent },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      fetchComments()
    } catch (err) {
      console.error("Failed to update reply", err.response?.data || err)
    }
  }







  // Fetch project from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:8090/projects/${id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        const data = await response.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (comments.length > 0) {
      const lastComment = document.getElementById(`comment-${comments[comments.length - 1].id}`)
      lastComment?.scrollIntoView({ behavior: "smooth" })
    }
  }, [comments])




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

  if (loading) return <p className="text-center py-12">Loading project...</p>;
  if (error) return <p className="text-center py-12 text-red-500">{error}</p>;
  if (!project) return <p className="text-center py-12">Project not found</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      <main className="container mx-auto px-4 py-8">
        {/* Back */}
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>

        {/* Project Header */}
        <div className="flex flex-col md:flex-row md:justify-between mb-8 gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`${getVisibilityColor(project.visibility)} font-medium`}>
                {project.visibility}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1"><Eye className="w-4 h-4" />{project.views}</div>
                <div className="flex items-center gap-1"><Star className="w-4 h-4" />{project.stars}</div>
              </div>
            </div>
            <h1 className="text-4xl font-bold heading-academic">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /><span className="font-medium">{project.university}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /><span>{new Date(project.createdAt).toLocaleDateString()}</span></div>
              <div className="flex items-center gap-2"><Users className="w-5 h-5" /><span>{project.team.length} team members</span></div>
              
              {/* Edit/Delete dropdown for project owners */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border shadow-md">
                    <DropdownMenuItem asChild>
                      <Link to={`/projects/${id}/edit`} className="flex items-center">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Project
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDeleteProject}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            
            </div>
            <p className="text-academic">{project.description}</p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleStarClick}
              variant={project.starredByMe ? "default" : "outline"} // filled if starred, outline if not
              className="flex items-center gap-1"
            >
              {project.starredByMe ? (
                <>
                  <Star className="w-4 h-4 text-yellow-400" /> Starred
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 mr-1" /> Star Project
                </>
              )}
              {/* <span className="ml-2 text-sm text-muted-foreground">{project.stars || 0}</span> */}
            </Button>
            <Button><Download className="w-4 h-4 mr-2" />Download</Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><h4 className="font-semibold mb-2">Description</h4><p>{project.description}</p></div>
                    <div><h4 className="font-semibold mb-2">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">{project.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
                    </div>
                    <div><h4 className="font-semibold mb-2">External Links</h4>
                      <div className="space-y-2">
                        {project.links.map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-primary" />
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link.name}</a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Files */}
              <TabsContent value="files" className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Project Files</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {project.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          
                          <div>
                            <p className="font-medium">{file.filename}</p>
                            <p className="text-sm text-muted-foreground">{file.size / 1000} KB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline"><Download className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Screenshots */}
              <TabsContent value="screenshots" className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Project Screenshots</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.screenshots.map((s, idx) => (
                      <div key={idx} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <img src={s} alt={`Screenshot ${idx + 1}`} className="object-contain h-full w-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Comments */}
              <TabsContent value="comments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Comments ({comments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* New Comment Box */}
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button onClick={handleAddComment} disabled={!comment.trim() || loading}>
                        <Send className="w-4 h-4 mr-2" />
                        {loading ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((c) => (
                        <div key={c.id} className="space-y-3 border-b pb-4">
                          <div className="flex space-x-3">
                            <Avatar>
                              <AvatarImage src={c.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{c.author?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              {/* Author + Meta */}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{c.author}</span>
                                {c.university && (
                                  <>
                                    <span>•</span>
                                    <span>{c.university}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>{new Date(c.createdAt).toLocaleString()}</span>
                              </div>

                              {/* Editable Content */}
                              {c.isEditing ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={c.editContent}
                                    onChange={(e) => handleEditChange(c.id, e.target.value)}
                                  />
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleSaveEdit(c.id)}>
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleCancelEdit(c.id)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-academic">{c.content}</p>
                              )}

                              {/* Actions (Edit, Delete, Reply) */}
                              <div className="flex gap-3 text-xs text-muted-foreground">
                                <button onClick={() => handleStartEdit(c.id)}>Edit</button>
                                <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
                                <button onClick={() => toggleReplyBox(c.id)}>Reply</button>
                              </div>

                              {/* Reply Box */}
                              {c.showReplyBox && (
                                <div className="mt-2 space-y-2">
                                  <Textarea
                                    placeholder="Write a reply..."
                                    value={c.replyContent}
                                    onChange={(e) => handleReplyChange(c.id, e.target.value)}
                                    className="min-h-[60px]"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddReply(c.id, c.replyContent)}
                                    disabled={!c.replyContent?.trim()}
                                  >
                                    Reply
                                  </Button>

                                </div>
                              )}

                              {/* Nested Replies */}
                              {/* Nested Replies */}
                              {/* Nested Replies */}
                              {/* Nested Replies */}
                              {c.replies?.length > 0 && (
                                <div className="pl-6 mt-3 space-y-3 border-l">
                                  {/* Show replies only if c.showReplies is true */}
                                  {c.showReplies &&
                                    c.replies.map((r) => (
                                      <div key={r.id} className="flex space-x-3">
                                        <Avatar>
                                          <AvatarImage src={r.avatar || "/placeholder.svg"} />
                                          <AvatarFallback>{r.author?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                          {/* Reply header */}
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">{r.author}</span>
                                            <span>•</span>
                                            <span>{new Date(r.createdAt).toLocaleString()}</span>
                                          </div>

                                          {/* Reply content */}
                                          <p className="text-academic">{r.content} </p>

                                          {/* Reply Actions (Edit/Delete by author) */}
                                          <div className="flex gap-3 text-xs text-muted-foreground">
                                            {r.authorId === mockUser.id && (
                                              <>
                                                <button onClick={() => handleStartReplyEdit(c.id, r.id)}>Edit</button>
                                                <button onClick={() => handleDeleteReply(c.id, r.id)}>Delete</button>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}

                                  {/* Show Replies Button */}
                                  {c.replies.length > 0 && !c.showReplies && (
                                    <button
                                      className="text-sm text-blue-500 mt-1"
                                      onClick={() =>
                                        setComments((prev) =>
                                          prev.map((comment) =>
                                            comment.id === c.id ? { ...comment, showReplies: true } : comment
                                          )
                                        )
                                      }
                                    >
                                      Show {c.replies.length} replies
                                    </button>
                                  )}

                                  {/* Hide Replies Button */}
                                  {c.showReplies && c.replies.length > 0 && (
                                    <button
                                      className="text-sm text-blue-500 mt-1"
                                      onClick={() =>
                                        setComments((prev) =>
                                          prev.map((comment) =>
                                            comment.id === c.id ? { ...comment, showReplies: false } : comment
                                          )
                                        )
                                      }
                                    >
                                      Hide replies
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Reply Actions */}





                            </div>
                          </div>
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
            {/* Team */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Team Members</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {project.team.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Avatar><AvatarImage src={m.avatar} /><AvatarFallback>{m.name.charAt(0)}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-sm text-muted-foreground">{m.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader><CardTitle>Project Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><span className="font-medium">Subject:</span><span className="ml-2 text-muted-foreground">{project.subject}</span></div>
                <div><span className="font-medium">University:</span><span className="ml-2 text-muted-foreground">{project.university}</span></div>
                <div><span className="font-medium">Created:</span><span className="ml-2 text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</span></div>
                <div><span className="font-medium">Visibility:</span><Badge variant="outline" className="ml-2">{project.visibility}</Badge></div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {project.links.map((link, idx) => (
                  <Button key={idx} className="w-full" variant="outline" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />{link.name}
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {/* <DeleteProjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        projectTitle={"Test"}
        // onConfirm={handleDeleteComment}
      /> */}
      <Footer />
    </div>
  );
};

export default ProjectDetail;