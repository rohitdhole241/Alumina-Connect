from sqlalchemy import Column, Integer, String, Date, Enum
from enum import Enum as PyEnum
from database import Base
from sqlalchemy import Column, Integer, String, Text, Float 

class GenderEnum(PyEnum):
    Male = "Male"
    Female = "Female"
    Other = "Other" 

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(50), unique=True)
    name = Column(String(50))
    phone_number = Column(String(15))
    password = Column(String(100))
    gender = Column(Enum(GenderEnum), nullable=False)
    date_of_birth = Column(Date)
    address = Column(String(500))
    institute_name = Column(String(200))
    name_of_degree = Column(String(150))
    graduation_year = Column(Integer)
    major_field_of_study = Column(String(100))
    current_employer = Column(String(100))
    work_experience = Column(String(100))
    professional_field = Column(String(100))
    job_title = Column(String(100))
    certificates = Column(String(500))

class Donation(Base):
    __tablename__ = 'donation'
    
    donation_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    selected_fund = Column(String(100), nullable=False)
    donation_amount = Column(Float, nullable=False)
    donor_name = Column(String(100), nullable=False)
    donor_email = Column(String(100), nullable=False)
    donor_phone = Column(String(15), nullable=False)
    donor_message = Column(Text)