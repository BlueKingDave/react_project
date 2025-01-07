import React, { useState } from 'react';
import './Cart.css'; // Create this file for cart-specific styling.

const Cart = ({ cartItems, removeFromCart, resetCart, itemCount, totalPrice }) => {
    const [showCartDetails, setShowCartDetails] = useState(false);

    const toggleCartDetails = () => {
        setShowCartDetails((prev) => !prev);
    };

    const formattedTotalPrice = Number(totalPrice || 0).toFixed(2);

    return (
        <div className="cart">
            <div
                onClick={toggleCartDetails}
                className="cart-icon"
                style={{ cursor: 'pointer' }}
                tabIndex="0"
                aria-expanded={showCartDetails}
                onKeyDown={(e) => e.key === 'Enter' && toggleCartDetails()}
            >
                🛒 Items: {itemCount}
            </div>
            <p>Total: ${formattedTotalPrice}</p>
            <button onClick={resetCart} className="reset-cart">
                Reset Cart
            </button>

            {showCartDetails && (
                <div className="cart-summary">
                    {Array.isArray(cartItems) && cartItems.length > 0 ? (
                        <>
                            <h3>Cart Details:</h3>
                            <ul>
                                {cartItems.map((item, index) => (
                                    <li key={index} className="cart-item">
                                        <button
                                            className="remove-one-button"
                                            onClick={() => removeFromCart(item.name)}
                                        >
                                            -
                                        </button>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-info">
                                            <p>{item.name}</p>
                                            <p>
                                                {item.quantity} x ${item.price.toFixed(2)} = $
                                                {item.totalPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>Your cart is empty!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;
