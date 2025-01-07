import React, { useState, useEffect } from 'react';
import logo from '../assets/JHlogo.png';
import './Navbar.css';
import Cart from './Cart.jsx'


const Navbar = ({ itemCount, totalPrice, resetCart, cartItems, removeFromCart }) => {
    const [showCartDetails, setShowCartDetails] = useState(false);

    const toggleCartDetails = () => {
        setShowCartDetails((prev) => !prev);
    };

    const formattedTotalPrice = Number(totalPrice || 0).toFixed(2);

    // Update document title when totalPrice changes
    useEffect(() => {
        document.title = `Jungle House: ${formattedTotalPrice}€ Purchases`;
    }, [formattedTotalPrice]);

    return (
        <nav className="navbar">
            {/* Logo Section */}
            <div className="navbar-logo">
                <img src={logo} alt="Jungle House" className="jh-logo" />
                <h1>Jungle House</h1>
                
                {[2, 3, 4, 5].includes(new Date().getMonth()) ? (
                    <p>Spring time baby <br />
                        Repot those plants
                    </p>
                ) : (
                    <p>No need to repot <br />
                         Spring is in {new Date().getMonth() < 2 ? "a few months" : "later this year"}
                    </p>
                )}
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
            <Cart
                itemCount={itemCount}
                totalPrice={totalPrice}
                resetCart={resetCart}
                cartItems={cartItems}
                removeFromCart={removeFromCart}
            />
        </nav>
    );
};

export default Navbar;
