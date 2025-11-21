# import os
# from datetime import datetime, timedelta
# from typing import Optional
# from fastapi import FastAPI

# from fastapi import APIRouter, HTTPException, Depends
# from pydantic import BaseModel, EmailStr
# from sqlalchemy import Column, Integer, String, create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base, Session
# from passlib.context import CryptContext
# from jose import jwt
# from dotenv import load_dotenv

# auth_app = FastAPI()

# load_dotenv()

# # =====================
# # CONFIG
# # =====================
# DATABASE_URL = "sqlite:///./users.db"
# SECRET_KEY = os.getenv("JWT_SECRET", "change_this_key_123")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# # =====================
# # DATABASE SETUP
# # =====================
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
# Base = declarative_base()


# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String)
#     email = Column(String, unique=True, index=True, nullable=False)
#     hashed_password = Column(String, nullable=False)


# Base.metadata.create_all(bind=engine)

# # =====================
# # SECURITY HELPERS
# # =====================
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# def get_password_hash(p):
#     return pwd_context.hash(p)


# def verify_password(p, hashed):
#     return pwd_context.verify(p, hashed)


# def create_access_token(data: dict):
#     expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     data.update({"exp": expire})
#     return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# def get_user_by_email(db: Session, email: str):
#     return db.query(User).filter(User.email == email).first()


# # =====================
# # REQUEST MODELS
# # =====================
# class SignupIn(BaseModel):
#     name: str
#     email: EmailStr
#     password: str


# class LoginIn(BaseModel):
#     email: EmailStr
#     password: str


# # =====================
# # ROUTER
# # =====================
# router = APIRouter()


# @router.post("/api/signup")
# def signup(data: SignupIn, db: Session = Depends(get_db)):
#     existing = get_user_by_email(db, data.email)
#     if existing:
#         raise HTTPException(400, "Email already registered")

#     user = User(
#         name=data.name,
#         email=data.email,
#         hashed_password=get_password_hash(data.password)
#     )
#     db.add(user)
#     db.commit()
#     db.refresh(user)

#     return {"ok": True, "message": "Signup successful"}


# @router.post("/api/login")
# def login(data: LoginIn, db: Session = Depends(get_db)):
#     user = get_user_by_email(db, data.email)
#     if not user or not verify_password(data.password, user.hashed_password):
#         raise HTTPException(401, "Invalid email or password")

#     token = create_access_token({"sub": str(user.id), "email": user.email})
#     return {"access_token": token, "token_type": "bearer"}


# import os
# from datetime import datetime, timedelta
# from typing import Optional

# from fastapi import FastAPI, HTTPException, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, EmailStr, Field
# from sqlalchemy import Column, Integer, String, create_engine
# from sqlalchemy.orm import declarative_base, sessionmaker, Session
# from passlib.context import CryptContext
# from jose import jwt
# from dotenv import load_dotenv

# load_dotenv()

# # =========================
# # CONFIG
# # =========================
# DATABASE_URL = "sqlite:///./users.db"
# SECRET_KEY = os.getenv("JWT_SECRET", "mysecretkey123")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# # =========================
# # DB
# # =========================
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
# Base = declarative_base()


# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String)


# Base.metadata.create_all(bind=engine)

# # =========================
# # PASSWORD SECURITY
# # =========================
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# def get_password_hash(password: str):
#     password = password[:72]  # bcrypt max length fix
#     return pwd_context.hash(password)


# def verify_password(password: str, hashed: str):
#     password = password[:72]  # verify fix
#     return pwd_context.verify(password, hashed)


# def create_access_token(data: dict):
#     expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     data.update({"exp": expire})
#     return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # =========================
# # REQUEST MODELS
# # =========================
# class SignupIn(BaseModel):
#     name: str
#     email: EmailStr
#     password: str = Field(..., min_length=6, max_length=30)  # limit added


# class LoginIn(BaseModel):
#     email: EmailStr
#     password: str


# # =========================
# # FASTAPI APP
# # =========================
# auth_app = FastAPI()

# auth_app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # =========================
# # ROUTES
# # =========================
# @auth_app.post("/api/signup")
# def signup(data: SignupIn, db: Session = Depends(get_db)):

#     # Check if email already in use
#     existing = db.query(User).filter(User.email == data.email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     # Create and save new user
#     hashed_pw = get_password_hash(data.password)
#     new_user = User(name=data.name, email=data.email, hashed_password=hashed_pw)

#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     return {"ok": True, "message": "Signup successful"}


# @auth_app.post("/api/login")
# def login(data: LoginIn, db: Session = Depends(get_db)):

#     user = db.query(User).filter(User.email == data.email).first()
#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid email or password")

#     if not verify_password(data.password, user.hashed_password):
#         raise HTTPException(status_code=401, detail="Invalid email or password")

#     token = create_access_token({"sub": str(user.id), "email": user.email})

#     return {"access_token": token, "token_type": "bearer"}


#---------------------------------------------------------------

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from database import User, get_db

router = APIRouter(prefix="/api", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "secret"
ALGORITHM = "HS256"

class SignupIn(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

def create_access_token(data):
    expire = datetime.utcnow() + timedelta(days=7)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
def signup(data: SignupIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        raise HTTPException(400, "Email already exists")

    hashed = pwd_context.hash(data.password)

    new_user = User(name=data.name, email=data.email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"ok": True, "message": "Signup successful"}

@router.post("/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}
