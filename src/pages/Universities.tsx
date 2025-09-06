import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  Search, 
  MapPin, 
  Users, 
  GraduationCap,
  ExternalLink,
  Filter,
  Grid,
  List,
  Building,
  Globe,
  Mail,
  Phone
} from "lucide-react";

const Universities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const mockUniversities = [
    {
      id: 1,
      name: "Massachusetts Institute of Technology",
      shortName: "MIT",
      logo: "/placeholder.svg",
      location: "Cambridge, Massachusetts, USA",
      description: "A private research university known for its programs in engineering, computer science, and physical sciences.",
      students: 11934,
      projects: 2847,
      departments: 32,
      founded: 1861,
      website: "https://mit.edu",
      email: "info@mit.edu",
      phone: "+1 617-253-1000",
      category: "research",
      featured: true,
      specialties: ["Engineering", "Computer Science", "Physics", "Mathematics", "Economics"]
    },
    {
      id: 2,
      name: "Stanford University",
      shortName: "Stanford",
      logo: "/placeholder.svg",
      location: "Stanford, California, USA",
      description: "A private research university known for its academic strength, wealth, and close proximity to Silicon Valley.",
      students: 17249,
      projects: 1892,
      departments: 18,
      founded: 1885,
      website: "https://stanford.edu",
      email: "info@stanford.edu",
      phone: "+1 650-723-2300",
      category: "research",
      featured: true,
      specialties: ["Computer Science", "Engineering", "Business", "Medicine", "Law"]
    },
    {
      id: 3,
      name: "University of California, Berkeley",
      shortName: "UC Berkeley",
      logo: "/placeholder.svg",
      location: "Berkeley, California, USA",
      description: "A public research university known for its academic excellence and social activism.",
      students: 45057,
      projects: 3156,
      departments: 40,
      founded: 1868,
      website: "https://berkeley.edu",
      email: "info@berkeley.edu",
      phone: "+1 510-642-6000",
      category: "public",
      featured: false,
      specialties: ["Engineering", "Computer Science", "Business", "Law", "Public Policy"]
    },
    {
      id: 4,
      name: "Harvard University",
      shortName: "Harvard",
      logo: "/placeholder.svg",
      location: "Cambridge, Massachusetts, USA",
      description: "A private Ivy League research university, the oldest institution of higher education in the United States.",
      students: 23731,
      projects: 1654,
      departments: 28,
      founded: 1636,
      website: "https://harvard.edu",
      email: "info@harvard.edu",
      phone: "+1 617-495-1000",
      category: "research",
      featured: true,
      specialties: ["Medicine", "Law", "Business", "Liberal Arts", "Public Health"]
    },
    {
      id: 5,
      name: "University of Toronto",
      shortName: "U of T",
      logo: "/placeholder.svg",
      location: "Toronto, Ontario, Canada",
      description: "A public research university known for its research and innovation across multiple disciplines.",
      students: 97000,
      projects: 4231,
      departments: 45,
      founded: 1827,
      website: "https://utoronto.ca",
      email: "info@utoronto.ca",
      phone: "+1 416-978-2011",
      category: "public",
      featured: false,
      specialties: ["Medicine", "Engineering", "Arts & Science", "Business", "Education"]
    },
    {
      id: 6,
      name: "ETH Zurich",
      shortName: "ETH",
      logo: "/placeholder.svg",
      location: "Zurich, Switzerland",
      description: "A public research university known for science, technology, engineering and mathematics.",
      students: 22200,
      projects: 1876,
      departments: 16,
      founded: 1855,
      website: "https://ethz.ch",
      email: "info@ethz.ch",
      phone: "+41 44 632 11 11",
      category: "research",
      featured: false,
      specialties: ["Engineering", "Computer Science", "Mathematics", "Physics", "Chemistry"]
    }
  ];

  const categories = [
    { id: "all", label: "All Universities" },
    { id: "research", label: "Research Universities" },
    { id: "public", label: "Public Universities" },
    { id: "private", label: "Private Universities" }
  ];

  const filteredUniversities = mockUniversities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || uni.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredUniversities = mockUniversities.filter(uni => uni.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Discover Universities
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore leading universities worldwide and connect with their academic communities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities, locations, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="browse">Browse All</TabsTrigger>
          </TabsList>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredUniversities.map((university) => (
                <Card key={university.id} className="hover:shadow-elegant transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{university.shortName}</h3>
                          <Badge className="mt-1">Featured</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">{university.name}</h4>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      {university.location}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {university.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">{university.students.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{university.projects.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Projects</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{university.departments}</p>
                        <p className="text-xs text-muted-foreground">Departments</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {university.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {university.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{university.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <Button className="w-full">
                      View University
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="browse">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUniversities.map((university) => (
                  <Card key={university.id} className="hover:shadow-elegant transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{university.shortName}</h3>
                            {university.featured && <Badge className="mt-1">Featured</Badge>}
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">{university.name}</h4>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        {university.location}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {university.description}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <p className="text-lg font-semibold">{university.students.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Students</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{university.projects.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Projects</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{university.departments}</p>
                          <p className="text-xs text-muted-foreground">Departments</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {university.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {university.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{university.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button className="w-full">
                        View University
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUniversities.map((university) => (
                  <Card key={university.id} className="hover:shadow-elegant transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building className="w-8 h-8 text-primary" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{university.name}</h3>
                              {university.featured && <Badge>Featured</Badge>}
                            </div>
                            
                            <div className="flex items-center gap-1 text-muted-foreground mb-3">
                              <MapPin className="w-4 h-4" />
                              {university.location}
                            </div>
                            
                            <p className="text-muted-foreground mb-4 max-w-2xl">
                              {university.description}
                            </p>
                            
                            <div className="flex items-center gap-6 mb-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{university.students.toLocaleString()} students</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{university.projects.toLocaleString()} projects</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{university.departments} departments</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {university.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button>
                            View University
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Globe className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {filteredUniversities.length === 0 && (
              <Card className="p-12 text-center">
                <Building className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No universities found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse all universities
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Universities;