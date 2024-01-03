import React, { createContext, useContext, useRef, useState } from "react";

const MapContext = createContext();

export const useMapContext = () => {
    return useContext(MapContext);
};

export const MapProvider = ({ children }) => {
    const mapRef = useRef(null);
    const [showDirection, setShowDirection] = useState(false);
    const [keyboardOpen, setKeyboardOpen] = useState(false);

    const value = {
        mapRef,
        showDirection,
        keyboardOpen,
        setShowDirection,
        setKeyboardOpen,
    };

    return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
