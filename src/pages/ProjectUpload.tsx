import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabase/supabaseClient';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  FileText,
  Image as ImageIcon,
  Code,
  Archive,
  Users,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const ProjectUpload: React.FC = () => {

  type User = {
    user_id: string;
    username: string;
    email: string;
    role: string;
    university?: string;
  };

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    subject: '',
    visibility: 'Public',
    tags: [] as string[],
    teamMembers: [] as User[], // 👈 use strong typing
    githubLink: '',
    demoLink: '',
    researchPaper: ''
  });


  const [newTag, setNewTag] = useState('');
  const [users, setUsers] = useState([]);
  // const [newTeamMember, setNewTeamMember] = useState("");
  const [newTeamMember, setNewTeamMember] = useState<User | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [search, setSearch] = useState("");

  const mockUser = {

    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student' as const
  };

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john.doe@university.edu' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@university.edu' },
    { id: '3', name: 'Alice Johnson', email: 'alice.johnson@university.edu' },
  ];


  // const subjects = [
  //   'Computer Science', 'Engineering', 'Mathematics', 'Physics',
  //   'Chemistry', 'Biology', 'Environmental Science', 'Business',
  //   'Economics', 'Psychology', 'History', 'Literature', 'Art & Design'
  // ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'files' | 'screenshots') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (type === 'files') {
      setUploadedFiles(prev => [...prev, ...files]);
    } else {
      setScreenshots(prev => [...prev, ...files]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'files' | 'screenshots') => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (type === 'files') {
        setUploadedFiles(prev => [...prev, ...files]);
      } else {
        setScreenshots(prev => [...prev, ...files]);
      }
    }
  };

  const removeFile = (index: number, type: 'files' | 'screenshots') => {
    if (type === 'files') {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setScreenshots(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !projectData.tags.includes(newTag.trim())) {
      setProjectData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProjectData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  async function getUsers() {
    const url = "http://localhost:8080/api/v1/users/users/basic";
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      return users; // list of user objects
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers(); // your remembered API call
        // Map API users → add role: "member"
        const withRoles = data.map((u: Omit<User, "role">) => ({
          ...u,
          role: "member",
        }));
        setUsers(withRoles);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  // Filter by username/email
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Add member
  const addTeamMember = () => {
    if (
      newTeamMember &&
      !projectData.teamMembers.some((m: any) => m.user_id === newTeamMember.user_id)
    ) {
      setProjectData({
        ...projectData,
        teamMembers: [
          ...projectData.teamMembers,
          {
            user_id: newTeamMember.user_id,
            username: newTeamMember.username,
            email: newTeamMember.email,
            role: "Member"
          }
        ],

      });
      setNewTeamMember(null);
      setSearch("");
    }
  };


  // Remove member
  const removeTeamMember = (userId: string) => {
    setProjectData({
      ...projectData,
      teamMembers: projectData.teamMembers.filter((m: User) => m.user_id !== userId),
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <ImageIcon className="w-4 h-4" />;
      case 'js':
      case 'ts':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
        return <Code className="w-4 h-4" />;
      case 'zip':
      case 'rar':
      case 'tar':
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'Public':
        return <Globe className="w-4 h-4" />;
      case 'University Only':
        return <Lock className="w-4 h-4" />;
      case 'Team Only':
        return <Eye className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getUploader = (): { _id: string; name: string; email: string; role: string, university: string } | null => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      const user = JSON.parse(storedUser);
      return {
        _id: user.user_id,
        name: user.username, // or user.name depending on your stored object
        email: user.email,
        role: "Owner",
        university: user.university      // fixed or dynamic if needed
      };
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      return null;
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      const formData = new FormData();
      const uploader = getUploader();



      // Basic info
      formData.append("title", projectData.title);
      formData.append("description", projectData.description);
      formData.append("subject", projectData.subject);
      formData.append("visibility", projectData.visibility);
      formData.append("tags", JSON.stringify(projectData.tags));
      formData.append("university", uploader.university); // Replace with actual university from user context

      // Team members — always include current user


      const teamArray = [
        uploader,
        ...projectData.teamMembers.map((member) => ({
          _id: member.user_id,
          name: member.username,
          email: member.email,
          role: "Member",
          // avatar: "/placeholder.svg",
        })),
      ];


      formData.append("team", JSON.stringify(teamArray));

      // Links
      const links = [
        { name: "GitHub Repository", url: projectData.githubLink },
        { name: "Live Demo", url: projectData.demoLink },
        { name: "Research Paper", url: projectData.researchPaper },
      ];
      formData.append("links", JSON.stringify(links));

      // Files
      uploadedFiles.forEach((file) => formData.append("files", file));
      screenshots.forEach((file) => formData.append("screenshots", file));

      // Call backend API
      const response = await fetch("http://localhost:8090/projects/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload project");

      const result = await response.json();
      alert("Project uploaded successfully! ID: " + result.id);

      // Navigate to project list page
      window.location.href = "/projects";

      // Reset form
      setProjectData({
        title: "",
        description: "",
        subject: "",
        visibility: "Public",
        tags: [],
        teamMembers: [],
        githubLink: "",
        demoLink: "",
        researchPaper: ""
      });
      setUploadedFiles([]);
      setScreenshots([]);
    } catch (error) {
      console.error(error);
      alert("Error uploading project");
    }
  };



  const [subjects, setSubjects] = useState<string[]>([]);
  const [manualSubject, setManualSubject] = useState("");
  const [useManualInput, setUseManualInput] = useState(false);


  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("http://localhost:8090/subjects");
        const data = await res.json();
        if (data?.subjects) {
          setSubjects(data.subjects);
        }
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    };

    fetchSubjects();
  }, []);

  const handleSelectChange = (value: string) => {
    if (value === "manual") {
      setUseManualInput(true);
      setProjectData((prev) => ({ ...prev, subject: "" }));
    } else {
      setUseManualInput(false);
      setProjectData((prev) => ({ ...prev, subject: value }));
    }
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSubject(e.target.value);
    setProjectData((prev) => ({ ...prev, subject: e.target.value }));
  };

  // image upload
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
 
    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      try {
        setUploading(true);
  
        const fileName = `${Date.now()}-${file.name}`;
  
        // Upload directly
        const { error } = await supabase.storage
          .from("dam_food")
          .upload(fileName, file);
  
        if (error) throw error;
  
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("dam_food")
          .getPublicUrl(fileName);
  
        console.log(publicUrlData.publicUrl);
        setImages([...images, publicUrlData.publicUrl]);
      } catch (err) {
        console.error("Upload failed:", err.message);
      } finally {
        setUploading(false);
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

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold heading-academic mb-2">
            Upload New Project
          </h1>
          <p className="text-xl text-academic">
            Share your innovative work with the global university community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Title *</label>
                    <Input
                      placeholder="Enter your project title..."
                      value={projectData.title}
                      onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <Textarea
                      placeholder="Describe your project, its goals, methodology, and key findings..."
                      value={projectData.description}
                      onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      {!useManualInput ? (
                        <Select
                          value={projectData.subject}
                          onValueChange={(value) => {
                            if (value === "manual") {
                              setUseManualInput(true);
                              setProjectData((prev) => ({ ...prev, subject: "" }));
                            } else {
                              setProjectData((prev) => ({ ...prev, subject: value }));
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject area" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                            <SelectItem value="manual">➕ Add new subject</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type="text"
                          placeholder="Enter new subject"
                          value={projectData.subject}
                          onChange={(e) =>
                            setProjectData((prev) => ({ ...prev, subject: e.target.value }))
                          }
                        />
                      )}
                    </div>

                    {/* Visibility */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Visibility *</label>
                      <Select
                        value={projectData.visibility}
                        onValueChange={(value) =>
                          setProjectData((prev) => ({ ...prev, visibility: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4" />
                              <span>Public - Visible to everyone</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Private">
                            <div className="flex items-center space-x-2">
                              <Lock className="w-4 h-4" />
                              <span>University Only - Your university students</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Team">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>Team Only - Only team members</span>
                            </div>
                          </SelectItem>
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
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add tags (e.g., React, Python, AI)..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {projectData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {projectData.tags.map((tag) => (
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
                  )}
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Add Team Member</label>

                    {/* Search input */}
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Enter username or email"
                      className="w-full p-2 border rounded"
                    />

                    {/* Search results dropdown */}
                    {search && (
                      <div className="mt-2 border rounded bg-white shadow max-h-40 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <div
                              key={user.user_id}
                              onClick={() => {
                                setNewTeamMember(user);
                                setSearch(`${user.username} (${user.email})`);
                              }}
                              className="p-2 hover:bg-muted cursor-pointer"
                            >
                              {user.username} ({user.email})
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">No users found</div>
                        )}
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={addTeamMember}
                      disabled={!newTeamMember}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  {/* Selected team members */}
                  {projectData.teamMembers.length > 0 && (
                    <div className="space-y-2">
                      {projectData.teamMembers.map((member: User) => (
                        <div
                          key={member.user_id}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <span>
                            {member.username} ({member.email})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTeamMember(member.user_id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* External Links */}
              <Card>
                <CardHeader>
                  <CardTitle>External Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub Repository</label>
                    <Input
                      placeholder="https://github.com/username/repository"
                      value={projectData.githubLink}
                      onChange={(e) => setProjectData(prev => ({ ...prev, githubLink: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Live Demo</label>
                    <Input
                      placeholder="https://your-demo-site.com"
                      value={projectData.demoLink}
                      onChange={(e) => setProjectData(prev => ({ ...prev, demoLink: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Research Paper / Documentation</label>
                    <Input
                      placeholder="https://link-to-paper.com"
                      value={projectData.researchPaper}
                      onChange={(e) => setProjectData(prev => ({ ...prev, researchPaper: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* File Upload Sidebar */}
            <div className="space-y-6">
              {/* Project Files */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, 'files')}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop files here or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileInput(e, 'files')}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</p>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(file.name)}
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index, 'files')}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Screenshots */}
              <Card>
                <CardHeader>
                  <CardTitle>Screenshots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, 'screenshots')}
                  >
                    <ImageIcon className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop images here or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      // onChange={(e) => handleFileInput(e, 'screenshots')}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('screenshot-upload')?.click()}
                    >
                      Choose Images
                    </Button>
                  </div>
                  {
                    images?.map((img)=>(
                      img && <img src={img} key={img} className='h-36 w-36' alt="uploaded image" />
                    ))
                  }

                  {screenshots.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Screenshots ({screenshots.length})</p>
                      {screenshots.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="w-4 h-4" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index, 'screenshots')}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getVisibilityIcon(projectData.visibility)}
                    <span className="text-sm font-medium">{projectData.visibility}</span>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Subject</p>
                    <p className="font-medium">{projectData.subject || 'Not selected'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Tags</p>
                    <p className="text-sm">{projectData.tags.length} tags added</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Team</p>
                    <p className="text-sm">{projectData.teamMembers.length + 1} members</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Files</p>
                    <p className="text-sm">{uploadedFiles.length + screenshots.length} files</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" asChild>
              <Link to="/projects">Cancel</Link>
            </Button>
            <Button type="submit" className="px-8">
              <Upload className="w-4 h-4 mr-2" />
              Upload Project
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectUpload;