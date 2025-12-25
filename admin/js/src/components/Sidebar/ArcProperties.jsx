import React from 'react';

function ArcProperties({ element, onUpdate }) {
    const handleCenterXChange = (e) => {
        onUpdate(element.id, {
            center: { ...element.center, x: parseFloat(e.target.value) },
        });
    };

    const handleCenterYChange = (e) => {
        onUpdate(element.id, {
            center: { ...element.center, y: parseFloat(e.target.value) },
        });
    };

    const handleRadiusChange = (e) => {
        onUpdate(element.id, {
            radius: parseFloat(e.target.value),
        });
    };

    const handleStartAngleChange = (e) => {
        onUpdate(element.id, {
            startAngle: parseFloat(e.target.value),
        });
    };

    const handleEndAngleChange = (e) => {
        onUpdate(element.id, {
            endAngle: parseFloat(e.target.value),
        });
    };

    return (
        <div className="properties-form">
            <div className="property-group">
                <label>Center Point</label>
                <div className="property-row">
                    <label>
                        X:
                        <input
                            type="number"
                            value={element.center.x}
                            onChange={handleCenterXChange}
                        />
                    </label>
                    <label>
                        Y:
                        <input
                            type="number"
                            value={element.center.y}
                            onChange={handleCenterYChange}
                        />
                    </label>
                </div>
            </div>

            <div className="property-group">
                <label>
                    Radius:
                    <input
                        type="number"
                        min="1"
                        value={element.radius}
                        onChange={handleRadiusChange}
                    />
                </label>
            </div>

            <div className="property-group">
                <label>
                    Start Angle:
                    <input
                        type="number"
                        min="0"
                        max="360"
                        value={element.startAngle}
                        onChange={handleStartAngleChange}
                    />
                </label>
            </div>

            <div className="property-group">
                <label>
                    End Angle:
                    <input
                        type="number"
                        min="0"
                        max="360"
                        value={element.endAngle}
                        onChange={handleEndAngleChange}
                    />
                </label>
            </div>
        </div>
    );
}

export default ArcProperties;

