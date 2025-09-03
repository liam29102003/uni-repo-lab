from beanie import Document, PydanticObjectId
from pydantic import BaseModel
from typing import List, Optional

class TeamMember(BaseModel):
    id: str
    name: Optional[str] = None
    role: Optional[str] = None

class Project(Document):
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
    thumbnail: Optional[str] = None
    source_files: Optional[List[str]] = []
    owner_id: PydanticObjectId  # Use Beanie's ObjectId wrapper

    class Settings:
        name = "projects"

    class Config:
        arbitrary_types_allowed = True  # ← important for ObjectId
