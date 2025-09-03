from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.project_schema import ProjectCreate, ProjectResponse
from app.services.project_service import create_project, get_projects_by_user
from app.api.deps.user_deps import get_current_user
from app.models.user_model import User
project_router = APIRouter()
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from beanie import PydanticObjectId
from app.models.project_model import Project
# --- Create a new project ---
@project_router.post("/", response_model=ProjectResponse)
async def create_new_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user)
):
    return await create_project(project, str(current_user.id))

# --- Get current user's projects ---
@project_router.get("/me", response_model=List[Project])
async def get_my_projects(current_user: User = Depends(get_current_user)):
    try:
        # Convert string id to ObjectId if needed
        owner_id = PydanticObjectId(current_user.id)
        projects = await Project.find(Project.owner_id == owner_id).to_list()
        return projects
    except Exception as e:
        print("Error fetching projects:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
