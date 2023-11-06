import { createContext, useEffect, useState } from "react";

export const LocalStorageContext = createContext();

export default function LocalStorageContextProvider({ children }) {
    // state for storing images
    const [storedImages, setStoredImages] = useState([]);

    // state for selecting images
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        // Retrieve the array from localStorage when the component mounts
        const imagesFromLocalStorage = JSON.parse(localStorage.getItem("images")) || [];
        setStoredImages(imagesFromLocalStorage);
    }, []);

    return (
        <LocalStorageContext.Provider value={{ storedImages, setStoredImages, selectedImages, setSelectedImages }}>
            {children}
        </LocalStorageContext.Provider>
    );
}