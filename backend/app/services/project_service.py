from typing import List
from bson import ObjectId
from app.models.project_model import Project
from app.schemas.project_schema import ProjectCreate, ProjectResponse

# --- Create a new project ---
async def create_project(project_data: ProjectCreate, owner_id: str) -> ProjectResponse:
    project = Project(**project_data.dict(), owner_id=ObjectId(owner_id))
    await project.insert()
    return ProjectResponse(**project.dict(), id=str(project.id))

# --- Get all projects for a specific user ---
async def get_projects_by_user(owner_id: str) -> List[ProjectResponse]:
    projects = await Project.find(Project.owner_id == ObjectId(owner_id)).to_list()
    return [ProjectResponse(**p.dict(), id=str(p.id)) for p in projects]
