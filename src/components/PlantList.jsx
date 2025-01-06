import React from 'react';
import Plant from './Plant';

import monsteraImg from '../assets/monstera.png';
import snakePlantImg from '../assets/snake-plant.png';
import peaceLilyImg from '../assets/peace-lily.png';
import cactusImg from '../assets/cactus.png';
import fiddleLeafFigImg from '../assets/fiddle-leaf-fig.png';

const plants = [
    {
        id: 1,
        name: 'Monstera',
        price: 15,
        image: monsteraImg,
        description: 'A tropical plant with iconic split leaves, perfect for any home.',
        water: 3,
        light: 2,
    },
    {
        id: 2,
        name: 'Snake Plant',
        price: 12,
        image: snakePlantImg,
        description: 'A low-maintenance plant with striking upright leaves.',
        water: 1,
        light: 3,
    },
    {
        id: 2,
        name: 'Snake Plant',
        price: 12,
        image: snakePlantImg,
        description: 'A low-maintenance plant with striking upright leaves.',
        water: 1,
        light: 3,
    },
    {
        id: 3,
        name: 'Peace Lily',
        price: 18,
        image: peaceLilyImg,
        description: 'Known for its beautiful white blooms and air-purifying qualities.',
        water: 5,
        light: 2,
    },
    {
        id: 4,
        name: 'Cactus',
        price: 10,
        image: cactusImg,
        description: 'A resilient plant with charming pink flowers, ideal for beginners.',
        water: 1,
        light: 5,
    },
    {
        id: 5,
        name: 'Fiddle Leaf Fig',
        price: 25,
        image: fiddleLeafFigImg,
        description: 'A statement plant with large, glossy leaves for a modern look.',
        water: 4,
        light: 4,
    },
];

const PlantList = ({ addToCart, removeFromCart, discount, cartItems }) => {
    return (
        <div className="plant-list">
            {plants.map((plant) => {
                // Check if current plant is in the cart
                const isInCart = cartItems?.some(
                    (cartItem) => cartItem.name === plant.name
                );

                return (
                    <Plant
                        key={plant.id}
                        name={plant.name}
                        price={plant.price}
                        image={plant.image}
                        description={plant.description}
                        water={plant.water}
                        light={plant.light}
                        discount={discount}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                        inCart={isInCart}   // Pass the boolean to Plant
                    />
                );
            })}
        </div>
    );
};

export default PlantList;