import {  createContext, useState } from "react";

export const themeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [dark, setDark] = useState(false);

    const toggle = () => setDark(d => !d);

    return (
        <themeContext.Provider value={{ dark, toggle }}>
            {children}
        </themeContext.Provider>
    );
};

