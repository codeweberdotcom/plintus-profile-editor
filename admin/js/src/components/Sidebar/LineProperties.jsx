import React from 'react';
import { distance, formatLengthMM } from '../../utils/geometry';

function LineProperties({ element, onUpdate }) {
    const lengthPixels = distance(element.start, element.end);
    const lengthText = formatLengthMM(lengthPixels);

    return (
        <div className="properties-form">
            <div className="property-group">
                <label>Length: <strong>{lengthText}</strong></label>
            </div>
        </div>
    );
}

export default LineProperties;

