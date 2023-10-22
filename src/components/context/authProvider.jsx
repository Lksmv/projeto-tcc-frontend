// authProvider.jsx
import React, { useReducer, useContext } from "react";
import { AuthContext } from "./authContext";
import authReducer from "./authReducer";

export const AuthProvider = ({ children }) => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    const initialUserInfo = {
        isLoggedIn: !!storedUserData,
        token: storedUserData?.token || null,
        usuario: storedUserData?.usuario || null,
        cargo: storedUserData?.cargo || null,
    };

    const [authState, authDispatch] = useReducer(authReducer, initialUserInfo);

    const login = (userData) => {
        authDispatch({
            type: "SET_LOGIN",
            payload: {
                isLoggedIn: true,
                token: userData.token,
                usuario: userData.usuario,
                cargo: userData.cargo,
            },
        });

        // Salvando no localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
    };

    const logout = () => {
        authDispatch({ type: "SET_LOGOUT" });
        localStorage.removeItem("userData");
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
