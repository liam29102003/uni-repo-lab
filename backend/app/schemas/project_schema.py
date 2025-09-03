from typing import List, Optional
from pydantic import BaseModel

# --- Team Member schema ---
class TeamMember(BaseModel):
    id: str
    name: Optional[str] = None
    role: Optional[str] = None

# --- Base Project schema ---
class ProjectBase(BaseModel):
    title: str
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    university: Optional[str] = None
    tags: Optional[List[str]] = []
    technologies: Optional[List[str]] = []
    github_link: Optional[str] = None
    website_link: Optional[str] = None
    subject: Optional[str] = None
    university_year: Optional[str] = None
    team_members: Optional[List[TeamMember]] = []

# --- Create Project ---
class ProjectCreate(ProjectBase):
    subject: str
    university_year: str
    team_members: List[TeamMember]

# --- Response Schema ---
class ProjectResponse(ProjectBase):
    id: str
    thumbnail: Optional[str] = None
    source_files: Optional[List[str]] = []

    class Config:
        orm_mode = True
