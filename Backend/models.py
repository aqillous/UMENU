# models.py
from sqlalchemy import Column, Integer, String, DECIMAL, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class Table(Base):
    __tablename__ = "tables"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(DECIMAL(10,2), nullable=False)

class Cart(Base):
    __tablename__ = "carts"
    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    status = Column(Enum("open", "paid", name="order_status"), default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    table = relationship("Table")
    items = relationship("CartItems", back_populates="order")

class CartItems(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    quantity = Column(Integer, default=1)
    price = Column(DECIMAL(10,2), nullable=False)  # price at order time

    order = relationship("Cart", back_populates="items")
    menu_item = relationship("MenuItem")

