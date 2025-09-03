import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, BookOpen } from 'lucide-react';

interface University {
  id: string;
  name: string;
  location: string;
  students: number;
  projects: number;
  logo?: string;
  ranking: number;
}

const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Massachusetts Institute of Technology',
    location: 'Cambridge, MA',
    students: 11520,
    projects: 1247,
    ranking: 1
  },
  {
    id: '2',
    name: 'Stanford University',
    location: 'Stanford, CA',
    students: 17380,
    projects: 1089,
    ranking: 2
  },
  {
    id: '3',
    name: 'Harvard University',
    location: 'Cambridge, MA',
    students: 23000,
    projects: 956,
    ranking: 3
  },
  {
    id: '4',
    name: 'California Institute of Technology',
    location: 'Pasadena, CA',
    students: 2240,
    projects: 789,
    ranking: 4
  },
  {
    id: '5',
    name: 'University of Oxford',
    location: 'Oxford, UK',
    students: 24000,
    projects: 834,
    ranking: 5
  },
  {
    id: '6',
    name: 'University of Cambridge',
    location: 'Cambridge, UK',
    students: 23000,
    projects: 723,
    ranking: 6
  }
];

const PartnerUniversities: React.FC = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold heading-academic mb-6">
            Partner Universities
          </h2>
          <p className="text-xl text-academic max-w-3xl mx-auto">
            Join a global network of prestigious universities sharing knowledge and fostering innovation together.
          </p>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockUniversities.map((university, index) => (
            <Card 
              key={university.id} 
              className="card-hover animate-fade-in bg-card border-border hover:border-primary/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      #{university.ranking}
                    </Badge>
                  </div>

                  {/* University Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {university.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{university.location}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center space-x-1 text-primary mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Students</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {university.students.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center space-x-1 text-secondary mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">Projects</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {university.projects.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold heading-academic mb-2">250+</div>
            <div className="text-muted-foreground">Universities</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold heading-academic mb-2">50K+</div>
            <div className="text-muted-foreground">Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold heading-academic mb-2">15K+</div>
            <div className="text-muted-foreground">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold heading-academic mb-2">80+</div>
            <div className="text-muted-foreground">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerUniversities;