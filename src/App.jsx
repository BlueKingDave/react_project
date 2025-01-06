import React, { useState } from 'react';
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

    // Add items to the cart
    const addToCart = (name, price, quantity) => {
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
                    { name, price: finalPrice, quantity, totalPrice: itemTotalPrice },
                ];
            }

            return {
                items: updatedItems,
                totalPrice: prevCart.totalPrice + itemTotalPrice,
            };
        });
    };

    // **Remove** an entire item from the cart
    const removeFromCart = (name) => {
        setCart((prevCart) => {
            const itemToRemove = prevCart.items.find((item) => item.name === name);
            if (!itemToRemove) return prevCart; // If not found, do nothing

            // Remove this item entirely from the cart
            const updatedItems = prevCart.items.filter((item) => item.name !== name);
            const updatedTotalPrice = prevCart.totalPrice - itemToRemove.totalPrice;

            return {
                items: updatedItems,
                totalPrice: updatedTotalPrice,
            };
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
