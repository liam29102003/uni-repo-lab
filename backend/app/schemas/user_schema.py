from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field
from fastapi import File, UploadFile, Form


class UserAuth(BaseModel):
    email: EmailStr = Field(..., description="user email")
    username: str = Field(..., min_length=5, max_length=50, description="user username")
    password: str = Field(..., min_length=5, max_length=24, description="user password")
    role: str = Field(..., description="user role")    

class UserOut(BaseModel):
    user_id: UUID
    username: str
    email: EmailStr
    disabled: Optional[bool] = False
    university: Optional[str] = None
    student_id: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None
    major: Optional[str] = None
    date_of_birth: Optional[str] = None
    github_link: Optional[str] = None
    description: Optional[str] = None
    profile_image: Optional[str] = None  # Add this line
    role: Optional[str] = None
    
    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    username: Optional[str]
    student_id: Optional[str]= None
    year: Optional[int]
    semester: Optional[int]= None
    major: Optional[str]= None
    date_of_birth: Optional[str]
    github_link: Optional[str]= None
    description: Optional[str]= None


    model_config = {"from_attributes": True}

class AdminUpdateUser(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None
    major: Optional[str] = None
    date_of_birth: Optional[str] = None
    github_link: Optional[str] = None
    description: Optional[str] = None
    university: Optional[str] = None
    role: Optional[str] = None  # Admin can change roles

    model_config = {"from_attributes": True}

