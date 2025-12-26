import React from 'react';
import { distance, formatLengthMM } from '../../utils/geometry';

function LineProperties({ element, elements, onUpdate }) {
    // Если передан массив elements, вычисляем общую длину
    // Если передан один element, вычисляем его длину
    const lineElements = elements || (element ? [element] : []);
    
    let totalLengthPixels = 0;
    lineElements.forEach(lineEl => {
        if (lineEl.start && lineEl.end) {
            totalLengthPixels += distance(lineEl.start, lineEl.end);
        } else if (lineEl.length) {
            // Если длина уже вычислена, используем её
            totalLengthPixels += lineEl.length;
        }
    });
    
    const lengthText = formatLengthMM(totalLengthPixels);

    return (
        <div className="properties-form">
            <div className="property-group">
                <label>
                    Length: <strong>{lengthText}</strong>
                    {lineElements.length > 1 && (
                        <span className="property-hint"> ({lineElements.length} lines)</span>
                    )}
                </label>
            </div>
        </div>
    );
}

export default LineProperties;

