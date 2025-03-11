// app/context/EnvioContext.js
'use client';
import { createContext, useState } from 'react';

export const EnvioContext = createContext({});

export const EnvioProvider = ({ children }) => {
    const [address, setAddress] = useState({
        street: '',
        number: '',
        floor: '',
        apartment: '',
        postalCode: '',
        city: '',
        province: '',
    });

    const updateAddress = (newAddress) => {
        console.log("updateAddress llamado con:", newAddress)
        setAddress(newAddress);
        console.log("Datos de dirección guardados en el contexto:", newAddress);
    };

    return (
        <EnvioContext.Provider value={{ address, updateAddress }}>
            {children}
        </EnvioContext.Provider>
    );
};