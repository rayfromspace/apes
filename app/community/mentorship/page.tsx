"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Star, Clock, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  bio: string;
  expertise: string[];
  rating: number;
  reviews: number;
  experience: string;
  availability: string;
  hourlyRate: number;
  languages: string[];
  totalMentees: number;
}

const mentors: Mentor[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/mentors/sarah.jpg",
    title: "Senior Blockchain Developer",
    company: "Ethereum Foundation",
    bio: "Passionate about helping others learn blockchain development and Web3 technologies",
    expertise: ["Blockchain", "Smart Contracts", "DeFi", "Web3"],
    rating: 4.9,
    reviews: 124,
    experience: "8+ years",
    availability: "10 hours/week",
    hourlyRate: 150,
    languages: ["English", "Spanish"],
    totalMentees: 45,
  },
  // Add more mentors as needed
];

export default function Mentorship() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("find-mentor");

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesExpertise =
      expertiseFilter === "all" ||
      mentor.expertise.includes(expertiseFilter);

    return matchesSearch && matchesExpertise;
  });

  const handleRequestMentorship = (mentorId: string) => {
    // Add mentorship request logic here
    toast.success("Mentorship request sent successfully!");
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mentorship Program</h1>
          <p className="text-muted-foreground">
            Connect with experienced mentors in your field
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Become a Mentor</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Become a Mentor</DialogTitle>
              <DialogDescription>
                Share your expertise and help others grow
              </DialogDescription>
            </DialogHeader>
            {/* Add mentor application form here */}
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="find-mentor">Find a Mentor</TabsTrigger>
          <TabsTrigger value="my-mentorship">My Mentorship</TabsTrigger>
        </TabsList>

        <TabsContent value="find-mentor" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search mentors by name or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-1/2"
            />
            <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
                <SelectItem value="Blockchain">Blockchain</SelectItem>
                <SelectItem value="Smart Contracts">Smart Contracts</SelectItem>
                <SelectItem value="DeFi">DeFi</SelectItem>
                <SelectItem value="Web3">Web3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatar} />
                      <AvatarFallback>
                        {mentor.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{mentor.name}</CardTitle>
                      <CardDescription>
                        {mentor.title} at {mentor.company}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{mentor.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>
                        {mentor.rating} ({mentor.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{mentor.availability}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{mentor.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{mentor.totalMentees} mentees</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium">Languages</p>
                    <div className="flex gap-2 mt-1">
                      {mentor.languages.map((language) => (
                        <Badge key={language} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-lg font-semibold">
                    ${mentor.hourlyRate}/hour
                  </p>
                  <Button onClick={() => handleRequestMentorship(mentor.id)}>
                    Request Mentorship
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-mentorship">
          <Card>
            <CardHeader>
              <CardTitle>My Mentorship Journey</CardTitle>
              <CardDescription>
                Track your progress and manage your mentorship relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                You haven't started any mentorship relationships yet.
                Find a mentor to begin your learning journey!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
