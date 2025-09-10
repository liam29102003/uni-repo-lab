import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectUpload from "./pages/ProjectUpload";
import ProjectEdit from "./pages/ProjectEdit";
import Universities from "./pages/Universities";
import Login from "./pages/Login";
import Forum from "./pages/Forum";
import ForumDetail from "./pages/ForumDetail";
import AskQuestion from "./pages/AskQuestion";
import JoinUniversity from "./pages/JoinUniversity";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Adminlayout from "./pages/admin/Adminlayout";
import UniversityDashboard from "./pages/UniversityDashboard";
import Profile from "./pages/Profile";
import StudentManagement from "./pages/StudentManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/edit" element={<ProjectEdit />} />
          <Route path="/upload" element={<ProjectUpload />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumDetail />} />
          <Route path="/forum/ask" element={<AskQuestion />} />
          <Route path="/join" element={<JoinUniversity />} />
          <Route path="/admin" element={<Adminlayout />} />
          <Route path="/university" element={<UniversityDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/student-management" element={<StudentManagement />} />
          <Route path="/login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
