import React, { createContext, useContext, useState } from "react";

// Create the Context
const AuthContext = createContext();

// Create a custom hook for easy access to the context
export const useAuth = () => useContext(AuthContext);

// Create the Provider to manage global state
export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(true); // Default state: show login form

  // Function to toggle between login and registration
  const toggleAuthForm = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <AuthContext.Provider value={{ isLogin, toggleAuthForm }}>
      {children}
    </AuthContext.Provider>
  );
};
