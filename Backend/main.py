# main.py
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import Table, MenuItem , Cart , CartItems
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",  # your React dev server
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # allow these origins
    allow_credentials=True,
    allow_methods=["*"],         # allow all HTTP methods
    allow_headers=["*"],         # allow all headers
)

# Add a new table
@app.post("/tables/")
def create_table(name: str, db: Session = Depends(get_db)):
    table = Table(name=name)
    db.add(table)
    db.commit()
    db.refresh(table)
    return table

# Add a menu item
@app.post("/menu_items/")
def create_menu_item(name: str, price: float, db: Session = Depends(get_db)):
    item = MenuItem(name=name, price=price)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

# Get all tables
@app.get("/tables/")
def get_tables(db: Session = Depends(get_db)):
    return db.query(Table).all()

# Get all menu items
@app.get("/menu_items/")
def get_menu_items(db: Session = Depends(get_db)):
    return db.query(MenuItem).all()


@app.post("/carts/{table_id}")
def create_cart(table_id : int ,db: Session = Depends(get_db)):
    cart = db.query(Cart).filter_by(table_id=table_id, status="open").first()
    if not cart:
        newCart = Cart(table_id=table_id)
        db.add(newCart)
        db.commit()
        db.refresh(newCart)
        return{"message" : 'New cart Created'}
    
    else: 
        return{"message" : 'Cart have been Created'}