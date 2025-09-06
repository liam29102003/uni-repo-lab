import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Upload as UploadIcon,
  File,
  Image as ImageIcon,
  University,
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { useToast } from "@/components/ui/use-toast";

const ProjectEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const mockUser = {
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student" as const,
  };

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");

  const subjects = [
    "Computer Science",
    "Engineering",
    "Biology",
    "Physics",
    "Mathematics",
    "Chemistry",
    "Psychology",
    "Business",
    "Medicine",
    "Arts",
    "Literature",
    "History",
  ];

  // ✅ Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/projects/${id}`);
        const project = res.data;

        console.log("Fetched project data:", project);

        // Map links safely
        const links = project.links || [];
        const githubUrl = links.find((l: any) => l.name.toLowerCase() === "github")?.url || "";
        const demoUrl = links.find((l: any) => l.name.toLowerCase() === "demo")?.url || "";
        const paperUrl = links.find((l: any) => l.name.toLowerCase() === "paper")?.url || "";

        setFormData({
          title: project.title || "",
          description: project.description || "",
          subject: project.subject || "",
          tags: project.tags || [],
          visibility: project.visibility || "Public",
          githubUrl,
          demoUrl,
          paperUrl,
          team: project.team || [],
          university: project.university || "",
        });

        // If you need to debug updated formData, use a second useEffect:
        // console.log will show the correct value after state updates
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove),
    }));
  };

  const handleAddTeamMember = () => {
    if (newTeamMember.trim()) {
      console.log("Adding team member:", newTeamMember);
      setFormData(prev => ({
        ...prev,
        teamMembers: [...(prev.teamMembers || []), { name: newTeamMember.trim(), role: "Member" }]
      }));
      setNewTeamMember("");

    }
  };

  const handleRemoveTeamMember = (memberName: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m.name !== memberName)
    }));
  };

  // ✅ Submit to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/projects/${id}`, formData);

      toast({
        title: "Project Updated",
        description: "Your project changes were saved successfully.",
        variant: "default",
      });

      navigate(`/projects/${id}`);
    } catch (err) {
      console.error("Update failed", err);
      toast({
        title: "Update Failed",
        description: "Something went wrong while saving changes.",
        variant: "destructive",
      });
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading project...</p>
      </div>
    );
  }

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
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          handleInputChange("subject", value)
                        }
                      >
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
                      <Select
                        value={formData.visibility}
                        onValueChange={(value) => handleInputChange("visibility", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public">Public</SelectItem>
                          <SelectItem value="university">University Only</SelectItem>
                          <SelectItem value="Private">Team Only</SelectItem>
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
                    {formData.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
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
                      placeholder="Add a tag"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
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
                    {formData.team.map((member: { name: string; role?: string }) => (
                      <Badge
                        key={member.name}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {member.name} {member.role && `(${member.role})`}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveTeamMember(member.name)}
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
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTeamMember();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTeamMember}
                      variant="outline"
                    >
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
                      value={formData.githubUrl || ""}
                      onChange={(e) =>
                        handleInputChange("githubUrl", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demoUrl">Live Demo</Label>
                    <Input
                      id="demoUrl"
                      value={formData.demoUrl || ""}
                      onChange={(e) =>
                        handleInputChange("demoUrl", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="demoUrl">Research Paper</Label>
                    <Input
                      id="paperUrl"
                      value={formData.paperUrl || ""}
                      onChange={(e) =>
                        handleInputChange("paperUrl", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6"> {/* Files Management */} <Card>
              <CardHeader>
                <CardTitle>Files & Screenshots</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2"> Drag & drop files or click to browse </p> <Button
                    variant="outline" size="sm">
                    <File className="w-4 h-4 mr-2" /> Upload Files
                  </Button>
                </div>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2"> Add project screenshots </p> <Button variant="outline"
                    size="sm">
                    <ImageIcon className="w-4 h-4 mr-2" /> Upload Images
                  </Button>
                </div>
              </CardContent>
            </Card> {/* Current Files */} <Card>
                <CardHeader>
                  <CardTitle>Current Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 rounded border"> <span>main.py</span> <Button
                      variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button> </div>
                    <div className="flex items-center justify-between p-2 rounded border"> <span>requirements.txt</span> <Button
                      variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button> </div>
                    <div className="flex items-center justify-between p-2 rounded border"> <span>README.md</span> <Button
                      variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button> </div>
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
