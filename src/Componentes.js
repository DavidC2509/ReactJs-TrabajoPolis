import React from 'react';

export const MiLabel = (props) => {
    return (
        <div>
            <label {...props}></label>
        </div>
    )
};

export const MiBoton = (props) => {
    return (
        <div>
            <button type="submit" {...props}></button>
        </div>
    )
}
export const MiInput = (props) => {
    return (
        <div className="contenedor-input">
            <input {...props} />
        </div>
    )
}