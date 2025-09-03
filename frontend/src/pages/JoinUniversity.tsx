import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Users,
  BookOpen,
  CheckCircle,
  Upload,
  FileText,
  Award,
  MapPin
} from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const JoinUniversity: React.FC = () => {
  const [formData, setFormData] = useState({
    universityName: '',
    officialEmail: '',
    website: '',
    country: '',
    city: '',
    contactPersonName: '',
    contactPersonTitle: '',
    contactPersonPhone: '',
    description: '',
    studentCount: '',
    established: '',
    type: '',
    accreditation: ''
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);

  const mockUser = {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'admin' as const
  };

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Netherlands', 'Sweden', 'Denmark', 'Switzerland',
    'Japan', 'Singapore', 'South Korea', 'China', 'India', 'Brazil'
  ];

  const universityTypes = [
    'Public Research University',
    'Private Research University',
    'Public Liberal Arts College',
    'Private Liberal Arts College',
    'Community College',
    'Technical Institute',
    'Graduate School',
    'Specialized Institution'
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: 'Global Collaboration',
      description: 'Connect with students and faculty from partner universities worldwide'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
      title: 'Knowledge Sharing',
      description: 'Access to thousands of academic projects and research papers'
    },
    {
      icon: <Award className="w-6 h-6 text-purple-500" />,
      title: 'Academic Recognition',
      description: 'Showcase your institution\'s innovative projects and achievements'
    },
    {
      icon: <Globe className="w-6 h-6 text-amber-500" />,
      title: 'Research Network',
      description: 'Join a growing network of educational institutions and researchers'
    }
  ];

  const requirements = [
    'Official university email domain',
    'Accreditation documentation',
    'Letter of authorization from university administration',
    'Valid contact information for verification',
    'Institutional website with academic programs listed'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedDocuments(prev => [...prev, ...files]);
    }
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('University Registration:', formData);
    console.log('Documents:', uploadedDocuments);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold heading-academic mb-4">
            Join UniRepo Network
          </h1>
          <p className="text-xl text-academic max-w-3xl mx-auto">
            Connect your university to the global academic community and unlock collaborative opportunities for your students and faculty
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">Why Join UniRepo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* University Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    University Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Official University Name *</label>
                    <Input
                      placeholder="Enter the full official name of your university..."
                      value={formData.universityName}
                      onChange={(e) => setFormData(prev => ({ ...prev, universityName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Official Email Domain *</label>
                      <Input
                        placeholder="admin@university.edu"
                        type="email"
                        value={formData.officialEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, officialEmail: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">University Website *</label>
                      <Input
                        placeholder="https://www.university.edu"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Country *</label>
                      <Select value={formData.country} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <Input
                        placeholder="City name"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Established Year</label>
                      <Input
                        placeholder="1990"
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        value={formData.established}
                        onChange={(e) => setFormData(prev => ({ ...prev, established: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">University Type *</label>
                      <Select value={formData.type} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {universityTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Student Population</label>
                      <Input
                        placeholder="e.g., 15000"
                        type="number"
                        value={formData.studentCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, studentCount: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">University Description *</label>
                    <Textarea
                      placeholder="Provide a brief description of your university, its mission, notable programs, and research focus areas..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Accreditation Details</label>
                    <Input
                      placeholder="List your primary accreditation bodies and certifications"
                      value={formData.accreditation}
                      onChange={(e) => setFormData(prev => ({ ...prev, accreditation: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Person */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Primary Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Person Name *</label>
                      <Input
                        placeholder="Full name of authorized representative"
                        value={formData.contactPersonName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPersonName: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Title/Position *</label>
                      <Input
                        placeholder="e.g., Dean, Director of IT, Vice President"
                        value={formData.contactPersonTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPersonTitle: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      type="tel"
                      value={formData.contactPersonPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPersonPhone: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Required Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload required documents (PDF, DOC, DOCX)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('document-upload')?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>

                  {uploadedDocuments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Uploaded Documents ({uploadedDocuments.length})</p>
                      {uploadedDocuments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Process */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm">Submit Application</p>
                      <p className="text-xs text-muted-foreground">Complete this form with all required information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm">Verification Process</p>
                      <p className="text-xs text-muted-foreground">Our team will verify your university credentials</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm">Setup & Training</p>
                      <p className="text-xs text-muted-foreground">Get onboarded and trained on the platform</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-sm">Go Live</p>
                      <p className="text-xs text-muted-foreground">Start collaborating with the global network</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{requirement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Have questions about joining UniRepo? Our support team is here to help.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>partnerships@unirepo.edu</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="font-semibold">Ready to Join UniRepo?</h3>
                <p className="text-sm text-muted-foreground">
                  By submitting this application, you agree to our terms of service and partnership agreement.
                </p>
              </div>
              <div className="flex space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/">Cancel</Link>
                </Button>
                <Button type="submit" className="px-8">
                  <Building2 className="w-4 h-4 mr-2" />
                  Submit Application
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default JoinUniversity;