import React from 'react';

const CareScale = ({ scaleValue, careType }) => {
    const scaleType = careType === 'light' ? '☀️' : '💧';

    // Generate an array with `scaleValue` elements
    const filledIcons = [...Array(scaleValue)];

    return (
        <div className="care-scale">
            {filledIcons.map((_, index) => (
                <span key={index}>{scaleType}</span>
            ))}
        </div>
    );
};

export default CareScale;
