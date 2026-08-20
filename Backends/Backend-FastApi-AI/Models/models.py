from sqlalchemy import String, Integer, Float, Column
from database import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer,primary_key=True)

    title = Column(String,index=True,nullable=False)

    author = Column(String,index=True)

    price = Column(Float,nullable=False)