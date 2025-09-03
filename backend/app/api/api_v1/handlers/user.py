from fastapi import APIRouter, HTTPException, status
from app.schemas.user_schema import UserAuth, UserOut, UserUpdate, AdminUpdateUser
from fastapi import Depends
from app.services.user_service import UserService
import pymongo
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from uuid import uuid4
import os
from beanie import PydanticObjectId
from typing import Optional
from typing import List
import csv
from io import StringIO
from uuid import UUID





user_router = APIRouter()

@user_router.post('/create', summary="Create new user", response_model=UserOut)
async def create_user(data: UserAuth):
    try:
        return await UserService.create_user(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exist"
        )
  
@user_router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    default_password: str = Form("unistudent")  # accept from frontend
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format")

    contents = await file.read()
    decoded = contents.decode("utf-8").splitlines()
    reader = csv.DictReader(decoded)

    added_users = []
    skipped_rows = []

    for idx, row in enumerate(reader, start=1):
        email = row.get("email")
        username = row.get("username")

        if not email or not username:
            skipped_rows.append({"row": idx, "reason": "Missing email or username"})
            continue

        user_data = UserAuth(
            username=username,
            email=email,
            password=default_password,
            role="student"
        )

        try:
            user = await UserService.create_user(user_data)
            added_users.append(user)
        except Exception as e:
            skipped_rows.append({"row": idx, "reason": str(e)})

    return {"added": added_users, "skipped": skipped_rows}


@user_router.get('/me', summary='Get details of currently logged in user', response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return user


@user_router.get("", summary="Get all users", response_model=List[UserOut])
async def get_all_users():
    users = await User.find_all().to_list()
    return users


@user_router.post('/update', summary='Update User', response_model=UserOut)
async def update_user(
    student_id: Optional[str] = Form(None),
    year: Optional[int] = Form(None),
    semester: Optional[int] = Form(None),
    major: Optional[str] = Form(None),
    date_of_birth: Optional[str] = Form(None),
    github_link: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    profile_image: Optional[UploadFile] = File(None),
    user: User = Depends(get_current_user)
):
    update_data = {
        "student_id": student_id,
        "year": year,
        "major": major,
        "semester": semester,
        "date_of_birth": date_of_birth,
        "github_link": github_link,
        "description": description,
        "username": username
    }

    # Remove unset fields
    update_data = {k: v for k, v in update_data.items() if v is not None}

    # Handle image upload
    if profile_image:
        file_extension = profile_image.filename.split(".")[-1]
        filename = f"{uuid4()}.{file_extension}"
        upload_dir = "app/static/profile_pics"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, filename)

        with open(file_path, "wb") as f:
            f.write(await profile_image.read())

        # Save file path in DB (adjust if you're using full URL)
        update_data["profile_image"] = f"/static/profile_pics/{filename}"


    try:
        return await UserService.update_user(user.user_id, update_data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist"
        )
    


def ensure_admin(current_user: User):
    if current_user.role != "uni":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

@user_router.put("/admin/edit/{user_id}", response_model=UserOut, summary="Admin edits a user")
async def admin_edit_user(
    user_id: UUID,
    username: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    year: Optional[int] = Form(None),
    semester: Optional[int] = Form(None),
    current_user: User = Depends(get_current_user),
):
    # Ensure the current user is an admin
    ensure_admin(current_user)

    # Collect only the provided fields
    update_data = {k: v for k, v in locals().items() if k not in ["user_id", "current_user"] and v is not None}

    # Update user in DB
    try:
        updated_user = await UserService.update_user(user_id, update_data)
        return updated_user
    except pymongo.errors.OperationFailure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")



@user_router.delete("/admin/delete/{user_id}", summary="Admin deletes a user")
async def admin_delete_user(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)
    try:
        await UserService.delete_user(user_id)
        return {"detail": f"User {user_id} deleted successfully"}
    except pymongo.errors.OperationFailure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

@user_router.post("/admin/reset-password/{user_id}", summary="Admin resets a user's password")
async def admin_reset_password(
    user_id: UUID,
    new_password: str = Form(...),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)
    try:
        await UserService.reset_password(user_id, new_password)
        return {"detail": "Password has been reset successfully"}
    except pymongo.errors.OperationFailure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")