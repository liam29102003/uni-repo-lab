import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import api from "@/utils/api"; // axios instance with baseURL

import { 
  Mail, GraduationCap, Edit, Save, Camera, FolderOpen, MessageSquare, ArrowUp, Calendar 
} from "lucide-react";

// User Data type
interface UserData {
  _id: string; // MongoDB ObjectId
  user_id: string; // UUID
  username: string;
  email: string;
  university: string;
  student_id: string;
  year: number;
  semester: number;
  major: string;
  date_of_birth: string;
  github_link: string;
  description: string;
  profile_image: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  university: string;
  subject: string;
  visibility: string;
  team: string;
  tags: string[];
  screenshots?: string[];
  files?: string[];
  links?: string[];
}


const Profile: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    student_id: "",
    year: 0,
    semester: 0,
    major: "",
    date_of_birth: "",
    github_link: "",
    description: "",
    profile_image: null as File | null,
    profile_preview: ""
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");


  // Fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem("access_token"); // ✅ make sure token is retrieved
    console.log("Token being sent:", token);

      if (!token) {
        navigate("/login");
        return;
      }
    try {
      const res = await axios.get<UserData>("http://127.0.0.1:8080/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = res.data;
      localStorage.setItem("user_id", userData.user_id); // store UUID
      console.log("User ID:", userData.user_id);

         // Fix image URL
      const imageUrl = userData.profile_image?.startsWith("http")
      ? userData.profile_image
      : `http://127.0.0.1:8080${userData.profile_image}`;

      setUser(userData);
      setFormData({
        username: userData.username || "",
        student_id: userData.student_id || "",
        year: userData.year || 0,
        semester: userData.semester || 0,
        major: userData.major || "",
        date_of_birth: userData.date_of_birth || "",
        github_link: userData.github_link || "",
        description: userData.description || "",
        profile_image: null,
        profile_preview: imageUrl || "",
      });

    
    } catch (err) {
      console.error(err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      navigate("/login");
      }
  };

// Fetch projects
  const fetchProjects = async (userId: string) => {
    if (!token || !userId) return;

    try {
      const res = await axios.get<Project[]>(`http://127.0.0.1:8090/projects/team/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  // Load user then projects
  useEffect(() => {
    const loadData = async () => {
      await fetchUserData();
      const userId = localStorage.getItem("user_id");
      if (userId) await fetchProjects(userId);
    };
    loadData();
  }, []);



  if (!user) return <div>Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
       [name]: name === "year" || name === "semester" ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        profile_image: file,
        profile_preview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

 const handleSubmit = async () => {
  const data = new FormData();
  data.append("username", formData.username);
  data.append("year", formData.year.toString());
  data.append("semester", formData.semester.toString());
  data.append("major", formData.major);
  data.append("date_of_birth", formData.date_of_birth);
  data.append("github_link", formData.github_link);
  data.append("description", formData.description);
  if (formData.profile_image) data.append("profile_image", formData.profile_image);

  try {
    const res = await axios.post("http://127.0.0.1:8080/api/v1/users/update", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const updatedUser = res.data;

    // Prepend backend URL for relative path
    const imageUrl = updatedUser.profile_image
  ? updatedUser.profile_image.startsWith("http")
    ? updatedUser.profile_image
    : `http://127.0.0.1:8080${updatedUser.profile_image}`
  : formData.profile_preview; // fallback to previous image if null

    setUser(updatedUser);
    setFormData((prev) => ({
      ...prev,
      profile_preview: imageUrl,
      profile_image: null, // reset file input
    }));


    alert("Profile updated!");
    setIsEditing(false);
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update profile.");
  }
};




  // Mock projects & Q&A
  const mockProjects = [
    { id: 1, name: "AI-Powered Study Assistant", description: "ML model for personalized study", year: "2024", subject: "ML", tags: ["Python", "TensorFlow", "React"] },
    { id: 2, name: "Blockchain Voting System", description: "Secure voting platform", year: "2023", subject: "Cryptography", tags: ["Solidity", "Web3"] }
  ];
  const mockQuestions = [
    { id: 1, title: "React state best practices?", year: "2024", tags: ["React"], upvotes: 24 }
  ];
  const mockAnswers = [
    { id: 1, title: "OAuth2 implementation", year: "2023", tags: ["Auth"], upvotes: 15 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={formData.profile_preview} alt={user.username} />
                  <AvatarFallback>{user.username.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 cursor-pointer bg-blue-100 p-2 rounded-full">
                    <Camera className="w-4 h-4 text-blue-700" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                    />
                  </label>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    {isEditing ? (
                      <Input value={formData.username} onChange={handleChange} name="username" className="text-2xl font-bold mb-2" />
                    ) : (
                      <h1 className="text-2xl font-bold">{user.username}</h1>
                    )}
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user.email}</span>
                      <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {user.university}</span>
                    </div>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={async () => isEditing ? await handleSubmit() : setIsEditing(true)}
                  >
                    {isEditing ? <><Save className="w-4 h-4 mr-2" /> Save</> : <><Edit className="w-4 h-4 mr-2" /> Edit Profile</>}
                  </Button>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                  <p className="font-medium">{user.student_id}</p>

                </div>

                {/* Details */}
                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[ "major", "year","semester", "date_of_birth"].map((field) => (
                    <div key={field}>
                      <label className="text-sm font-medium text-muted-foreground">{field.replace("_", " ")}</label>

                      {isEditing ? (
                        field === "date_of_birth" ? (
                          // Date picker for DOB
                          <Input
                            type="date"
                            value={(formData as any)[field]}
                            name={field}
                            onChange={handleChange}
                          />
                        ) : (
                          <Input
                            value={(formData as any)[field]}
                            name={field}
                            onChange={handleChange}
                          />
                        )
                      ) : (
                        <p className="font-medium">{(user as any)[field] || "Not set"}</p>
                      )}
                    </div>
                  ))}
                </div>


                <div>
                  <label className="text-sm font-medium text-muted-foreground">GitHub</label>
                  {isEditing ? <Input value={formData.github_link} name="github_link" onChange={handleChange} /> : 
                    <p className="text-sm text-blue-600 underline">
                      <a href={user.github_link} target="_blank">{user.github_link}</a>
                    </p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  {isEditing ? <Textarea value={formData.description} name="description" onChange={handleChange} rows={3} /> : <p className="text-sm">{user.description}</p>}
                </div>
              </div>
            </div>
          </Card>


          {/* Tabs */}
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
                {projects.length > 0 ? (
                  projects.map(project => (
                    <Card key={project.id} className="p-6 border shadow-sm hover:shadow-lg transition duration-200">
                      {/* Header: Title + Description */}
                      <div className="mb-4 bg-blue-100 p-4 rounded-md">
                        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{project.description}</p>
                      </div>

                      {/* Meta info: University, Subject, Visibility */}
                      <div className="flex flex-wrap justify-between items-center mb-4 bg-grey-100 p-3 rounded-md">
                        <div className="flex flex-col text-sm text-gray-600 space-y-1 ">
                          {/* <span><strong>University:</strong> {project.university}</span> */}
                          <span><strong>Subject:</strong> {project.subject}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-600 bg-green-100 px-3 py-1 rounded-full">
                          Visibility: <span className="font-bold text-green-700">{project.visibility}</span>
                        </div>
                        
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <Badge key={tag} className="bg-blue-100 text-blue-800 hover:text-yellow-50 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No projects found.</p>
                )}
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
