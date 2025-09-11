import { useState, useEffect } from "react";
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
  Grid,
  List,
  Building,
  Globe,
  Mail,
} from "lucide-react";

const Universities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [universities, setUniversities] = useState<any[]>([]);

  // Fetch from backend
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch("http://localhost:8000/universities/");
        const data = await res.json();
        setUniversities(data);
      } catch (err) {
        console.error("Failed to fetch universities:", err);
      }
    };

    fetchUniversities();
  }, []);

  const categories = [
    { id: "all", label: "All Universities" },
    { id: "research", label: "Research Universities" },
    { id: "public", label: "Public Universities" },
    { id: "private", label: "Private Universities" },
  ];

  // Filtering logic
  // Filtering logic
  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch =
      uni.university_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.country.toLowerCase().includes(searchTerm.toLowerCase());

    const uniType = uni.type ? uni.type.toLowerCase() : "";

    // Normalize category selection
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "public" && uniType.includes("public")) ||
      (selectedCategory === "private" && uniType.includes("private")) ||
      (selectedCategory === "research" && uniType.includes("research"));

    return matchesSearch && matchesCategory;
  });

  const featuredUniversities = universities.filter((uni) => uni.featured);

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
            Explore leading universities worldwide and connect with their
            academic communities
          </p>
        </div>

        {/* Search + Filters */}
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
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
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

        {/* Tabs */}
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="browse">Browse All</TabsTrigger>
          </TabsList>

          {/* Featured */}
          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredUniversities.map((university) => (
                <Card
                  key={university.id}
                  className="hover:shadow-elegant transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {university.university_name}
                          </h3>
                          <Badge className="mt-1">Featured</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      {university.city}, {university.country}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {university.description || "No description available."}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">
                          {university.student_count?.toLocaleString() || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Students
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">
                          {university.founded || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">Founded</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">
                          {university.type || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">Type</p>
                      </div>
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

          {/* Browse All */}
          <TabsContent value="browse">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUniversities.map((university) => (
                  <Card
                    key={university.id}
                    className="hover:shadow-elegant transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {university.university_name}
                            </h3>
                            {university.featured && (
                              <Badge className="mt-1">Featured</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        {university.city}, {university.country}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {university.description || "No description available."}
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <p className="text-lg font-semibold">
                            {university.student_count?.toLocaleString() ||
                              "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Students
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold">
                            {university.founded || "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Founded
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold">
                            {university.type || "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">Type</p>
                        </div>
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
                  <Card
                    key={university.id}
                    className="hover:shadow-elegant transition-all duration-300"
                  >
                    <div className="p-6 flex justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {university.university_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {university.city}, {university.country}
                        </p>
                        <p className="text-sm mt-2">
                          {university.description ||
                            "No description available."}
                        </p>
                        <p className="text-sm mt-2">
                          <strong>Type:</strong> {university.type || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Students:</strong>{" "}
                          {university.student_count?.toLocaleString() || "N/A"}
                        </p>
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
                  </Card>
                ))}
              </div>
            )}

            {filteredUniversities.length === 0 && (
              <Card className="p-12 text-center">
                <Building className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No universities found
                </h3>
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
