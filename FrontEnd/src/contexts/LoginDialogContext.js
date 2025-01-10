import React, { createContext, useContext, useState } from "react";
import LoginDialog from "../components/LoginDialog"; // adapt path as needed
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const LoginDialogContext = createContext();

export function useLoginDialog() {
  return useContext(LoginDialogContext);
}

export function LoginDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const openLoginDialog = () => setIsOpen(true);
  const closeLoginDialog = () => setIsOpen(false);

  const handleOpenLoginDialog = () => {
    if (token) {
      navigate("/profile");
    } else {
      openLoginDialog();
    }
  };
  return (
    <LoginDialogContext.Provider
      value={{
        isOpen,
        openLoginDialog: handleOpenLoginDialog,
        closeLoginDialog,
      }}
    >
      {children}
      <LoginDialog isOpen={isOpen} onClose={closeLoginDialog} />
    </LoginDialogContext.Provider>
  );
}