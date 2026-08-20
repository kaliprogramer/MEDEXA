from sqlalchemy.orm import Session
from models import Book
from schemas import BookCreate
from fastapi import HTTPException

def create_book(db: Session, book: BookCreate):
    new_book = Book(**book.model_dump())
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

def get_books(db: Session):
    return db.query(Book).all()

def get_book(db: Session, book_id: int):
    return db.query(Book).filter(Book.id == book_id).first()

def update_book(db: Session,
                book_id: int,
                book):
    db_book = db.query(Book).filter(Book.id == book_id).first()

    if db_book:

        db_book.title = book.title
        db_book.author = book.author
        db_book.price = book.price

        db.commit()
        db.refresh(db_book)

    return db_book


def delete_book(db: Session,
                book_id: int):

    book = db.query(Book).filter(Book.id == book_id).first()

    if book:
        db.delete(book)
        db.commit()

        return {"message":"Deleted"}
    else:
        raise HTTPException(status_code=404,
        detail="Book not found")