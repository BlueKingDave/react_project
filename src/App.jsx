import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PlantList from './components/PlantList';
import ConnectWallet from './components/ConnectWallet';
import './App.css';

const App = () => {
    const [cart, setCart] = useState({
        items: [],
        totalPrice: 0,
    });
    const [discount, setDiscount] = useState(false);
    const [favicon, setFavicon] = useState('/assets/JHlogo.png'); // Default favicon

    // Function to update favicon dynamically
    useEffect(() => {
        const updateFavicon = (iconUrl) => {
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/png';
            link.rel = 'icon';
            link.href = iconUrl;
            document.head.appendChild(link);
        };

        updateFavicon(favicon);
    }, [favicon]);

    // Update favicon based on cart state (example logic)
    useEffect(() => {
        if (cart.totalPrice > 100) {
            setFavicon('/assets/high-cart-logo.png'); // Change to a specific logo if cart total > 100
        } else if (discount) {
            setFavicon('/assets/discount-logo.png'); // Change to a discount-specific logo
        } else {
            setFavicon('/assets/JHlogo.png'); // Default logo
        }
    }, [cart.totalPrice, discount]);

    // Add items to the cart
    const addToCart = (name, price, quantity, image) => {
        if (!name || !price || !quantity || isNaN(price) || isNaN(quantity)) {
            console.error("Invalid name, price, or quantity:", { name, price, quantity });
            return;
        }

        const finalPrice = Number(discount ? price * 0.85 : price); // Apply 15% discount if eligible
        const itemTotalPrice = finalPrice * Number(quantity);

        setCart((prevCart) => {
            // Check if the item already exists in the cart
            const existingItem = prevCart.items.find((item) => item.name === name);
            let updatedItems;

            if (existingItem) {
                // Update existing item
                updatedItems = prevCart.items.map((item) =>
                    item.name === name
                        ? {
                              ...item,
                              quantity: item.quantity + quantity,
                              totalPrice: item.totalPrice + itemTotalPrice,
                          }
                        : item
                );
            } else {
                // Add new item
                updatedItems = [
                    ...prevCart.items,
                    { name, price: finalPrice, quantity, totalPrice: itemTotalPrice, image },
                ];
            }

            return {
                items: updatedItems,
                totalPrice: prevCart.totalPrice + itemTotalPrice,
            };
        });
    };

    // Remove one quantity of an item from the cart
    const removeFromCart = (name) => {
        setCart((prevCart) => {
            const existingItem = prevCart.items.find((item) => item.name === name);
            if (!existingItem) return prevCart; // If not found, do nothing

            // If item’s quantity is more than 1, just decrement
            if (existingItem.quantity > 1) {
                const updatedItems = prevCart.items.map((item) =>
                    item.name === name
                        ? {
                              ...item,
                              quantity: item.quantity - 1,
                              totalPrice: item.totalPrice - item.price, // remove one price worth
                          }
                    : item
                );

                return {
                    items: updatedItems,
                    totalPrice: prevCart.totalPrice - existingItem.price,
                };
            } else {
                // If the quantity is exactly 1, remove the item entirely
                const updatedItems = prevCart.items.filter((item) => item.name !== name);
                const updatedTotalPrice = prevCart.totalPrice - existingItem.totalPrice;

                return {
                    items: updatedItems,
                    totalPrice: updatedTotalPrice,
                };
            }
        });
    };

    // Reset the cart
    const resetCart = () => {
        setCart({
            items: [],
            totalPrice: 0,
        });
    };

    // Apply discount based on wallet eligibility
    const applyDiscount = (isEligible) => {
        setDiscount(isEligible);
        setCart((prevCart) => {
            const adjustedItems = prevCart.items.map((item) => ({
                ...item,
                price: isEligible ? item.price * 0.85 : item.price / 0.85,
                totalPrice: isEligible
                    ? item.totalPrice * 0.85
                    : item.totalPrice / 0.85,
            }));

            return {
                items: adjustedItems,
                totalPrice: isEligible
                    ? prevCart.totalPrice * 0.85
                    : prevCart.totalPrice / 0.85,
            };
        });
    };

    return (
        <div className="App">
            <Navbar
                itemCount={cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                totalPrice={cart.totalPrice.toFixed(2)}
                cartItems={cart.items}
                resetCart={resetCart}
                removeFromCart={removeFromCart}
            />
            <ConnectWallet applyDiscount={applyDiscount} />
            <PlantList
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                discount={discount}
                cartItems={cart.items}  // <-- pass cart items
            />
        </div>
    );
};

export default App;
