// app/context/EnvioContext.js
'use client';
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

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
        retirarEnLocal: false,
    });

    useEffect(() => {
        const storedAddress = localStorage.getItem('address');
        if (storedAddress) {
            setAddress(JSON.parse(storedAddress));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('address', JSON.stringify(address));
    }, [address]);

    const updateAddress = useCallback((newAddress) => {
        console.log("EnvioContext: updateAddress llamado con:", newAddress);
        setAddress(newAddress);
        console.log("EnvioContext: Datos de dirección guardados en el contexto:", newAddress);
    }, []);

    const value = useMemo(() => ({ address, updateAddress }), [address, updateAddress]);

    console.log("EnvioContext: address al renderizar:", address);

    return (
        <EnvioContext.Provider value={value}>
            {children}
        </EnvioContext.Provider>
    );
};