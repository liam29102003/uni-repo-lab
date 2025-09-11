import { useEffect, useState } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageSquare, TrendingUp, Calendar, User, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Forum = () => {
      const university = JSON.parse(localStorage.getItem('user'))?.university
      // console.log(university)
      const navigate = useNavigate()
      const [searchQuery, setSearchQuery] = useState("");
      const [filter, setFilter ] = useState([])
      const [visibility , setVisibility ] = useState("Public")

      const [forums, setForums] = useState([]);
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);

      const toggleFilter = (value:any) => {
        setFilter((prev) =>
          prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
        );
      };

      const fetchForums = async () => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      search: searchQuery || "",
      visibility: visibility || "",
      university
    });

      // Add filters (array)
      filter.forEach(f => params.append("filters", f));

      const response = await fetch(`http://localhost:8000/api/questions?${params.toString()}`);
      const data = await response.json();
      console.log(data)
      setForums(data.forums);
      if(page > totalPages){
        setPage(1)
      }
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching forums:", error);
    }
  };
      useEffect(()=>{
          fetchForums();
      },[page,filter, visibility,searchQuery])
  


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
              <Button className="w-fit" onClick={()=>navigate('/forum/ask')}>
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
              <TabsTrigger value="public" className="flex items-center gap-2" onClick={()=>setVisibility("Public")}>
                <MessageSquare className="w-4 h-4" />
                Public Forum
              </TabsTrigger>
              <TabsTrigger value="university" className="flex items-center gap-2" onClick={()=>setVisibility("University Only")}>
                <User className="w-4 h-4" />
                My University
              </TabsTrigger>
            </TabsList>

            <TabsContent value="public">
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                 <Button
        variant="outline"
        className={`${filter.includes("mostPopular") && "bg-blue-200"}`}
        size="sm"
        onClick={() => toggleFilter("mostPopular")}
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Most Popular
      </Button>

      <Button
        variant="outline"
        className={`${filter.includes("recent") && "bg-blue-200"}`}
        size="sm"
        onClick={() => toggleFilter("recent")}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Recent
      </Button>

      <Button
        variant="outline"
        className={`${filter.includes("unanswered") && "bg-blue-200"}`}
        size="sm"
        onClick={() => toggleFilter("unanswered")}
      >
        Unanswered
      </Button>
                  {/* <Button variant="outline" size="sm">JavaScript</Button>
                  <Button variant="outline" size="sm">Python</Button>
                  <Button variant="outline" size="sm">AI/ML</Button> */}
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {forums?.map((question) => (
                    <Card key={question.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground hover:text-primary" onClick={()=>navigate(`/forum/${question?.id}`)}>
                              {question.title}
                            </h3>
                            {question.isResolved && (
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
                           <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-gray-500 text-foreground line-clamp-3 text-justify">
                              {question?.description}
                            </h3>
                            
                          </div>
                          
                          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground mt-3">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {question.author} 
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {
                                new Date(question.createdAt).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                               
                                              })
                              }
                              
                            </span>
                            </div>
                            <div>
                              Last Active: {question?.lastActive}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-4 ml-6">
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <ArrowUp className="w-4 h-4" />
                              <span className="font-medium">{question?.upvotes}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-3">votes </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <ArrowDown className="w-4 h-4" />
                              <span className="font-medium">{question?.downvotes}</span>
                            </div>
                            {/* <div className="text-xs text-muted-foreground">downvotes </div> */}
                          </div>
                          
                          <div className="text-center">
                            <div className="text-sm font-medium">{question?.replies}</div>
                            <div className="text-xs text-muted-foreground">answers</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                   {/* Pagination Controls */}
                  {
                    forums.length > 0 ?(
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                          disabled={page === 1}
                          onClick={() => setPage(p => p - 1)}
                          className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300 font-medium"
                        >
                          Prev
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                          disabled={page === totalPages}
                          onClick={() => setPage(p => p + 1)}
                          className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300 font-medium"
                        >
                          Next
                        </button>
                  </div>
                    ):(
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Public Forum</h3>
                        <p className="text-muted-foreground mb-6">
                          No forums data yet!
                        </p>
                      </div>
                            )
                          }
                </div>
              </div>
            </TabsContent>

            <TabsContent value="university">
              <div className="text-center py-12">
                {/* <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">University Forum</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with students from your university. Login to access university-specific discussions.
                </p>
                <Button>Login to Continue</Button> */}
                 <div className="space-y-4">
                  {forums?.map((question) => (
                    <Card key={question.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground hover:text-primary" onClick={()=>navigate(`/forum/${question?.id}`)}>
                              {question.title}
                            </h3>
                            {question.isResolved && (
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
                           <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-gray-500 text-foreground line-clamp-3 text-justify">
                              {question?.description}
                            </h3>
                            
                          </div>
                          
                          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground mt-3">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {question.author} • {university}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {
                                new Date(question.createdAt).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                               
                                              })
                              }
                              
                            </span>
                            </div>
                            <div>
                              Last Active: {question?.lastActive}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-4 ml-6">
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <ArrowUp className="w-4 h-4" />
                              <span className="font-medium">{question?.upvotes}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-3">votes </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <ArrowDown className="w-4 h-4" />
                              <span className="font-medium">{question?.downvotes}</span>
                            </div>
                            {/* <div className="text-xs text-muted-foreground">downvotes </div> */}
                          </div>
                          
                          <div className="text-center">
                            <div className="text-sm font-medium">{question?.replies}</div>
                            <div className="text-xs text-muted-foreground">answers</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                   {/* Pagination Controls */}
                  {
                    forums.length > 0 ?(
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                          disabled={page === 1}
                          onClick={() => setPage(p => p - 1)}
                          className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300 font-medium"
                        >
                          Prev
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                          disabled={page === totalPages}
                          onClick={() => setPage(p => p + 1)}
                          className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300 font-medium"
                        >
                          Next
                        </button>
                  </div>
                    ):(
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-6">
                          No forums data yet!
                        </p>
                      </div>
                            )
                          }
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

export default Forum;