import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Mail, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  interface LoginResponse {
  access_token: string;
  refresh_token: string;
  mongo_id: string;
  user_id: string;
}
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMsg("");

//     // Must use URLSearchParams for OAuth2PasswordRequestForm
//     const params = new URLSearchParams();
//     params.append("username", email); // backend uses username field for email
//     params.append("password", password);

//     try {
//           const response = await axios.post(
//       "http://127.0.0.1:8080/api/v1/auth/login",
//       params.toString(), // <-- make sure to stringify
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );


// const { access_token } = response.data as { access_token: string };
//       // Save access token
//       localStorage.setItem("access_token", access_token);

//       // Fetch user profile
//       const userResponse = await axios.get(
//         "http://127.0.0.1:8080/api/v1/users/me",
//         {
//           headers: { Authorization: `Bearer ${access_token}` },
//         }
//       );
//       localStorage.setItem("user", JSON.stringify(userResponse.data));

//       // Show success toast
//       toast({
//         title: "Login Successful",
//         description: "Welcome back to UniRepo!",
//       });
//       const userData = userResponse.data as { role: string };

//       // Navigate based on role
//       if (userData.role === 'student') {
//         navigate('/profile');
//       } else if (userData.role === 'uni') {
//         navigate('/university');
//       }

//     } catch (error: any) {
//       console.error("Login failed:", error.response?.data || error.message);
//       setErrorMsg(error.response?.data?.detail || "Login failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMsg("");

  try {
    // OAuth2PasswordRequestForm style
    const params = new URLSearchParams();
    params.append("username", email); // backend uses username for email
    params.append("password", password);

    // 1️⃣ Login
    const response = await axios.post(
      "http://127.0.0.1:8080/api/v1/auth/login",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, mongo_id,user_id  } = response.data as LoginResponse;
    // Store tokens
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    console.log("Full login response:", response.data);



    // 2️⃣ Get current user info
    const userResponse = await axios.get(
      "http://127.0.0.1:8080/api/v1/users/me",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

  const user = userResponse.data;
  localStorage.setItem("user", JSON.stringify(user)); // Save user info
  localStorage.setItem("user_id", user.user_id);
  localStorage.setItem("mongo_id", user.id);
  localStorage.setItem("role", user.role); // Store role for ProtectedRoute
    console.log("Fetched user data:", user);
    console.log("User ID:", user.user_id, "Mongo ID:", user.id);

    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.username}!`,
    });

    // Use setTimeout to ensure toast and state updates complete before redirect
    setTimeout(() => {
      console.log("User role:", user.role);
      if (user.role === "student") {
        navigate("/profile");
      } else if (user.role === "uni") {
        navigate("/university");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); // fallback
      }
    }, 100);
  } catch (err: any) {
    console.error("Login failed:", err.response?.data || err.message);
    setErrorMsg(err.response?.data?.detail || "Login failed");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold heading-academic mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your UniRepo account</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your university email to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>


              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Need help accessing your account?</p>
                  <p>Contact your university administrator for password reset or account issues.</p>
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:underline font-medium">
                Join as University
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 UniRepo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
