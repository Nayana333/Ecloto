import React, { useState, useEffect } from 'react'

const products = [
  { id: 1, name: 'Laptop', price: 500 },
  { id: 2, name: 'Phone', price: 1000 },
  { id: 3, name: 'HeadPhone', price: 100 },
  { id: 4, name: 'Watch', price: 300 }
]

const freegift = { id: 99, name: 'wireless mouse', price: 0 }
const Threshold = 1000

const App = () => {
  const [cart, setCart] = useState([])
  const [quantities, setQuantity] = useState({})
  const [showGiftMessage, setShowGiftMessage] = useState(false)

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id)
    const qtyToAdd = quantities[product.id] || 1
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + qtyToAdd }
            : item
        )
      )
    } else {
      setCart([...cart, { ...product, qty: qtyToAdd }])
    }
  }

  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: qty > 0 ? qty : 1 } : item
      )
    )
  }

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0)

  useEffect(() => {
    const hasGift = cart.find((item) => item.id === freegift.id)
    if (subTotal >= Threshold && !hasGift) {
      setCart((prevCart) => [...prevCart, { ...freegift, qty: 1 }])
      setShowGiftMessage(true)
      setTimeout(() => setShowGiftMessage(false), 3000)
    }

    if (subTotal < Threshold && hasGift) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== freegift.id))
    }
  }, [subTotal])

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart App</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p>${product.price}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                className="px-2 bg-gray-300 rounded"
                onClick={() =>
                  setQuantity({
                    ...quantities,
                    [product.id]:
                      (quantities[product.id] || 1) - 1 > 1
                        ? (quantities[product.id] || 1) - 1
                        : 1
                  })
                }
              >
                -
              </button>
              <span>{quantities[product.id] || 1}</span>
              <button
                className="px-2 bg-gray-300 rounded"
                onClick={() =>
                  setQuantity({
                    ...quantities,
                    [product.id]: (quantities[product.id] || 1) + 1
                  })
                }
              >
                +
              </button>

              <button
                onClick={() => addToCart(product)}
                className="ml-auto px-4 py-1 bg-blue-600 text-white rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-2">Subtotal: ${subTotal}</div>
        <div className="bg-gray-200 h-3 rounded">
          <div
            className="bg-green-500 h-3 rounded"
            style={{
              width: `${Math.min((subTotal / Threshold) * 100, 100)}%`
            }}
          ></div>
        </div>
        {subTotal < Threshold ? (
          <p className="text-sm mt-1">
            Spend ${Threshold - subTotal} more to get a FREE Wireless Mouse!
          </p>
        ) : (
          <p className="text-sm text-green-600 mt-1">Free Gift Unlocked!</p>
        )}
      </div>

      {showGiftMessage && (
        <div className="text-green-600 mt-2">Free Gift Added</div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty 🛒</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 border-b"
            >
              <div>
                {item.name}
                {item.id === freegift.id && (
                  <span className="text-xs bg-yellow-300 px-1 ml-1 rounded">
                    Gift
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(item.id, parseInt(e.target.value))
                  }
                  className="w-12 border text-center"
                  disabled={item.id === freegift.id}
                />
                {item.id !== freegift.id && (
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
