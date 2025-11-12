import React, { useState, useEffect } from "react";

function Home() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [allCarts, setAllCarts] = useState({}); // { tableId: [cartItems] }
  const [paidAmount, setPaidAmount] = useState("");
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Fetch tables from backend
    fetch("http://127.0.0.1:8000/tables/")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error("Error fetching tables:", err));

    // Fetch menu items from backend
    fetch("http://127.0.0.1:8000/menu_items/")
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error("Error fetching menu items:", err));
  }, []);

  const cart = selectedTable ? allCarts[selectedTable?.id] || [] : [];

  const addFromMenu = (item) => {
    if (!selectedTable) return;
    console.log(selectedTable);

    const existingItem = cart.find((i) => i.item_name === item.name);
    let newCart;

    if (existingItem) {
      newCart = cart.map((i) =>
        i.item_name === item.name ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newCart = [
        ...cart,
        { item_name: item.name, price: parseFloat(item.price), quantity: 1 },
      ];
    }

    setAllCarts({ ...allCarts, [selectedTable.id]: newCart });
  };

  const changeQuantity = (itemName, delta) => {
    const existingItem = cart.find((i) => i.item_name === itemName);
    if (!existingItem) return;

    let newCart;
    if (existingItem.quantity + delta <= 0) {
      newCart = cart.filter((i) => i.item_name !== itemName);
    } else {
      newCart = cart.map((i) =>
        i.item_name === itemName ? { ...i, quantity: i.quantity + delta } : i
      );
    }

    setAllCarts({ ...allCarts, [selectedTable.id]: newCart });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = (type) => {
    if (!selectedTable || cart.length === 0) return;

    alert(
      `Table ${selectedTable.name} paid $${paidAmount || total} with ${type}`
    );

    // Clear cart for this table
    setAllCarts({ ...allCarts, [selectedTable.id]: [] });
    setPaidAmount("");
    setSelectedTable(null);
  };

  return (
    <div className="p-10">
      {!selectedTable ? (
        <div className="flex flex-wrap gap-4">
          {tables.map((table) => {
            const tableCart = allCarts[table.id] || [];
            const tableTotal = tableCart.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            return (
              <button
                key={table.id}
                className={`w-40 h-40 border-2 flex justify-center items-center
                  ${
                    tableTotal > 0
                      ? "bg-red-300 border-red-400"
                      : "bg-blue-300 border-blue-400"
                  }`}
                onClick={() => setSelectedTable(table)}
              >
                <div>
                  {table.name}
                  {tableTotal > 0 && (
                    <div className="text-sm mt-1">${tableTotal}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <button
            className="mb-4 text-blue-500 underline"
            onClick={() => setSelectedTable(null)}
          >
            &lt;- Back to tables
          </button>

          <h1 className="text-2xl font-bold mb-4">{selectedTable.name}</h1>

          <div className="flex gap-10">
            {/* Menu */}
            <div className="w-1/2 border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Menu</h2>
              <ul>
                {menuItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between py-1 cursor-pointer hover:bg-gray-100"
                    onClick={() => addFromMenu(item)}
                  >
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cart */}
            <div className="w-1/2 border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Cart</h2>
              {cart.length === 0 && <p>No items yet</p>}
              <ul>
                {cart.map((item) => (
                  <li
                    key={item.item_name}
                    className="flex justify-between py-1 items-center"
                  >
                    <span>{item.item_name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-red-500 text-white px-2 rounded"
                        onClick={() => changeQuantity(item.item_name, -1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="bg-green-500 text-white px-2 rounded"
                        onClick={() => changeQuantity(item.item_name, 1)}
                      >
                        +
                      </button>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-2 font-bold">Total: ${total}</p>

              {/* Payment */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="number"
                  placeholder={total}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="border rounded px-2 py-1 w-24"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => handlePayment("cash")}
                >
                  Cash
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded"
                  onClick={() => handlePayment("card")}
                >
                  Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
