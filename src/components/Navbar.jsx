import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ itemCount, totalPrice, resetCart, cartItems, removeFromCart }) => {
    const [showCartDetails, setShowCartDetails] = useState(false);

    const toggleCartDetails = () => {
        setShowCartDetails((prev) => !prev);
    };

    const formattedTotalPrice = Number(totalPrice || 0).toFixed(2);

    return (
        <nav className="navbar">
            {/* Logo Section */}
            <div className="navbar-logo">
                <h1>Jungle House</h1>
            </div>

            {/* Navigation Links */}
            <ul className="navbar-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>

            {/* Search Bar */}
            <div className="navbar-search">
                <input type="text" placeholder="Search plants..." />
                <button>Search</button>
            </div>

            {/* Cart Section */}
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

                {/* Cart Summary */}
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
                                                onClick={() => removeFromCart(item.name)} // same function
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
                                                    {item.quantity} x $
                                                    {item.price.toFixed(2)} = $
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
        </nav>
    );
};

export default Navbar;
