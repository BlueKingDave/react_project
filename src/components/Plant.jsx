import React, { useState } from 'react';
import CareScale from './CareScale';
import './Plant.css';

const Plant = ({
    name,
    price,
    image,
    description,
    water,
    light,
    addToCart,
    removeFromCart,
    inCart,
    discount,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [feedback, setFeedback] = useState('');

    // Calculate discounted price if discount is true
    const discountedPrice = discount ? price * 0.85 : price;

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        alert(`Feedback submitted: ${feedback}`);
        setFeedback('');
    };

    const handleAddToCart = () => {
        if (quantity > 0) {
            addToCart(name, price, quantity); // Pass the original price (cart logic does discount)
            setShowDropdown(false);
        } else {
            alert('Please select a valid quantity.');
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleQuantityChange = (e) => {
        const selectedQuantity = parseInt(e.target.value, 10);
        if (selectedQuantity >= 0) {
            setQuantity(selectedQuantity);
        }
    };

    return (
        <div className="plant">
            <img src={image} alt={name} className="plant-image" />
            <div className="plant-content">
                <h3>{name}</h3>
                <p>{description}</p>
                {/* Original & discounted price */}
                <p className="price">
                    {discount && (
                        <span className="original-price">
                            ${price.toFixed(2)}
                        </span>
                    )}
                    <span className="discounted-price">
                        ${discountedPrice.toFixed(2)}
                    </span>
                </p>

                <div className="maintenance">
                    <CareScale careType="water" scaleValue={water} />
                    <CareScale careType="light" scaleValue={light} />
                </div>

                {/* Wrapper for Add/Remove and Dropdown */}
                <div className="add-to-cart-wrapper">
                    {/* Add to Cart Button */}
                    <button className="add-to-cart" onClick={toggleDropdown}>
                        Add to Cart
                    </button>

                    {/* Remove from Cart Button (if inCart) */}
                    {inCart && (
                        <button
                            className="remove-from-cart"
                            onClick={() => removeFromCart(name)}
                        >
                            -
                        </button>
                    )}

                    {/* Quantity Dropdown */}
                    {showDropdown && (
                        <div className="dropdown">
                            <label htmlFor={`quantity-${name}`}>Quantity:</label>
                            <select
                                id={`quantity-${name}`}
                                value={quantity}
                                onChange={handleQuantityChange}
                            >
                                {Array.from({ length: 11 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {i}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleAddToCart} className="confirm-button">
                                Confirm
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Feedback Section */}
            <div className="plant-feedback">
                <h4>Review that plant</h4>
                <form onSubmit={handleFeedbackSubmit}>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Write your feedback here..."
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Plant;
