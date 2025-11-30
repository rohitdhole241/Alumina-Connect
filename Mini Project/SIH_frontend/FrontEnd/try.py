from fastapi import FastAPI, HTTPException, Depends, status, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models
from models import User, Donation
from database import Base
from database import engine, SessionLocal, Base
from auth import bcrypt_context
from fastapi.responses import RedirectResponse
import os
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError


app = FastAPI()

models.Base.metadata.create_all(bind=engine)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

class Login(BaseModel):
    email: EmailStr
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", status_code=status.HTTP_200_OK)
async def read_firstpg(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login/", status_code=status.HTTP_200_OK)
async def read_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/signup/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("sign-up.html", {"request": request})


@app.post("/signup/", status_code=status.HTTP_201_CREATED)
async def create_user(request: Request, db: Session = Depends(get_db)):
    print("Request Content-Type:", request.headers.get("Content-Type"))
    try:
        form_data = await request.form()
        print("Received form data:", form_data)

        email = form_data.get("email")
        name = form_data.get("name")
        phone_number = form_data.get("phone_number")
        password = form_data.get("password")
        gender = form_data.get("gender")
        date_of_birth_str = form_data.get("date_of_birth")
        address = form_data.get("address")
        institute_name = form_data.get("institute_name")
        name_of_degree = form_data.get("name_of_degree")
        graduation_year_str = form_data.get("graduation_year")
        major_field_of_study = form_data.get("major_field_of_study")
        current_employer = form_data.get("current_employer")
        work_experience = form_data.get("work_experience")
        professional_field = form_data.get("professional_field")
        job_title = form_data.get("job_title")
        certificates = form_data.get("certificates")  # This will be the filename if a file was sent
        terms = form_data.get("terms")

        if not email or not name or not password or not gender:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Missing required fields")

        hashed_password = bcrypt_context.hash(password)
        db_user = User(
            email=email, name=name, phone_number=phone_number, password=hashed_password,
            gender=gender, date_of_birth=date_of_birth_str if date_of_birth_str else None,
            address=address, institute_name=institute_name, name_of_degree=name_of_degree,
            graduation_year=int(graduation_year_str) if graduation_year_str else None,
            major_field_of_study=major_field_of_study, current_employer=current_employer,
            work_experience=work_experience, professional_field=professional_field,
            job_title=job_title, certificates=certificates
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"msg": "User created successfully", "user_id": db_user.id}
        

    except HTTPException as e:
        db.rollback()
        raise e
    except IntegrityError as e:
        db.rollback()
        if "Duplicate entry" in str(e.orig):
            raise HTTPException(status_code=400, detail="Email already registered")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    except Exception as e:
        db.rollback()
        print(f"Error during signup: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/login/", status_code=status.HTTP_200_OK)
async def login_user(user: Login, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user or not bcrypt_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    return {"msg": "Login successful", "user_id": db_user.id}

@app.get("/signup/{user_id}", status_code=status.HTTP_200_OK)
async def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/alumniprofile/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("alumni-profile.html", {"request": request})

@app.get("/postredirect/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("post-redirect.html", {"request": request})

@app.get("/jobportal/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("job-portal.html", {"request": request})

@app.get("/donation/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("donation.html", {"request": request})

@app.post("/donation/")
async def create_donation(
    selected_fund: str = Form(...),
    donation_amount: float = Form(...),
    donor_name: str = Form(...),
    donor_email: str = Form(...),
    donor_phone: str = Form(...),
    donor_message: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    print(f"Received donation request: Fund={selected_fund}, Amount={donation_amount}, Name={donor_name}")
    try:
        new_donation = Donation(
            selected_fund=selected_fund,
            donation_amount=donation_amount,
            donor_name=donor_name,
            donor_email=donor_email,
            donor_phone=donor_phone,
            donor_message=donor_message
            # Consider adding a donation_date field: donation_date=date.today()
        )
        db.add(new_donation)
        db.commit()
        db.refresh(new_donation)
        print(f"Donation ID {new_donation.id} saved successfully.")

        # *** Return JSON on success ***
        return JSONResponse(
            status_code=status.HTTP_200_OK, # Or 201 CREATED if you prefer
            content={"message": "Donation received successfully!", "donation_id": new_donation.id}
        )

    except SQLAlchemyError as e: # Catch specific DB errors
        db.rollback() # Important: Rollback transaction on error
        print(f"Database error saving donation: {e}") # Log the error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not process donation due to a database error."
        )
    except Exception as e: # Catch any other unexpected errors
        db.rollback()
        print(f"Unexpected error saving donation: {e}") # Log the error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred."
        )
        

@app.get("/notification/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("notfication.html", {"request": request})

@app.get("/rajiv/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("rajiv.html", {"request": request})

@app.get("/newpost/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("new-post.html", {"request": request})

@app.get("/max-chatting-ui/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("max-chatting-ui.html", {"request": request})

@app.get("/chatting-ui/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("chatting-ui.html", {"request": request})

@app.get("/myprofile/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("my-profile.html", {"request": request})

@app.get("/payment-gateway/", status_code=status.HTTP_200_OK)
async def read_signup(request: Request):
    return templates.TemplateResponse("payment-gateway.html", {"request": request})

